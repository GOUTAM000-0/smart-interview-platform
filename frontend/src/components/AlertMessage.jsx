import Alert from "react-bootstrap/Alert";

function AlertMessage({ show, variant, message, onClose }) {

    if (!show) return null;

    return (
        <Alert
            variant={variant}
            dismissible
            onClose={onClose}
            className="auth-alert"
        >
            {message}
        </Alert>
    );
}

export default AlertMessage;