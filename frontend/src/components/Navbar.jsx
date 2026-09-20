import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Navbar({
    userName = "User",
    role = "CANDIDATE",
}) {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        sessionStorage.clear();

        navigate("/login");
    };

    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">

            <div className="container-fluid">

                <h4 className="mb-0 fw-bold text-primary">
                    DirectDoc
                </h4>

                <div className="d-flex align-items-center ms-auto">

                    <NotificationBell />

                    <div className="dropdown ms-4">

                        <button
                            className="btn btn-light dropdown-toggle"
                            data-bs-toggle="dropdown"
                        >

                            <i className="bi bi-person-circle me-2"></i>

                            {userName}

                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">

                            <li className="dropdown-header">

                                <strong>{userName}</strong>

                                <br />

                                <small className="text-muted">

                                    {role}

                                </small>

                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>

                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate(`/${role.toLowerCase()}/profile`)}
                                >
                                    <i className="bi bi-person me-2"></i>

                                    Profile

                                </button>

                            </li>

                            <li>

                                <button
                                    className="dropdown-item text-danger"
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>

                                    Logout

                                </button>

                            </li>

                        </ul>

                    </div>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;