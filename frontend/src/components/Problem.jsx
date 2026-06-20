function Problem() {
  return (
    <section id="problem" className="sp position-relative">
      <div className="aur aur-b" style={{ top: "50%", right: "-200px", transform: "translateY(-50%)" }}></div>
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5 rv">
          <span className="slbl">The Problem</span>
          <h2 className="stitle">
            Challenges in Modern <span className="gt">Coding Education</span>
          </h2>
          
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
              <h3 className="fw-semibold fs-5 mb-2">Complex Setup & Execution</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Students spend valuable time configuring compilers and environments instead of focusing on learning and coding.
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
              <h3 className="fw-semibold fs-5 mb-2">Manual Evaluation</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Reviewing and grading coding assignments manually is time-consuming and difficult to scale for educators.
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
              <h3 className="fw-semibold fs-5 mb-2">Limited Progress Tracking</h3>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)" }}>
                Without centralized insights, monitoring student performance and coding growth becomes challenging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Problem;
