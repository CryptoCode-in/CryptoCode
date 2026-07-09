import { LayoutDashboard, Code, Clock, LineChart, User, Settings } from "lucide-react";

function DashboardSidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "editor", label: "Start Coding", icon: Code },
    { id: "submissions", label: "Code History", icon: Clock },
    { id: "progress", label: "Progress", icon: LineChart },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className="db-sidebar"
      style={{
        position: "sticky",
        top: "66px",
        height: "calc(100vh - 66px)",
        width: "240px",
        flexShrink: 0,
        background: "var(--sf)",
        borderRight: "1px solid var(--bd)",
        display: "flex",
        flexDirection: "column",
        zIndex: 200,
        padding: "20px 10px",
      }}
    >
      <div style={{ fontSize: ".64rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--tx3)", padding: "0 12px 12px", fontWeight: 700 }}>
        Menu
      </div>
      <div className="db-nav" style={{ flex: 1, padding: 0 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`db-nl ${isActive ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: isActive ? "#fff" : "var(--tx2)",
                background: isActive ? "var(--grad)" : "transparent",
                border: "none",
                marginBottom: "4px",
                transition: "all 0.2s ease",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.id === "editor" && (
                <span className="db-badge" style={{ background: isActive ? "rgba(255,255,255,0.2)" : "rgba(139,92,246,.2)", color: isActive ? "#fff" : "var(--pur)", marginLeft: "auto", fontSize: "0.65rem", padding: "2px 7px", borderRadius: "100px", fontWeight: 700 }}>
                  Live
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "12px 10px", borderTop: "1px solid var(--bd)", fontSize: "0.75rem", color: "var(--tx3)", textAlign: "center" }}>
        CryptoCode Student Panel
      </div>
    </div>
  );
}

export default DashboardSidebar;
