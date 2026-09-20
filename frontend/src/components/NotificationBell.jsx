import { useState } from "react";

function NotificationBell() {

    const [notifications] = useState([
        {
            id: 1,
            message: "New interview request received.",
            time: "2 min ago",
        },
        {
            id: 2,
            message: "Interview scheduled for tomorrow.",
            time: "1 hour ago",
        },
        {
            id: 3,
            message: "Candidate accepted your invitation.",
            time: "Yesterday",
        },
    ]);

    return (
        <div className="dropdown">

            <button
                className="btn btn-light position-relative"
                type="button"
                data-bs-toggle="dropdown"
            >
                <i className="bi bi-bell-fill fs-5"></i>

                {notifications.length > 0 && (
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    >
                        {notifications.length}
                    </span>
                )}
            </button>

            <ul
                className="dropdown-menu dropdown-menu-end shadow"
                style={{ width: "350px" }}
            >
                <li className="dropdown-header fw-bold">
                    Notifications
                </li>

                <hr className="dropdown-divider" />

                {notifications.length === 0 ? (
                    <li className="px-3 py-2 text-muted">
                        No notifications
                    </li>
                ) : (
                    notifications.map((item) => (
                        <li key={item.id}>
                            <div className="px-3 py-2">

                                <div className="fw-semibold">
                                    {item.message}
                                </div>

                                <small className="text-muted">
                                    {item.time}
                                </small>

                            </div>

                            <hr className="dropdown-divider m-0" />
                        </li>
                    ))
                )}

            </ul>

        </div>
    );
}

export default NotificationBell;