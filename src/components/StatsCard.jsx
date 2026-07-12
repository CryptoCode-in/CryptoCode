import { motion } from "framer-motion";
import { Terminal, Code, FileText, CheckCircle } from "lucide-react";

function StatsCard({ programsExecuted = 142, problemsSolved = 35, assignmentsSubmitted = 18, practicalsCompleted = 40 }) {
  const stats = [
    {
      label: "Programs Executed",
      value: programsExecuted,
      color: "#60a5fa", // Blue
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.2)",
      icon: Terminal,
      subtext: "Compile history active"
    },
    {
      label: "Problems Solved",
      value: problemsSolved,
      color: "#a78bfa", // Purple
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.2)",
      icon: Code,
      subtext: "Practice challenges"
    },
    {
      label: "Assignments Submitted",
      value: `${assignmentsSubmitted} / 25`,
      color: "#f59e0b", // Amber
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      icon: FileText,
      subtext: "Lab practical files"
    },
    {
      label: "Practicals Completed",
      value: `${practicalsCompleted} / 80`,
      color: "#10b981", // Emerald
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      icon: CheckCircle,
      subtext: "Approved by professor"
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`cyber-card stats-card-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: "135px",
                justifyContent: "space-between"
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: stat.bg,
                    border: `1px solid ${stat.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: stat.color,
                  }}
                >
                  <Icon size={22} />
                </motion.div>
                
                <span style={{ fontSize: "0.72rem", color: "var(--tx3)", fontWeight: 500 }}>
                  {stat.subtext}
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "var(--tx)",
                    lineHeight: "1.2",
                    marginBottom: "4px",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--tx2)", fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCard;
