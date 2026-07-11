import { motion } from "framer-motion";

const AuthBackground = () => {
  return (
    <div className="auth-background">
      <motion.div
        className="auth-orb orb-1"
        animate={{
          x: [0, 50, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="auth-orb orb-2"
        animate={{
          x: [0, -60, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="auth-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default AuthBackground;