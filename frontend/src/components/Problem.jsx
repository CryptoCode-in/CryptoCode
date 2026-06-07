function Problem() {
  return (
    <section className="sp position-relative">
      <div className="aur aur-b" style={{ top: "50%", right: "-200px", transform: "translateY(-50%)" }}></div>
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5 rv">
          <span className="slbl">The Problem</span>
          <h2 className="stitle">
            Traditional coding labs are <span className="gt">broken</span>
          </h2>
          <p className="ssub mx-auto">
            Students and teachers waste time on manual setup, evaluation and plagiarism checking.
          </p>
        </div>
        <div className="row g-4">
          <div className="col-md-4 rv">
            <div className="gc p-4 h-100">
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <i className="fa-solid fa-desktop fa-lg" style={{ color: "#f87171" }}></i>
              </div>
              <h3 className="fw-semibold fs-5 mb-2">No Secure Environment</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Students need to install complex compilers and IDEs locally. Code runs unsandboxed, causing security
                risks and setup failures.
              </p>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".1s" }}>
            <div className="gc p-4 h-100">
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <i className="fa-solid fa-copy fa-lg" style={{ color: "#fbbf24" }}></i>
              </div>
              <h3 className="fw-semibold fs-5 mb-2">Rampant Plagiarism</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Manual checking of code submissions is time-consuming and unreliable. Copied code often goes undetected,
                undermining academic integrity.
              </p>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".2s" }}>
            <div className="gc p-4 h-100">
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(99, 102, 241, 0.12)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                <i className="fa-solid fa-chart-bar fa-lg" style={{ color: "#a78bfa" }}></i>
              </div>
              <h3 className="fw-semibold fs-5 mb-2">No Progress Visibility</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Teachers have no centralized view of student performance. Tracking assignment completion and coding skill
                growth is nearly impossible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Problem;
