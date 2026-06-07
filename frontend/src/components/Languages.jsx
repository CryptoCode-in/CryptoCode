function Languages() {
  return (
    <section id="languages" className="sp position-relative">
      <div className="aur aur-b" style={{ top: "50%", right: "-200px", transform: "translateY(-50%)" }}></div>
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5 rv">
          <span className="slbl">Languages</span>
          <h2 className="stitle">
            Supported <span className="gt">Programming Languages</span>
          </h2>
          <p className="ssub mx-auto">
            Write, execute and analyze code in all major academic programming languages with full syntax support.
          </p>
        </div>
        <div className="row g-3 justify-content-center rv">
          <div className="col-6 col-md-4">
            <div className="lang-card">
              <div className="lang-icon">C</div>
              <div className="fw-semibold mb-1">C Language</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                Systems programming & fundamentals
              </div>
              <span className="ftag">
                <i className="fa-solid fa-check me-1"></i>Supported
              </span>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="lang-card">
              <div className="lang-icon">C++</div>
              <div className="fw-semibold mb-1">C++</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                OOP & competitive programming
              </div>
              <span className="ftag">
                <i className="fa-solid fa-check me-1"></i>Supported
              </span>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="lang-card">
              <div className="lang-icon">☕</div>
              <div className="fw-semibold mb-1">Java</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                Enterprise & academic standard
              </div>
              <span className="ftag">
                <i className="fa-solid fa-check me-1"></i>Supported
              </span>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="lang-card">
              <div className="lang-icon">Py</div>
              <div className="fw-semibold mb-1">Python</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                Data science & scripting
              </div>
              <span className="ftag">
                <i className="fa-solid fa-check me-1"></i>Supported
              </span>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="lang-card">
              <div className="lang-icon">JS</div>
              <div className="fw-semibold mb-1">JavaScript</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                Web development & scripting
              </div>
              <span className="ftag">
                <i className="fa-solid fa-check me-1"></i>Supported
              </span>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="lang-card">
              <div className="lang-icon">PHP</div>
              <div className="fw-semibold mb-1">PHP</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                Server-side & web backend
              </div>
              <span className="ftag">
                <i className="fa-solid fa-check me-1"></i>Supported
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Languages;
