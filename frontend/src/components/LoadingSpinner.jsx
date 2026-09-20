function LoadingSpinner({
    text = "Loading...",
    fullScreen = false,
}) {
    const spinner = (
        <div className="d-flex flex-column justify-content-center align-items-center py-4">
            <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </div>

            <p className="mt-3 text-secondary fw-semibold">
                {text}
            </p>
        </div>
    );

    if (fullScreen) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    minHeight: "100vh",
                    background: "#f8f9fa",
                }}
            >
                {spinner}
            </div>
        );
    }

    return spinner;
}

export default LoadingSpinner;