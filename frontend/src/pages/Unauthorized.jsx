import { Link } from "react-router-dom";

function Unauthorized() {

    return (

        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >

            <div className="text-center">

                <h1 className="display-4 text-danger">
                    403
                </h1>

                <h3>
                    Access Denied
                </h3>

                <p className="text-muted">
                    You don't have permission to access this page.
                </p>

                <Link
                    to="/login"
                    className="btn btn-primary"
                >
                    Go to Login
                </Link>

            </div>

        </div>

    );

}

export default Unauthorized;