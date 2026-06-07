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
              <h3 className="fs-5 fw-semibold mb-2">Register Account</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Sign up as a student or teacher. Your account is secured with role-based authentication and access
                control.
              </p>
            </div>
          </div>
          <div className="col-md-3 rv" style={{ transitionDelay: ".08s" }}>
            <div className="gc p-4 h-100 text-center">
              <div className="hnum">2</div>
              <h3 className="fs-5 fw-semibold mb-2">Write Code</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Open the secure browser editor, select your language and start writing. AI suggestions appear as you
                type.
              </p>
            </div>
          </div>
          <div className="col-md-3 rv" style={{ transitionDelay: ".16s" }}>
            <div className="gc p-4 h-100 text-center">
              <div className="hnum">3</div>
              <h3 className="fs-5 fw-semibold mb-2">Run & Submit</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Execute your code in a sandboxed environment. See output instantly, then submit your assignment with
                one click.
              </p>
            </div>
          </div>
          <div className="col-md-3 rv" style={{ transitionDelay: ".24s" }}>
            <div className="gc p-4 h-100 text-center">
              <div className="hnum">4</div>
              <h3 className="fs-5 fw-semibold mb-2">Teacher Reviews</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Teachers review submissions, check plagiarism reports, grade performance and provide feedback from the
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
