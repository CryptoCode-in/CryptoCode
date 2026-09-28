import { Bell, LogOut, Search } from "lucide-react";

function DashboardNavbar({ currentUser, activeSection, setActiveSection, onLogout, onSearch, searchValue }) {
  const userInitial = currentUser?.name ? currentUser.name[0].toUpperCase() : "U";
  const userName = currentUser?.name || "User";
  const isTeacher = currentUser?.role === "teacher";

  return (
    <nav
      id="dashboard-nbar"
      className="dashboard-navbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "var(--bg3)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--bd)",
        padding: "14px 0",
        width: "100%",
      }}
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Logo */}
          <div className="d-flex align-items-center gap-2" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--tx)" }}>
            <div>
              <img src="/src/assets/images/logob.png" width="55" height="55" alt="Logo Bullet" />
            </div>
            <span>
              <img src="/src/assets/images/logow.png" width="200" height="200" style={{ objectFit: "contain" }} alt="Logo Text" />
            </span>
          </div>

          {/* Center Area: Search Box OR Center Navigation Links */}
          {onSearch ? (
            <div 
              className="db-top-search d-none d-md-flex align-items-center gap-2 px-3"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--bd)",
                borderRadius: "12px",
                width: "280px",
                height: "38px"
              }}
            >
              <Search size={16} style={{ color: "var(--tx3)" }} />
              <input
                type="text"
                placeholder="Search by Roll No, or Name..."
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--tx)",
                  fontSize: "0.85rem",
                  width: "100%",
                }}
              />
            </div>
          ) : (
            <div className="d-none d-md-flex align-items-center gap-1">
              {isTeacher ? (
                <>
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
                    onClick={() => setActiveSection("students")}
                    className={`nav-link ${activeSection === "students" || activeSection === "student-profile" ? "on" : ""}`}
                    style={{
                      color: activeSection === "students" || activeSection === "student-profile" ? "var(--tx)" : "var(--tx2)",
                      background: activeSection === "students" || activeSection === "student-profile" ? "rgba(139,92,246,.15)" : "transparent",
                      border: activeSection === "students" || activeSection === "student-profile" ? "1px solid var(--bd)" : "1px solid transparent"
                    }}
                  >
                    Students
                  </button>
                  <button
                    onClick={() => setActiveSection("practicals")}
                    className={`nav-link ${activeSection === "practicals" ? "on" : ""}`}
                    style={{
                      color: activeSection === "practicals" ? "var(--tx)" : "var(--tx2)",
                      background: activeSection === "practicals" ? "rgba(139,92,246,.15)" : "transparent",
                      border: activeSection === "practicals" ? "1px solid var(--bd)" : "1px solid transparent"
                    }}
                  >
                    Practicals
                  </button>
                  <button
                    onClick={() => setActiveSection("submissions")}
                    className={`nav-link ${activeSection === "submissions" || activeSection === "submission-details" ? "on" : ""}`}
                    style={{
                      color: activeSection === "submissions" || activeSection === "submission-details" ? "var(--tx)" : "var(--tx2)",
                      background: activeSection === "submissions" || activeSection === "submission-details" ? "rgba(139,92,246,.15)" : "transparent",
                      border: activeSection === "submissions" || activeSection === "submission-details" ? "1px solid var(--bd)" : "1px solid transparent"
                    }}
                  >
                    Submissions
                  </button>
                  <button
                    onClick={() => setActiveSection("analytics")}
                    className={`nav-link ${activeSection === "analytics" ? "on" : ""}`}
                    style={{
                      color: activeSection === "analytics" ? "var(--tx)" : "var(--tx2)",
                      background: activeSection === "analytics" ? "rgba(139,92,246,.15)" : "transparent",
                      border: activeSection === "analytics" ? "1px solid var(--bd)" : "1px solid transparent"
                    }}
                  >
                    Analytics
                  </button>
                </>
              ) : (
                <>
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
                    Code History
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
                </>
              )}
            </div>
          )}

          {/* Right Area */}
          <div className="d-flex align-items-center gap-3">
            {/* Search Toggle for Mobile */}
            <div className="d-md-none">
              {onSearch && (
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearch(e.target.value)}
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--bd)",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      color: "var(--tx)",
                      fontSize: "0.8rem",
                      width: "120px"
                    }}
                  />
                </div>
              )}
            </div>

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
              onClick={() => isTeacher ? setActiveSection("profile") : setActiveSection("profile")}
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
              {isTeacher ? (
                <div className="d-none d-sm-flex flex-column align-items-start" style={{ lineHeight: 1.1 }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--tx)" }}>
                    {userName}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "var(--tx3)" }}>
                    Teacher
                  </span>
                </div>
              ) : (
                <span className="d-none d-sm-inline" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--tx)" }}>
                  {userName}
                </span>
              )}
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
