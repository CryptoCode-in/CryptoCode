import { Code, BookOpen, Percent, Flame } from "lucide-react";

function ProgressCards() {
  const metrics = [
    {
      title: "Problems Solved",
      value: "42",
      total: "150",
      percent: 28,
      color: "var(--pur)",
      icon: Code,
    },
    {
      title: "Assignments Submitted",
      value: "18",
      total: "25",
      percent: 72,
      color: "#60a5fa",
      icon: BookOpen,
    },
    {
      title: "Success Rate",
      value: "84%",
      total: "Avg score",
      percent: 84,
      color: "#34d399",
      icon: Percent,
    },
    {
      title: "Current Streak",
      value: "14 Days",
      total: "Personal record: 22",
      percent: 63,
      color: "#fbbf24",
      icon: Flame,
    },
  ];

  return (
    <div id="progress-section" style={{ marginBottom: "32px" }}>
      <div className="mb-3">
        <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
          Learning Analytics
        </h4>
        <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: 0 }}>
          Detailed view of your coding performance and consistency.
        </p>
      </div>

      <div className="row g-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div className="col-12 col-sm-6 col-lg-3" key={index}>
              <div
                style={{
                  background: "var(--sf)",
                  border: "1px solid var(--bd)",
                  borderRadius: "16px",
                  padding: "20px",
                  height: "100%",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div style={{ color: "var(--tx2)", fontSize: "0.85rem", fontWeight: 600 }}>{metric.title}</div>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(139,92,246,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: metric.color,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                </div>

                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--tx)" }}>{metric.value}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--tx3)" }}>/ {metric.total}</span>
                </div>

                {/* Custom Progress Bar */}
                <div style={{ height: "6px", background: "var(--bg3)", borderRadius: "3px", overflow: "hidden", marginTop: "12px" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${metric.percent}%`,
                      background: metric.color,
                      borderRadius: "3px",
                      transition: "width 1s ease",
                    }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2" style={{ fontSize: "0.68rem", color: "var(--tx3)" }}>
                  <span>Progress</span>
                  <span style={{ fontWeight: 600 }}>{metric.percent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressCards;
