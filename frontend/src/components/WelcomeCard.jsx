import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function WelcomeCard({ userName }) {
  const nameDisplay = userName || "Coder";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "var(--sf)",
        border: "1px solid var(--bd)",
        borderRadius: "20px",
        padding: "32px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(139,92,246,.08)",
        marginBottom: "24px",
      }}
    >
      {/* Decorative Aura Background */}
      <div
        className="aur aur-b"
        style={{
          top: "-50px",
          right: "-50px",
          width: "250px",
          height: "250px",
          background: "radial-gradient(ellipse, rgba(139,92,246,.12), transparent 70%)",
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3"
          style={{
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: "100px",
            fontSize: "0.75rem",
            color: "var(--pur)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <Sparkles size={12} />
          <span>Interactive Student Portal</span>
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700, color: "var(--tx)", marginBottom: "8px" }}>
          Hello, <span className="gt">{nameDisplay}</span> 👋
        </h2>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--tx2)", marginBottom: "12px" }}>
          Welcome to CryptoCode
        </h3>
        <p style={{ color: "var(--tx2)", fontSize: "0.95rem", maxWidth: "600px", lineHeight: "1.6", margin: 0 }}>
          Practice coding, submit assignments, track your progress and improve your programming skills. Get ready to build, execute, and analyze!
        </p>
      </div>
    </motion.div>
  );
}

export default WelcomeCard;
