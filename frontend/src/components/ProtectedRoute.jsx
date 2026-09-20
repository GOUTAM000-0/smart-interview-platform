import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

function ProtectedRoute({

    children,

    allowedRoles = []

}) {

    const {

        user,

        isAuthenticated

    } = useAuth();

    // User not logged in
    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;

    }

    // User information not loaded yet
    if (!user) {

        return (
            <LoadingSpinner
                text="Loading..."
                fullScreen
            />
        );

    }

    // Role validation
    if (

        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)

    ) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );

    }

    return children;

}

export default ProtectedRoute;