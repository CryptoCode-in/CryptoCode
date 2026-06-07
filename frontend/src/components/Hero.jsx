import CountUp from "react-countup";
function Hero({ onOpenPanel }) {
  return (
    <>
      {/* HERO */}
      <section id="hero">
        <div className="aur aur-a" style={{ top: "-80px", left: "-120px" }}></div>
        <div className="aur aur-b" style={{ top: "180px", right: "-180px" }}></div>
        <div
          className="aur aur-a"
          style={{ bottom: "-80px", left: "45%", transform: "translateX(-50%)", opacity: 0.4 }}
        ></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="text-center">
            <div className="afu" style={{ animationDelay: ".05s" }}>
              <span className="hbadge">
                <span className="bdot"></span>Secure Code Execution • Smart Evaluation • Progress Tracking
              </span>
            </div>
            <h1 className="afu" style={{ animationDelay: ".12s", marginTop: "20px" }}>
              Secure Online Coding Platform
              <br />
              for <span className="gt">Students & Teachers</span>
            </h1>
            <p
              className="mx-auto afu"
              style={{
                maxWidth: "580px",
                fontSize: "clamp(.95rem, 1.8vw, 1.15rem)",
                color: "var(--tx2)",
                margin: "20px auto 36px",
                animationDelay: ".2s",
              }}
            >
              Practice coding, submit assignments and track progress through secure code execution, automated evaluation and teacher-friendly analytics.
            </p>
            <div
              className="d-flex align-items-center justify-content-center gap-3 flex-wrap afu"
              style={{ animationDelay: ".28s" }}
            >
              <button className="bgrd btn px-4 py-3 fs-6" onClick={() => onOpenPanel("signup")}>
                <i className="fa-solid fa-play me-2"></i>Start Coding
              </button>
              <a href="#features" className="boc btn px-4 py-3 fs-6">
                <i className="fa-solid fa-layer-group me-2" style={{ color: "var(--pur)" }}></i>Explore Features
              </a>
            </div>
            <div className="mt-5 afu" style={{ animationDelay: ".4s" }}>
              <p
                style={{
                  fontSize: ".71rem",
                  color: "var(--tx3)",
                  textTransform: "uppercase",
                  letterSpacing: ".12em",
                  marginBottom: "30px",
                }}
              >
               
              </p>
              <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap">
                
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="row justify-content-center mt-5">
            <div className="col-lg-11 adi">
              <div className="dwrap">
                <div className="dtbar">
                  <span className="dd" style={{ background: "#ff5f57" }}></span>
                  <span className="dd" style={{ background: "#ffbd2e" }}></span>
                  <span className="dd" style={{ background: "#28c840" }}></span>
                  <span
                    className="ms-auto me-auto"
                    style={{ fontSize: ".76rem", color: "var(--tx3)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    CryptoCode Dashboard — cryptocode.in/dashboard
                  </span>
                </div>
                <div className="dgrid">
                  <div className="dside">
                    <div
                      style={{
                        fontSize: ".64rem",
                        textTransform: "uppercase",
                        letterSpacing: ".1em",
                        color: "var(--tx3)",
                        padding: "0 10px 10px",
                        fontWeight: 700,
                      }}
                    >
                      Menu
                    </div>
                    <button className="dsi on">
                      <i className="fa-solid fa-gauge-high"></i> Dashboard
                    </button>
                    <button className="dsi">
                      <i className="fa-solid fa-code"></i> Code Editor
                    </button>
                    <button className="dsi">
                      <i className="fa-solid fa-file-code"></i> Assignments
                    </button>
                    <button className="dsi">
                      <i className="fa-solid fa-clock-rotate-left"></i> Submissions
                    </button>
                    <button className="dsi">
                      <i className="fa-solid fa-chart-line"></i> Analytics
                    </button>
                  </div>
                  <div className="p-3">
                    <div className="row g-2 mb-3">
                      <div className="col-6 col-sm-3">
                        <div className="stpill">
                          <div style={{ fontSize: "1.4rem", fontWeight: 700 }} className="gt">
                            500+
                          </div>
                          <div style={{ fontSize: ".67rem", color: "var(--tx3)" }}>Students</div>
                          <div style={{ fontSize: ".67rem", color: "#34d399", fontWeight: 600 }}>↑ 12%</div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-3">
                        <div className="stpill">
                          <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>2500+</div>
                          <div style={{ fontSize: ".67rem", color: "var(--tx3)" }}>Submissions</div>
                          <div style={{ fontSize: ".67rem", color: "#34d399", fontWeight: 600 }}>↑ 22%</div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-3">
                        <div className="stpill">
                          <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>120+</div>
                          <div style={{ fontSize: ".67rem", color: "var(--tx3)" }}>Assignments</div>
                          <div style={{ fontSize: ".67rem", color: "#a78bfa", fontWeight: 600 }}>Active</div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-3">
                        <div className="stpill">
                          <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>6+</div>
                          <div style={{ fontSize: ".67rem", color: "var(--tx3)" }}>Languages</div>
                          <div style={{ fontSize: ".67rem", color: "#60a5fa", fontWeight: 600 }}>Supported</div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-2">
                      <div className="col-sm-7">
                        <div
                          style={{
                            background: "var(--bg3)",
                            border: "1px solid var(--bd)",
                            borderRadius: "12px",
                            padding: "14px",
                          }}
                        >
                          <div style={{ fontSize: ".73rem", color: "var(--tx3)", marginBottom: "10px", fontWeight: 600 }}>
                            <i className="fa-solid fa-chart-bar me-1"></i>Student Coding Activity — Last 7 days
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "76px" }}>
                            <div className="bbar" style={{ height: "40%" }}></div>
                            <div className="bbar" style={{ height: "65%" }}></div>
                            <div className="bbar" style={{ height: "52%" }}></div>
                            <div className="bbar" style={{ height: "80%" }}></div>
                            <div className="bbar" style={{ height: "70%" }}></div>
                            <div className="bbar" style={{ height: "95%" }}></div>
                            <div className="bbar" style={{ height: "85%" }}></div>
                          </div>
                          <div
                            className="d-flex justify-content-between mt-2"
                            style={{ fontSize: ".62rem", color: "var(--tx3)" }}
                          >
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div
                          style={{
                            background: "var(--bg3)",
                            border: "1px solid var(--bd)",
                            borderRadius: "12px",
                            padding: "12px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div style={{ fontSize: ".71rem", color: "var(--tx3)", fontWeight: 600 }}>
                            <span
                              style={{
                                display: "inline-block",
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "var(--pur)",
                                boxShadow: "0 0 6px var(--pur)",
                                marginRight: "6px",
                                animation: "bpls 2s infinite",
                              }}
                            ></span>
                            Code Execution Monitor
                          </div>
                          <div
                            className="cbbl cbus"
                            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem" }}
                          >
                            run hello_world.py
                          </div>
                          <div
                            className="cbbl cbai"
                            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".72rem" }}
                          >
                            <strong>✓ Passed.</strong> Output: Hello, World! — 0.12s
                          </div>
                          <div style={{ display: "flex", gap: "4px", padding: "8px 12px" }}>
                            <div className="tdot"></div>
                            <div className="tdot" style={{ animationDelay: ".15s" }}></div>
                            <div className="tdot" style={{ animationDelay: ".3s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section id="proof">
        <div className="container">
          <div className="row g-3 align-items-center text-center">
            <div className="col-6 col-sm-3">
              <div className="pnum">500+</div>
              <div className="plbl">Active Students</div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="pnum">2500+</div>
              <div className="plbl">Code Submissions</div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="pnum">120+</div>
              <div className="plbl">Assignments</div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="pnum">6+</div>
              <div className="plbl">Languages</div>
            </div>
          </div>
          <div className="lscroll">
            <div className="ltrack">
              <span className="lbr">Python</span>
              <span className="lbr">Java</span>
              <span className="lbr">C++</span>
              <span className="lbr">JavaScript</span>
              <span className="lbr">PHP</span>
              <span className="lbr">C</span>
              <span className="lbr">GP Nashik</span>
              <span className="lbr">Plagiarism Detection</span>
              <span className="lbr">AI Code Review</span>
              <span className="lbr">Secure Sandbox</span>
              <span className="lbr">Python</span>
              <span className="lbr">Java</span>
              <span className="lbr">C++</span>
              <span className="lbr">JavaScript</span>
              <span className="lbr">PHP</span>
              <span className="lbr">C</span>
              <span className="lbr">GP Nashik</span>
              <span className="lbr">Plagiarism Detection</span>
              <span className="lbr">AI Code Review</span>
              <span className="lbr">Secure Sandbox</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
