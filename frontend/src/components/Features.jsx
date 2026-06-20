function Features() {
  return (
    <section id="features" className="sp" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div className="text-center mb-5 rv">
          <span className="slbl">Platform Features</span>
          <h2 className="stitle">
            Everything you need to <span className="gt">code & learn</span>
          </h2>
          <p className="ssub mx-auto">
            Powerful tools for students who want to grow and teachers who want to manage efficiently.
          </p>
        </div>
        <div className="row g-3">
          <div className="col-md-4 rv">
            <div className="gc p-4 h-100">
              <div className="ftico">
                <i className="fa-solid fa-code"></i>
              </div>
              <h3 className="fs-5 fw-semibold mb-2">Secure Code Editor</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Write and execute code securely in a browser-based sandboxed editor. No installation required. Code runs
                in an isolated environment.
              </p>
              <span className="ftag">Browser-based</span>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".05s" }}>
            <div className="gc p-4 h-100">
              <div className="ftico">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <h3 className="fs-5 fw-semibold mb-2">Multi Language Support</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Supports C, C++, Java, Python, JavaScript and PHP with syntax highlighting, auto-completion and
                real-time error feedback.
              </p>
              <span className="ftag">6+ Languages</span>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".1s" }}>
            <div className="gc p-4 h-100">
              <div className="ftico">
  <i className="fa-solid fa-folder-open"></i>
</div>
              <h3 className="fs-5 fw-semibold mb-2">Code History & Storage</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Students can save programs and access them later through organized language-wise code history folders.
              </p>
              <span className="ftag">Save & Reuse</span>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".15s" }}>
            <div className="gc p-4 h-100">
              <div className="ftico">
  <i className="fa-solid fa-bolt"></i>
</div>
              <h3 className="fs-5 fw-semibold mb-2">Real-Time Code Execution</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Compile and run programs instantly with immediate output and error feedback for faster learning and debugging.
              </p>
              <span className="ftag">Instant Output</span>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".2s" }}>
            <div className="gc p-4 h-100">
              <div className="ftico">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3 className="fs-5 fw-semibold mb-2">Progress Tracking</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Monitor coding performance, assignment completion and learning growth over time with detailed analytics
                and visual dashboards.
              </p>
              <span className="ftag">Real-time</span>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".25s" }}>
            <div className="gc p-4 h-100">
              <div className="ftico">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
              <h3 className="fs-5 fw-semibold mb-2">Teacher Monitoring Dashboard</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Teachers can monitor student coding activity, view submissions, track progress, and manage practical assignments from one dashboard.
              </p>
              <span className="ftag">Full control</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
