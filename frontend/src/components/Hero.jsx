import CountUp from "react-countup";
import logob from "../assets/images/logob.png";
import logow from "../assets/images/logow.png";

function Hero({ onOpenPanel }) {
  return (
    <>
      {/* HERO */}
      <section id="hero" className="hero-split-section">
        {/* Soft Background Glows */}
        <div className="hero-glow-purple"></div>
        <div className="hero-glow-cyan"></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            {/* LEFT SIDE (approximately 50% on desktop) */}
            <div className="col-12 col-lg-7 hero-left-col">
              <div className="hero-content">
                <div className="afu" style={{ animationDelay: ".05s", marginBottom: "28px" }}>
                  <span className="hbadge">
                    <span className="bdot"></span> Code  •  Evaluate  •  Track  •  Improve
                  </span>
                </div>
                
                <h1 className="afu hero-main-heading" style={{ animationDelay: ".12s", margin: "0 0 32px 0" }}>
                  Secure Online Coding Platform
                  <br />
                  for <span className="gt">Students & Teachers</span>
                </h1>
                
                <p
                  className="afu hero-desc"
                  style={{
                    fontSize: "clamp(.95rem, 1.8vw, 1.15rem)",
                    color: "var(--tx2)",
                    animationDelay: ".2s",
                    margin: "0 0 32px 0",
                  }}
                >
                  Practice coding, submit assignments and track <br />progress through
                  secure code execution and <br /> teacher-friendly analytics.
                </p>
                
                <div
                  className="d-flex align-items-center flex-wrap afu hero-ctas"
                  style={{ animationDelay: ".28s", marginBottom: "32px", gap: "16px" }}
                >
                  <button className="bgrd btn px-4 py-3 fs-6" onClick={() => onOpenPanel("signup")}>
                    <i className="fa-solid fa-play me-2"></i>Start Coding
                  </button>
                  <a href="#features" className="boc btn px-4 py-3 fs-6">
                    <i className="fa-solid fa-layer-group me-2" style={{ color: "var(--pur)" }}></i>Explore Features
                  </a>
                </div>

               {/* Subtle Stats Badges */}
                <div className="hero-stats-row afu" style={{ animationDelay: ".35s", marginTop: "0" }}>
                  
                  
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (approximately 50% on desktop) */}
            <div className="col-12 col-lg-5 hero-right-col mt-5 mt-lg-0 d-flex justify-content-center">
              <div className="hero-right afu" style={{ animationDelay: ".4s" }}>
                <div className="logo-showcase-container">
                  {/* Soft purple glow behind the logo */}
                  <div className="logo-glow-behind"></div>

                  {/* Concentric Orbit Rings (3 perfectly concentric rings) */}
                  <div className="logo-orbit-ring r-inner"></div>
                  <div className="logo-orbit-ring r-middle"></div>
                  <div className="logo-orbit-ring r-outer"></div>

                  {/* Repeated Branding text ring */}
                  <div className="branding-text-ring">
                    <svg viewBox="0 0 200 200" width="100%" height="100%">
                      <path
                        id="brandingPath"
                        d="M 100, 100 m -95, 0 a 95,95 0 1,1 190,0 a 95,95 0 1,1 -190,0"
                        fill="none"
                      />
                      <text fill="rgba(139, 92, 246, 0.16)" fontSize="7" letterSpacing="3.5" fontFamily="monospace" fontWeight="700">
                        <textPath href="#brandingPath" startOffset="0%">
                          CC • CRYPTOCODE • CC • CRYPTOCODE • CC • CRYPTOCODE • CC • CRYPTOCODE • CC • CRYPTOCODE •
                        </textPath>
                      </text>
                    </svg>
                  </div>

                  {/* Floating Particles */}
                  <div className="floating-particle p1"></div>
                  <div className="floating-particle p2"></div>
                  <div className="floating-particle p3"></div>
                  <div className="floating-particle p4"></div>
                  <div className="floating-particle p5"></div>
                  <div className="floating-particle p6"></div>
                  <div className="floating-particle p7"></div>
                  <div className="floating-particle p8"></div>
                  
                  {/* Floating Tech/Coding Symbols */}
                  <div className="float-tech-element t1">&lt;/&gt;</div>
                  <div className="float-tech-element t2">&#123;&#125;</div>
                  <div className="float-tech-element t4">[]</div>
                  <div className="float-tech-element t5">&gt;</div>
                  
                  {/* Cinematic Central Logo Showcase */}
                  <div className="central-logo-wrapper">
                    <div className="central-logo-inner">
                      <img src={logob} className="showcase-logo-emblem" alt="CryptoCode Emblem" />
                    </div>
                  </div>
                  
                  {/* 8 Symmetrical Satellites at Exact Clock Positions */}
                  {/* Python (12 O'Clock) */}
                  <div className="float-badge-card python">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" />
                  </div>
                  
                  {/* Java (2 O'Clock) */}
                  <div className="float-badge-card java">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" />
                  </div>

                  {/* JavaScript (4 O'Clock) */}
                  <div className="float-badge-card js">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />
                  </div>

                  {/* HTML5 (5 O'Clock) */}
                  <div className="float-badge-card html5">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" />
                  </div>

                  {/* C (6 O'Clock) */}
                  <div className="float-badge-card c">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" alt="C" />
                  </div>

                  {/* PHP (7 O'Clock) */}
                  <div className="float-badge-card php">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" alt="PHP" />
                  </div>

                  {/* Node JS (9 O'Clock) */}
                  <div className="float-badge-card node">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node JS" />
                  </div>
                  
                  {/* C++ (10 O'Clock) */}
                  <div className="float-badge-card cpp">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" />
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
              <span className="lbr">C</span>
              <span className="lbr">GP Nashik</span>
              <span className="lbr">Secure Sandbox</span>
              <span className="lbr">Python</span>
              <span className="lbr">Java</span>
              <span className="lbr">C++</span>
              <span className="lbr">C</span>
              <span className="lbr">GP Nashik</span>
              <span className="lbr">Secure Sandbox</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
