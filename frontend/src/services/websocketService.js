import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Render backend WebSocket endpoint
const WS_URL =
    import.meta.env.VITE_WS_URL ||
    "https://smartinterviewsystem-backend.onrender.com/ws";

class WebSocketService {

    constructor() {
        this.client = null;
        this.connected = false;
        this.subscriptions = {};
    }

    /**
     * Connect to Spring Boot WebSocket using SockJS + STOMP
     *
     * @param {string} token JWT token
     * @param {Function} onConnected callback after successful connection
     */
    connect(token, onConnected) {

        // Already connected
        if (this.client && this.connected) {

            if (onConnected) {
                onConnected();
            }

            return;
        }

        console.log("🔌 Connecting to WebSocket:");
        console.log(WS_URL);

        this.client = new Client({

            /*
             * IMPORTANT:
             * SockJS connects to the Render backend,
             * NOT the Netlify frontend.
             */
            webSocketFactory: () => {
                return new SockJS(WS_URL);
            },

            /*
             * Send JWT during STOMP CONNECT.
             */
            connectHeaders: token
                ? {
                    Authorization: `Bearer ${token}`
                }
                : {},

            /*
             * Automatically reconnect after 5 seconds.
             */
            reconnectDelay: 5000,

            /*
             * Disable STOMP debug logging.
             *
             * Do NOT use:
             * debug: (message) => {}
             *
             * because ESLint may report message as unused.
             */
            debug: () => {},

            /*
             * Successful STOMP connection
             */
            onConnect: (frame) => {

                this.connected = true;

                console.log("✅ WebSocket connected");
                console.log("STOMP session:", frame.headers);

                /*
                 * Restore subscriptions after reconnect.
                 */
                Object.entries(this.subscriptions).forEach(
                    ([destination, subscription]) => {

                        if (
                            subscription.callback &&
                            !subscription.stompSub
                        ) {

                            subscription.stompSub =
                                this.client.subscribe(
                                    destination,
                                    (message) => {

                                        try {

                                            const data =
                                                JSON.parse(message.body);

                                            subscription.callback(data);

                                        } catch (error) {

                                            console.error(
                                                "❌ Failed to parse WebSocket message:",
                                                error
                                            );

                                        }

                                    }
                                );

                        }

                    }
                );

                /*
                 * Notify caller.
                 */
                if (onConnected) {
                    onConnected();
                }

            },

            /*
             * WebSocket closed.
             */
            onDisconnect: () => {

                this.connected = false;

                console.log("❌ WebSocket disconnected");

            },

            /*
             * STOMP error.
             */
            onStompError: (frame) => {

                console.error(
                    "❌ STOMP error:",
                    frame.headers
                );

                console.error(
                    "STOMP error body:",
                    frame.body
                );

            },

            /*
             * General WebSocket error.
             */
            onWebSocketError: (error) => {

                console.error(
                    "❌ WebSocket error:",
                    error
                );

            }

        });

        /*
         * Start connection.
         */
        this.client.activate();
    }


    /**
     * Subscribe to a STOMP destination.
     *
     * Example:
     *
     * websocketService.subscribe(
     *     "/user/queue/invitations",
     *     (data) => {
     *         console.log(data);
     *     }
     * );
     */
    subscribe(destination, callback) {

        /*
         * Already subscribed.
         */
        if (this.subscriptions[destination]) {

            return this.subscriptions[destination].stompSub;

        }

        /*
         * Cannot subscribe before connection.
         */
        if (!this.client || !this.connected) {

            console.warn(
                `⚠️ Cannot subscribe to ${destination}: WebSocket is not connected`
            );

            /*
             * Store subscription request so it can be
             * restored after connection.
             */
            this.subscriptions[destination] = {
                callback,
                stompSub: null
            };

            return null;
        }

        /*
         * Create STOMP subscription.
         */
        const stompSub = this.client.subscribe(
            destination,
            (message) => {

                try {

                    const data =
                        JSON.parse(message.body);

                    callback(data);

                } catch (error) {

                    console.error(
                        "❌ Failed to parse WebSocket message:",
                        error
                    );

                }

            }
        );

        this.subscriptions[destination] = {
            callback,
            stompSub
        };

        console.log(
            `📡 Subscribed to ${destination}`
        );

        return stompSub;
    }


    /**
     * Remove a subscription.
     */
    unsubscribe(destination) {

        const entry =
            this.subscriptions[destination];

        if (!entry) {
            return;
        }

        if (entry.stompSub) {

            entry.stompSub.unsubscribe();

        }

        delete this.subscriptions[destination];

        console.log(
            `📴 Unsubscribed from ${destination}`
        );
    }


    /**
     * Send message to Spring Boot.
     *
     * Example:
     *
     * websocketService.send(
     *     "/app/signal",
     *     {
     *         ...
     *     }
     * );
     */
    send(destination, body = {}) {

        if (!this.client || !this.connected) {

            console.warn(
                `⚠️ WebSocket is not connected. Message dropped: ${destination}`
            );

            return;
        }

        this.client.publish({

            destination,

            body: JSON.stringify(body)

        });

        console.log(
            `📤 WebSocket message sent to ${destination}`,
            body
        );
    }


    /**
     * Disconnect WebSocket.
     */
    disconnect() {

        if (!this.client) {
            return;
        }

        /*
         * Remove subscriptions.
         */
        Object.keys(this.subscriptions).forEach(
            (destination) => {
                this.unsubscribe(destination);
            }
        );

        /*
         * Close STOMP connection.
         */
        this.client.deactivate();

        this.client = null;

        this.connected = false;

        console.log("🔌 WebSocket disconnected manually");
    }


    /**
     * Check connection status.
     */
    isConnected() {

        return this.connected;

    }

}


/*
 * Export a single WebSocketService instance.
 */
export default new WebSocketService();