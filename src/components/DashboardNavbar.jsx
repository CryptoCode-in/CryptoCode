import { Bell, LogOut, Code, User } from "lucide-react";

function DashboardNavbar({ currentUser, activeSection, setActiveSection, onLogout }) {
  const userInitial = currentUser?.name ? currentUser.name[0].toUpperCase() : "U";
  const userName = currentUser?.name || "User";

  return (
    <nav
      id="nbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "var(--bg3)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--bd)",
        padding: "14px 0",
      }}
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Logo */}
          <div className="d-flex align-items-center gap-2" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--tx)" }}>
            <div className="logo-i" style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--grad)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Code size={18} />
            </div>
            <span>CryptoCode</span>
          </div>

          {/* Center Links */}
          <div className="d-none d-md-flex align-items-center gap-1">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`nav-link ${activeSection === "dashboard" ? "on" : ""}`}
              style={{
                color: activeSection === "dashboard" ? "var(--tx)" : "var(--tx2)",
                background: activeSection === "dashboard" ? "rgba(139,92,246,.15)" : "transparent",
                border: activeSection === "dashboard" ? "1px solid var(--bd)" : "1px solid transparent"
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveSection("submissions")}
              className={`nav-link ${activeSection === "submissions" ? "on" : ""}`}
              style={{
                color: activeSection === "submissions" ? "var(--tx)" : "var(--tx2)",
                background: activeSection === "submissions" ? "rgba(139,92,246,.15)" : "transparent",
                border: activeSection === "submissions" ? "1px solid var(--bd)" : "1px solid transparent"
              }}
            >
              My Submissions
            </button>
            <button
              onClick={() => setActiveSection("progress")}
              className={`nav-link ${activeSection === "progress" ? "on" : ""}`}
              style={{
                color: activeSection === "progress" ? "var(--tx)" : "var(--tx2)",
                background: activeSection === "progress" ? "rgba(139,92,246,.15)" : "transparent",
                border: activeSection === "progress" ? "1px solid var(--bd)" : "1px solid transparent"
              }}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveSection("profile")}
              className={`nav-link ${activeSection === "profile" ? "on" : ""}`}
              style={{
                color: activeSection === "profile" ? "var(--tx)" : "var(--tx2)",
                background: activeSection === "profile" ? "rgba(139,92,246,.15)" : "transparent",
                border: activeSection === "profile" ? "1px solid var(--bd)" : "1px solid transparent"
              }}
            >
              Profile
            </button>
          </div>

          {/* Right Area */}
          <div className="d-flex align-items-center gap-3">
            {/* Notifications */}
            <div className="position-relative">
              <button
                className="boc d-flex align-items-center justify-content-center"
                style={{ width: "38px", height: "38px", padding: 0, borderRadius: "12px" }}
              >
                <Bell size={18} style={{ color: "var(--tx2)" }} />
              </button>
              <span
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: "#f87171",
                  border: "2px solid var(--bg3)",
                }}
              ></span>
            </div>

            {/* Profile Pill */}
            <div
              className="d-flex align-items-center gap-2 px-2 py-1"
              style={{
                background: "var(--sf)",
                border: "1px solid var(--bd)",
                borderRadius: "12px",
                cursor: "pointer",
              }}
              onClick={() => setActiveSection("profile")}
            >
              <div
                className="db-avatar"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "var(--grad)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {userInitial}
              </div>
              <span className="d-none d-sm-inline" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--tx)" }}>
                {userName}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="boc d-flex align-items-center justify-content-center"
              style={{ width: "38px", height: "38px", padding: 0, borderRadius: "12px", borderColor: "rgba(239,68,68,.3)" }}
              title="Log Out"
            >
              <LogOut size={16} style={{ color: "#f87171" }} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
