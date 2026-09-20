function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="left-section">
        <h1>Welcome to Login System</h1>

        <p>
          Secure authentication system built with React,
          Spring Boot and MySQL.
        </p>
      </div>

      <div className="right-section">
        <div className="auth-card">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;