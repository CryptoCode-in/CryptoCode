import { motion } from "framer-motion";
import { Trophy, Code2, FileCheck } from "lucide-react";

function StatsCard({ level = 4, solvedCount = 42, assignmentsCount = 18 }) {
  const stats = [
    {
      label: "Current Level",
      value: `Level ${level}`,
      color: "var(--pur)",
      bg: "rgba(139,92,246,0.1)",
      icon: Trophy,
    },
    {
      label: "Problems Solved",
      value: `${solvedCount} / 150`,
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
      icon: Code2,
    },
    {
      label: "Assignments Completed",
      value: `${assignmentsCount} / 25`,
      color: "#60a5fa",
      bg: "rgba(59,130,246,0.1)",
      icon: FileCheck,
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div className="col-12 col-md-4" key={i}>
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                background: "var(--sf)",
                border: "1px solid var(--bd)",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                height: "100%",
                boxShadow: "0 8px 24px rgba(0,0,0,.15)",
              }}
            >
              {/* Icon Container */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color,
                  flexShrink: 0,
                }}
              >
                <Icon size={22} />
              </div>

              {/* Value / Label */}
              <div>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "var(--tx)",
                    lineHeight: "1.2",
                    marginBottom: "4px",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--tx3)", fontWeight: 500 }}>
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
