import React from "react";

function Hero({ onOpenPanel }) {
  return (
    <section id="hero" className="hero-section">
      {/* Subtle Ambient Background Glows & Grid */}
      <div className="hero-bg-glow hero-bg-glow-purple"></div>
      <div className="hero-bg-glow hero-bg-glow-blue"></div>
      <div className="hero-bg-grid"></div>

      <div className="container position-relative hero-container" style={{ zIndex: 2 }}>
        <div className="hero-grid">
          
          {/* LEFT COLUMN */}
          <div className="hero-left-col">
            <div className="hero-content">
              
              {/* Eyebrow Badge */}
              <div className="hero-badge-wrapper">
                <span className="hero-badge">
                  <span className="hero-badge-dot"></span>
                  Code &bull; Evaluate &bull; Track &bull; Improve
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="hero-title">
                Secure Online Coding Platform for{" "}
                <span className="hero-title-accent">Students & Teachers</span>
              </h1>

              {/* Subtitle / Description */}
              <p className="hero-description">
                Practice coding, submit assignments and track progress through secure code execution and teacher-friendly analytics.
              </p>

              {/* CTA Buttons */}
              <div className="hero-actions">
                <button
                  className="hero-btn hero-btn-primary"
                  onClick={() => onOpenPanel("signup")}
                >
                  <span>Start Coding</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <a href="#features" className="hero-btn hero-btn-secondary">
                  <span>Explore Features</span>
                  <i className="fa-solid fa-arrow-down"></i>
                </a>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN - CLEAN IDE MOCKUP VISUAL */}
          <div className="hero-right-col">
            <div className="hero-ide-wrapper">
              
              {/* Soft Radial Ambient Glow behind IDE */}
              <div className="hero-ide-glow"></div>

              {/* IDE Mockup Container */}
              <div className="hero-ide">
                
                {/* Top Window Header Bar */}
                <div className="hero-ide-header">
                  <div className="hero-ide-controls">
                    <span className="control-dot dot-close"></span>
                    <span className="control-dot dot-minimize"></span>
                    <span className="control-dot dot-expand"></span>
                  </div>
                  <div className="hero-ide-tabs">
                    <div className="hero-ide-tab active">
                      <i className="fa-solid fa-file-code file-icon-cpp"></i>
                      <span>main.cpp</span>
                    </div>
                  </div>
                  <div className="hero-ide-status">
                    <span className="status-badge success">
                      <i className="fa-solid fa-circle-check"></i> Executed
                    </span>
                  </div>
                </div>

                {/* Main IDE Body (Sidebar + Code Area) */}
                <div className="hero-ide-body">
                  
                  {/* Clean File Sidebar */}
                  <div className="hero-ide-sidebar">
                    <div className="sidebar-title">FILES</div>
                    <div className="sidebar-item active">
                      <i className="fa-solid fa-file-code"></i>
                      <span>main.cpp</span>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="hero-ide-editor">
                    <div className="editor-topbar">
                      <div className="lang-indicator">
                        <span className="lang-tag">C++</span>
                        <span className="lang-std">C++17</span>
                      </div>
                      <div className="run-button">
                        <i className="fa-solid fa-play"></i> Run
                      </div>
                    </div>

                    {/* Code Content */}
                    <div className="editor-code">
                      <div className="code-line">
                        <span className="line-num">1</span>
                        <span className="line-content">
                          <span className="token-pp">#include</span> <span className="token-str">&lt;iostream&gt;</span>
                        </span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">2</span>
                        <span className="line-content">
                          <span className="token-kw">using namespace</span> <span className="token-nm">std</span>;
                        </span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">3</span>
                        <span className="line-content"></span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">4</span>
                        <span className="line-content">
                          <span className="token-type">int</span> <span className="token-fn">main</span>() &#123;
                        </span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">5</span>
                        <span className="line-content indent">
                          <span className="token-var">cout</span> &lt;&lt; <span className="token-str">"Hello, CryptoCode!"</span>;
                        </span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">6</span>
                        <span className="line-content indent">
                          <span className="token-kw">return</span> <span className="token-num">0</span>;
                        </span>
                      </div>
                      <div className="code-line">
                        <span className="line-num">7</span>
                        <span className="line-content">&#125;</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Terminal / Output Section */}
                <div className="hero-ide-terminal">
                  <div className="terminal-header">
                    <span className="terminal-title">
                      <i className="fa-solid fa-terminal me-1"></i> TERMINAL (STDOUT)
                    </span>
                    <span className="terminal-exit-code">EXIT STATUS: 0</span>
                  </div>
                  <div className="terminal-output">
                    <div className="terminal-line success">
                      <span className="prompt">&gt;</span> CryptoCode: Execution Success!
                    </div>
                    <div className="terminal-line info">
                      Program finished in 0.03s
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
