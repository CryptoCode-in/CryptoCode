function HowItWorks() {
  return (
    <section id="how" className="sp" style={{ background: "var(--bg3)" }}>
      <div className="container">
        <div className="text-center mb-5 rv">
          <span className="slbl">How It Works</span>
          <h2 className="stitle">
            How <span className="gt">CryptoCode</span> works
          </h2>
        </div>
        <div className="row g-4">
          <div className="col-md-3 rv">
            <div className="gc p-4 h-100 text-center">
              <div className="hnum">1</div>
              <h3 className="fs-5 fw-semibold mb-2">🔐 Login Securely</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Students and teachers access CryptoCode through secure role-based authentication.
              </p>
            </div>
          </div>
          <div className="col-md-3 rv" style={{ transitionDelay: ".08s" }}>
            <div className="gc p-4 h-100 text-center">
              <div className="hnum">2</div>
              <h3 className="fs-5 fw-semibold mb-2">💻 Start Coding</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Open the coding workspace, choose a programming language, and begin writing practical programs.
              </p>
            </div>
          </div>
          <div className="col-md-3 rv" style={{ transitionDelay: ".16s" }}>
            <div className="gc p-4 h-100 text-center">
              <div className="hnum">3</div>
              <h3 className="fs-5 fw-semibold mb-2">⚡ Run & Save Code</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Execute code instantly, view output, and save programs to Code History for future access.
              </p>
            </div>
          </div>
          <div className="col-md-3 rv" style={{ transitionDelay: ".24s" }}>
            <div className="gc p-4 h-100 text-center">
              <div className="hnum">4</div>
              <h3 className="fs-5 fw-semibold mb-2">📊 Teacher Monitoring</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Teachers monitor coding activity, review submissions, and track student progress through the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
