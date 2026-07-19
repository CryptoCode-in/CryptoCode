import { Bell, LogOut, Search } from "lucide-react";

function Topbar({ currentUser, onLogout, onSearch, searchValue }) {
  const userInitial = currentUser?.name ? currentUser.name[0].toUpperCase() : "T";
  const userName = currentUser?.name || "Prof. Patil";

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
            <div>
              <img src="src/assets/images/logob.png" width="55" height="55" alt="Logo Bullet" />
            </div>
            <span>
              <img src="src/assets/images/logow.png" width="200" height="200" alt="Logo Text" />
            </span>
          </div>

          {/* Center: Search Box */}
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
            <div className="d-none d-md-block" style={{ width: "280px" }}></div>
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

export default Topbar;
