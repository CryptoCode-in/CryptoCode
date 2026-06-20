function Security() {
  return (
    <section id="security" className="sp" style={{ background: "var(--bg2)" }}>
      <div className="aur aur-a" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}></div>
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5 rv">
          <span className="slbl">Security</span>
          <h2 className="stitle">
            Why CryptoCode is <span className="gt">Secure</span>
          </h2>
          <p className="ssub mx-auto">Built with security-first principles for academic environments and coding labs.</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4 rv">
            <div className="gc p-4 h-100">
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(52, 211, 153, 0.1)",
                  border: "1px solid rgba(52, 211, 153, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <i className="fa-solid fa-box fa-lg" style={{ color: "#34d399" }}></i>
              </div>
              <h3 className="fw-semibold fs-5 mb-2">Protected Code Execution</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Programs run in a controlled environment to prevent unauthorized system access.
              </p>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".08s" }}>
            <div className="gc p-4 h-100">
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <i className="fa-solid fa-database" style={{ color: "#60a5fa" }}></i>
              </div>
              <h3 className="fw-semibold fs-5 mb-2">Secure Data Storage</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Student records, code history, and submissions are securely stored and protected.
              </p>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".16s" }}>
            <div className="gc p-4 h-100">
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(139, 92, 246, 0.12)",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <i className="fa-solid fa-user-shield fa-lg" style={{ color: "#a78bfa" }}></i>
              </div>
              <h3 className="fw-semibold fs-5 mb-2">Secure Authentication</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Protected login system with secure session management for students and teachers.
              </p>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".24s" }}>
            <div className="gc p-4 h-100">
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <i className="fa-solid fa-chart-line" style={{ color: "#fbbf24" }}></i>
              </div>
              <h3 className="fw-semibold fs-5 mb-2">Activity Monitoring</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Coding activity and submissions are monitored to maintain accountability and transparency.
              </p>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".32s" }}>
            <div className="gc p-4 h-100">
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <i className="fa-solid fa-shield-halved fa-lg" style={{ color: "#f87171" }}></i>
              </div>
              <h3 className="fw-semibold fs-5 mb-2">Session Protection</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Active sessions are protected against unauthorized access and misuse.
              </p>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".4s" }}>
            <div className="gc p-4 h-100">
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(52, 211, 153, 0.1)",
                  border: "1px solid rgba(52, 211, 153, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <i className="fa-solid fa-sitemap fa-lg" style={{ color: "#34d399" }}></i>
              </div>
              <h3 className="fw-semibold fs-5 mb-2">Role-Based Access Control</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Separate permissions ensure users only access features and data relevant to their role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Security;
