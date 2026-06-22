function ProgressCards() {
  return (
    <div id="progress-section" style={{ marginBottom: "32px" }}>
      {/* Title Header */}
      <div className="mb-4">
        <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
          Learning Analytics
        </h4>
        <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: 0 }}>
          Detailed view of your academic performance and language metrics.
        </p>
      </div>

      {/* Section 1: Progress Overview (Full-width line graph) */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="cyber-card p-4">
            <h5 className="mb-4" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 16px 0" }}>
              Progress Overview
            </h5>
            <div style={{ width: "100%", height: "260px" }}>
              <svg viewBox="0 0 800 250" width="100%" height="100%" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--pur)" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="var(--pur)" stopOpacity="0.00" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="60" y1="40" x2="760" y2="40" stroke="var(--bd)" strokeDasharray="3 3" />
                <line x1="60" y1="96.7" x2="760" y2="96.7" stroke="var(--bd)" strokeDasharray="3 3" />
                <line x1="60" y1="153.3" x2="760" y2="153.3" stroke="var(--bd)" strokeDasharray="3 3" />
                <line x1="60" y1="210" x2="760" y2="210" stroke="var(--bd)" />

                {/* Area Fill */}
                <path
                  d="M 60 181.7 L 200 142 L 340 164.7 L 480 125 L 620 96.7 L 760 68.3 L 760 210 L 60 210 Z"
                  fill="url(#gradient-area)"
                />

                {/* Trend Line */}
                <path
                  d="M 60 181.7 L 200 142 L 340 164.7 L 480 125 L 620 96.7 L 760 68.3"
                  fill="none"
                  stroke="var(--pur)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points and Values */}
                {[
                  { x: 60, y: 181.7, val: 5 },
                  { x: 200, y: 142, val: 12 },
                  { x: 340, y: 164.7, val: 8 },
                  { x: 480, y: 125, val: 15 },
                  { x: 620, y: 96.7, val: 20 },
                  { x: 760, y: 68.3, val: 25 }
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="var(--bg)"
                      stroke="var(--pur)"
                      strokeWidth="3"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      fill="var(--tx)"
                      fontSize="0.75rem"
                      fontWeight="600"
                    >
                      {pt.val}
                    </text>
                  </g>
                ))}

                {/* Y-axis Labels */}
                <text x="45" y="44" textAnchor="end" fill="var(--tx3)" fontSize="0.72rem">30</text>
                <text x="45" y="100.7" textAnchor="end" fill="var(--tx3)" fontSize="0.72rem">20</text>
                <text x="45" y="157.3" textAnchor="end" fill="var(--tx3)" fontSize="0.72rem">10</text>
                <text x="45" y="214" textAnchor="end" fill="var(--tx3)" fontSize="0.72rem">0</text>

                {/* X-axis Labels */}
                {[
                  { label: "Jan", x: 60 },
                  { label: "Feb", x: 200 },
                  { label: "Mar", x: 340 },
                  { label: "Apr", x: 480 },
                  { label: "May", x: 620 },
                  { label: "Jun", x: 760 }
                ].map((m, idx) => (
                  <text
                    key={idx}
                    x={m.x}
                    y="232"
                    textAnchor="middle"
                    fill="var(--tx2)"
                    fontSize="0.75rem"
                    fontWeight="600"
                  >
                    {m.label}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Row containing Language Progress and Programs Executed */}
      <div className="row g-4">
        {/* Section 2: Language Progress */}
        <div className="col-12 col-lg-6">
          <div className="cyber-card p-4 h-100">
            <h5 className="mb-4" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 16px 0" }}>
              Language Progress
            </h5>
            <div className="d-flex flex-column gap-3">
              {[
                { lang: "C Programming", completed: 12, total: 15, color: "#3b82f6" },
                { lang: "C++ Programming", completed: 8, total: 12, color: "#8b5cf6" },
                { lang: "Java Programming", completed: 10, total: 16, color: "#f59e0b" },
                { lang: "Python Programming", completed: 14, total: 18, color: "#10b981" }
              ].map((item, idx) => {
                const percentage = Math.round((item.completed / item.total) * 100);
                return (
                  <div key={idx}>
                    <div className="d-flex justify-content-between align-items-center mb-1.5" style={{ fontSize: "0.82rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--tx)" }}>{item.lang}</span>
                      <span style={{ color: "var(--tx2)" }}>
                        {item.completed} / {item.total} Completed ({percentage}%)
                      </span>
                    </div>
                    <div style={{ height: "8px", background: "var(--bg3)", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${percentage}%`,
                          background: item.color,
                          borderRadius: "4px",
                          transition: "width 1s ease"
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Programs Executed by Language */}
        <div className="col-12 col-lg-6">
          <div className="cyber-card p-4 h-100">
            <h5 className="mb-4" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 16px 0" }}>
              Programs Executed by Language
            </h5>
            <div style={{ width: "100%", height: "200px" }}>
              <svg viewBox="0 0 400 200" width="100%" height="100%" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="grad-c" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <linearGradient id="grad-cpp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                  <linearGradient id="grad-java" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <linearGradient id="grad-python" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="50" y1="30" x2="380" y2="30" stroke="var(--bd)" strokeDasharray="3 3" />
                <line x1="50" y1="75" x2="380" y2="75" stroke="var(--bd)" strokeDasharray="3 3" />
                <line x1="50" y1="120" x2="380" y2="120" stroke="var(--bd)" strokeDasharray="3 3" />
                <line x1="50" y1="165" x2="380" y2="165" stroke="var(--bd)" />

                {/* Bars */}
                {[
                  { lang: "C", count: 45, grad: "url(#grad-c)", x: 85 },
                  { lang: "C++", count: 32, grad: "url(#grad-cpp)", x: 165 },
                  { lang: "Java", count: 68, grad: "url(#grad-java)", x: 245 },
                  { lang: "Python", count: 94, grad: "url(#grad-python)", x: 325 }
                ].map((bar, idx) => {
                  const barHeight = (bar.count / 100) * 135;
                  const barY = 165 - barHeight;
                  return (
                    <g key={idx}>
                      <rect
                        x={bar.x - 16}
                        y={barY}
                        width="32"
                        height={barHeight}
                        fill={bar.grad}
                        rx="4"
                        ry="4"
                      />
                      <text
                        x={bar.x}
                        y={barY - 8}
                        textAnchor="middle"
                        fill="var(--tx)"
                        fontSize="0.75rem"
                        fontWeight="600"
                      >
                        {bar.count}
                      </text>
                      <text
                        x={bar.x}
                        y="185"
                        textAnchor="middle"
                        fill="var(--tx2)"
                        fontSize="0.75rem"
                        fontWeight="600"
                      >
                        {bar.lang}
                      </text>
                    </g>
                  );
                })}

                {/* Y Axis Labels */}
                <text x="38" y="34" textAnchor="end" fill="var(--tx3)" fontSize="0.72rem">100</text>
                <text x="38" y="79" textAnchor="end" fill="var(--tx3)" fontSize="0.72rem">75</text>
                <text x="38" y="124" textAnchor="end" fill="var(--tx3)" fontSize="0.72rem">50</text>
                <text x="38" y="169" textAnchor="end" fill="var(--tx3)" fontSize="0.72rem">0</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressCards;
