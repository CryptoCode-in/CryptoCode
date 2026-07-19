import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function StatCard({ label, value, icon: Icon, color = "#8b5cf6", bg = "rgba(139,92,246,0.08)", border = "rgba(139,92,246,0.2)", subtext, onClick }) {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);

  useEffect(() => {
    // Parse integer from value
    const numericStr = String(value).replace(/[^0-9]/g, '');
    const num = parseInt(numericStr, 10);
    
    if (!isNaN(num) && num > 0) {
      let start = 0;
      const duration = 1000; // 1 second
      const steps = 30;
      const increment = Math.ceil(num / steps);
      const stepTime = duration / steps;
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          clearInterval(timer);
          setDisplayValue(value);
        } else {
          // Re-attach non-numeric parts if any (e.g. "%" or "/ 80")
          if (typeof value === 'string' && value.includes('%')) {
            setDisplayValue(`${current}%`);
          } else if (typeof value === 'string' && value.includes('/')) {
            const parts = value.split('/');
            setDisplayValue(`${current} / ${parts[1].trim()}`);
          } else {
            setDisplayValue(current);
          }
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="cyber-card"
      onClick={onClick}
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "135px",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default"
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: bg,
            border: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
          }}
        >
          {Icon && <Icon size={22} />}
        </motion.div>
        
        {subtext && (
          <span style={{ fontSize: "0.72rem", color: "var(--tx3)", fontWeight: 500 }}>
            {subtext}
          </span>
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#fff",
            lineHeight: "1.2",
            marginBottom: "4px",
          }}
        >
          {displayValue}
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--tx2)", fontWeight: 600 }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
