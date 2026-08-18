package com.example.loginsystem.config;

import com.example.loginsystem.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;

import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtUtil jwtUtil;


    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry registry) {

        registry.enableSimpleBroker(
                "/topic",
                "/queue"
        );

        registry.setApplicationDestinationPrefixes(
                "/app"
        );

        registry.setUserDestinationPrefix(
                "/user"
        );
    }


    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }


    @Override
    public void configureClientInboundChannel(
            ChannelRegistration registration) {

        registration.interceptors(
                new ChannelInterceptor() {

                    @Override
                    public Message<?> preSend(
                            Message<?> message,
                            MessageChannel channel) {

                        StompHeaderAccessor accessor =
                                MessageHeaderAccessor.getAccessor(
                                        message,
                                        StompHeaderAccessor.class
                                );

                        if (accessor != null &&
                                StompCommand.CONNECT.equals(
                                        accessor.getCommand())) {

                            String authHeader =
                                    accessor.getFirstNativeHeader(
                                            "Authorization"
                                    );

                            if (authHeader != null &&
                                    authHeader.startsWith("Bearer ")) {

                                String token =
                                        authHeader.substring(7);

                                try {

                                    String email =
                                            jwtUtil.extractEmail(token);

                                    if (email != null &&
                                            jwtUtil.validateToken(
                                                    token,
                                                    email
                                            )) {

                                        accessor.setUser(
                                                (Principal) () -> email
                                        );

                                        System.out.println(
                                                "✅ WebSocket authenticated: "
                                                        + email
                                        );
                                    }

                                } catch (Exception ex) {

                                    System.out.println(
                                            "❌ WebSocket JWT authentication failed"
                                    );

                                }
                            }
                        }

                        return message;
                    }
                }
        );
    }
}