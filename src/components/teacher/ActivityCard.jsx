import { CheckCircle2, History, AlertTriangle, MessageSquare, Terminal } from "lucide-react";
import { motion } from "framer-motion";

function ActivityCard({ activities = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case "submission":
        return {
          icon: Terminal,
          color: "#8b5cf6",
          bg: "rgba(139,92,246,0.12)",
          border: "rgba(139,92,246,0.2)"
        };
      case "completion":
        return {
          icon: CheckCircle2,
          color: "#10b981",
          bg: "rgba(16,185,129,0.12)",
          border: "rgba(16,185,129,0.2)"
        };
      case "submissions_count":
        return {
          icon: History,
          color: "#3b82f6",
          bg: "rgba(59,130,246,0.12)",
          border: "rgba(59,130,246,0.2)"
        };
      case "reminder":
        return {
          icon: AlertTriangle,
          color: "#fbbf24",
          bg: "rgba(245,158,11,0.12)",
          border: "rgba(245,158,11,0.2)"
        };
      case "comment":
        return {
          icon: MessageSquare,
          color: "#ec4899",
          bg: "rgba(236,72,153,0.12)",
          border: "rgba(236,72,153,0.2)"
        };
      default:
        return {
          icon: CheckCircle2,
          color: "var(--pur)",
          bg: "rgba(139,92,246,0.12)",
          border: "rgba(139,92,246,0.2)"
        };
    }
  };

  return (
    <div
      className="cyber-card"
      style={{
        padding: "24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", margin: 0 }}>
          Recent Activity
        </h5>
        <span style={{ fontSize: "0.75rem", color: "var(--pur)", fontWeight: 600, cursor: "pointer" }}>
          View all
        </span>
      </div>

      <div
        className="activity-scroll-area"
        style={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "300px",
          paddingRight: "6px"
        }}
      >
        {activities.length === 0 ? (
          <div style={{ padding: "20px 0", textAlign: "center", color: "var(--tx3)", fontSize: "0.85rem" }}>
            No recent activity to show.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activities.map((act, i) => {
              const meta = getIcon(act.type);
              const Icon = meta.icon;
              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.03)"
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: meta.bg,
                      border: `1px solid ${meta.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: meta.color,
                      flexShrink: 0
                    }}
                  >
                    <Icon size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--tx)",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {act.text}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--tx3)", flexShrink: 0 }}>
                    {act.time}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;
