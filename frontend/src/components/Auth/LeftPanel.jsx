import { motion } from "framer-motion";
import { FiCode, FiZap, FiShield, FiStar } from "react-icons/fi";

const features = [
  {
    icon: <FiCode />,
    title: "Interactive coding",
    text: "Solve problems with real-time feedback.",
  },
  {
    icon: <FiStar />,
    title: "Smart insights",
    text: "Track performance with elegant dashboards.",
  },
  {
    icon: <FiZap />,
    title: "Instant progress",
    text: "Stay motivated with streaks and milestones.",
  },
  {
    icon: <FiShield />,
    title: "Secure by design",
    text: "Protected sessions for students and mentors.",
  },
];

const LeftPanel = () => {
  return (
    <div className="auth-left-panel">
      <motion.div
        className="auth-badge"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="auth-badge-icon">&lt;/&gt;</span>
        <span>Premium learning workspace</span>
      </motion.div>

      <motion.h2
        className="auth-left-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        Build confidence with every submission.
      </motion.h2>

      <motion.p
        className="auth-left-text"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
      >
        Join a fast-moving coding community where practice, feedback, and progress come together.
      </motion.p>

      <div className="auth-feature-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="auth-feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16 + index * 0.06 }}
          >
            <div className="auth-feature-icon">{feature.icon}</div>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
