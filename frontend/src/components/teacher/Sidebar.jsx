import { LayoutDashboard, Users, History, BarChart3, User, Settings, LogOut } from "lucide-react";

function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "submissions", label: "Submissions", icon: History },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
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
        Teacher Menu
      </div>
      <div className="db-nav" style={{ flex: 1, padding: 0 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id || 
            (item.id === "students" && activeSection === "student-profile") || 
            (item.id === "submissions" && activeSection === "submission-details");
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`db-nl ${isActive ? 'active' : ''}`}
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
                boxShadow: isActive ? "0 0 12px rgba(139, 92, 246, 0.35)" : "none",
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ padding: "10px", borderTop: "1px solid var(--bd)" }}>
        <button
          onClick={onLogout}
          className="db-nl"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#f87171",
            background: "transparent",
            border: "none",
            transition: "all 0.2s ease",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
      
      <div style={{ padding: "12px 10px", borderTop: "1px solid var(--bd)", fontSize: "0.75rem", color: "var(--tx3)", textAlign: "center" }}>
        CryptoCode Teacher Panel
      </div>
    </div>
  );
}

export default Sidebar;
