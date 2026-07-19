function ChartCard({ title, subtitle, children }) {
  return (
    <div
      className="cyber-card"
      style={{
        padding: "24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {(title || subtitle) && (
        <div className="mb-3">
          {title && (
            <h5 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", margin: 0 }}>
              {title}
            </h5>
          )}
          {subtitle && (
            <p style={{ fontSize: "0.75rem", color: "var(--tx3)", margin: "2px 0 0 0" }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div style={{ flex: 1, width: "100%", minHeight: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

export default ChartCard;
