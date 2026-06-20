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
          <div className="col-6 col-md-6 col-lg-3">
            <div className="lang-card">
              <div className="lang-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "48px", marginBottom: "12px", background: "none", WebkitTextFillColor: "initial", WebkitBackgroundClip: "initial" }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" alt="C Logo" style={{ width: "42px", height: "42px" }} />
              </div>
              <div className="fw-semibold mb-1">C Language</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                Systems programming & fundamentals
              </div>
              <span className="ftag">
                <i className="fa-solid fa-check me-1"></i>Supported
              </span>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="lang-card">
              <div className="lang-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "48px", marginBottom: "12px", background: "none", WebkitTextFillColor: "initial", WebkitBackgroundClip: "initial" }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++ Logo" style={{ width: "42px", height: "42px" }} />
              </div>
              <div className="fw-semibold mb-1">C++</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                OOP & competitive programming
              </div>
              <span className="ftag">
                <i className="fa-solid fa-check me-1"></i>Supported
              </span>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="lang-card">
              <div className="lang-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "48px", marginBottom: "12px", background: "none", WebkitTextFillColor: "initial", WebkitBackgroundClip: "initial" }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java Logo" style={{ width: "42px", height: "42px" }} />
              </div>
              <div className="fw-semibold mb-1">Java</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                Enterprise & academic standard
              </div>
              <span className="ftag">
                <i className="fa-solid fa-check me-1"></i>Supported
              </span>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3">
            <div className="lang-card">
              <div className="lang-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "48px", marginBottom: "12px", background: "none", WebkitTextFillColor: "initial", WebkitBackgroundClip: "initial" }}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python Logo" style={{ width: "42px", height: "42px" }} />
              </div>
              <div className="fw-semibold mb-1">Python</div>
              <div style={{ fontSize: ".78rem", color: "var(--tx3)", marginBottom: "8px" }}>
                Data science & scripting
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
