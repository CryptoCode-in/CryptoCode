import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";

function WelcomeCard({ userName, onStartCoding, onViewSubmissions }) {
  const nameDisplay = userName || "Student";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="cyber-glass-panel welcome-bar-height"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3"
          style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "100px",
            fontSize: "0.75rem",
            color: "var(--pur)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          <Sparkles size={12} />
          <span>CryptoCode</span>
        </div>
        
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--tx)", marginBottom: "6px" }}>
          Welcome Back, <span style={{ color: "var(--pur)" }}>{nameDisplay}</span> 👋
        </h2>
        
        <p style={{ color: "var(--tx2)", fontSize: "0.9rem", fontWeight: 500, margin: "0 0 24px" }}>
          College Programming Practical & Assignment Portal
        </p>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="bgrd d-flex align-items-center gap-2 px-4 py-2"
            style={{ 
              fontSize: "0.85rem", 
              borderRadius: "10px"
            }}
            onClick={onStartCoding}
          >
            <Play size={14} fill="currentColor" />
            <span>Start Coding</span>
          </button>
          
          <button
            className="boc d-flex align-items-center gap-2 px-4 py-2"
            style={{ 
              fontSize: "0.85rem", 
              borderRadius: "10px"
            }}
            onClick={onViewSubmissions}
          >
            <span>Code History</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default WelcomeCard;
