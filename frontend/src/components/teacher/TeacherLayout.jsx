import { motion } from "framer-motion";

function TeacherLayout({ title, description, actions, children }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="dashboard-inner-container"
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
      }}
    >
      {/* Page Header */}
      {(title || description || actions) && (
        <div 
          className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
          style={{ width: "100%" }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
                {title}
              </h3>
            )}
            {description && (
              <p style={{ fontSize: "0.85rem", color: "var(--tx3)", margin: "4px 0 0" }}>
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="d-flex align-items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Content Body */}
      <div style={{ width: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default TeacherLayout;
