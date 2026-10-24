import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, Search, Menu, X, UserCheck } from "lucide-react";
import logow from "../assets/images/logow.png";
import { API_URL } from "../utils/api";

function formatLoginTimestamp(date) {
  try {
    const d = new Date(date);
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    const parts = formatter.formatToParts(d);
    const m = {};
    parts.forEach((p) => { m[p.type] = p.value; });
    const hour = m.hour;
    const minute = m.minute;
    const dayPeriod = (m.dayPeriod || "").toUpperCase();
    return `${m.day} ${m.month} ${m.year}, ${hour}:${minute} ${dayPeriod}`;
  } catch {
    return "";
  }
}

function DashboardNavbar({
  currentUser,
  activeSection,
  setActiveSection,
  onLogout,
  onSearch,
  searchValue,
  onToggleMobileMenu,
  mobileMenuOpen
}) {
  const userInitial = currentUser?.name ? currentUser.name[0].toUpperCase() : "U";
  const userName = currentUser?.name || "User";
  const isTeacher = currentUser?.role === "teacher";
  const userId = currentUser?.id || currentUser?.user_id;
  const userRole = currentUser?.role || (isTeacher ? "teacher" : "student");

  // Notification states
  const notifRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const queryParams = new URLSearchParams();
      if (userId) queryParams.append("user_id", userId);
      if (userRole) queryParams.append("role", userRole);

      const res = await fetch(`${API_URL}/notifications?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          setLoadingNotifs(false);
          return;
        }
      }
    } catch {
      // API may be unreachable during offline development
    }

    // Fallback: check localStorage for offline / mock notifications
    try {
      const local = JSON.parse(localStorage.getItem("cryptocode_notifications") || "[]");
      const filtered = local.filter((n) => {
        if (userId && n.user_id && n.user_id !== userId) return false;
        if (userRole && n.role && n.role !== userRole) return false;
        return true;
      });
      setNotifications(filtered);
    } catch {}
    setLoadingNotifs(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId, userRole]);

  // Click outside to close notification panel
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch(`${API_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
    } catch {}
    try {
      const local = JSON.parse(localStorage.getItem("cryptocode_notifications") || "[]");
      local.forEach((n) => {
        if (!userId || n.user_id === userId) n.read = true;
      });
      localStorage.setItem("cryptocode_notifications", JSON.stringify(local));
    } catch {}
  };

  const markSingleAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, { method: "PATCH" });
    } catch {}
    try {
      const local = JSON.parse(localStorage.getItem("cryptocode_notifications") || "[]");
      const found = local.find((n) => n.id === id);
      if (found) found.read = true;
      localStorage.setItem("cryptocode_notifications", JSON.stringify(local));
    } catch {}
  };

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
          {/* Logo & Mobile Menu Toggle */}
          <div className="d-flex align-items-center gap-2" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--tx)" }}>
            {onToggleMobileMenu && (
              <button
                className="boc d-lg-none d-flex align-items-center justify-content-center p-2 me-1"
                onClick={onToggleMobileMenu}
                style={{ width: "36px", height: "36px", borderRadius: "10px" }}
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
            <Link
              to={isTeacher ? "/teacher/dashboard" : "/dashboard"}
              className="d-flex align-items-center"
              style={{ textDecoration: "none" }}
            >
              <img
                src={logow}
                alt="CryptoCode"
                className="dashboard-brand-logo"
                style={{
                  height: "34px",
                  width: "auto",
                  maxWidth: "160px",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            </Link>
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
                    onClick={() => setActiveSection("editor")}
                    className={`nav-link ${activeSection === "editor" ? "on" : ""}`}
                    style={{
                      color: activeSection === "editor" ? "var(--tx)" : "var(--tx2)",
                      background: activeSection === "editor" ? "rgba(139,92,246,.15)" : "transparent",
                      border: activeSection === "editor" ? "1px solid var(--bd)" : "1px solid transparent"
                    }}
                  >
                    Start Coding
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
            <div className="position-relative" ref={notifRef}>
              <button
                className="boc d-flex align-items-center justify-content-center"
                style={{
                  width: "38px",
                  height: "38px",
                  padding: 0,
                  borderRadius: "12px",
                  position: "relative",
                  background: showNotifications ? "rgba(139,92,246,0.18)" : undefined,
                  borderColor: showNotifications ? "var(--pur)" : undefined
                }}
                onClick={() => setShowNotifications((prev) => !prev)}
                aria-label="Toggle notifications panel"
                aria-expanded={showNotifications}
              >
                <Bell size={18} style={{ color: showNotifications ? "var(--pur)" : "var(--tx2)" }} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      minWidth: "18px",
                      height: "18px",
                      padding: "0 4px",
                      borderRadius: "10px",
                      background: "#ef4444",
                      border: "2px solid var(--bg3)",
                      color: "#fff",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Flyout Menu */}
              {showNotifications && (
                <div
                  className="db-notifications-panel"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: "min(360px, calc(100vw - 32px))",
                    background: "rgba(18, 19, 32, 0.98)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(139, 92, 246, 0.25)",
                    borderRadius: "16px",
                    boxShadow: "0 16px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.15)",
                    zIndex: 1000,
                    overflow: "hidden"
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between px-3 py-2.5"
                    style={{
                      borderBottom: "1px solid var(--bd)",
                      background: "rgba(255, 255, 255, 0.02)"
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Bell size={16} style={{ color: "var(--pur)" }} />
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--tx)" }}>
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: "rgba(139, 92, 246, 0.15)",
                            color: "var(--pur)",
                            border: "1px solid rgba(139, 92, 246, 0.3)"
                          }}
                        >
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--pur)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          padding: "2px 6px"
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      maxHeight: "340px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    {loadingNotifs ? (
                      <div className="p-4 text-center" style={{ color: "var(--tx3)", fontSize: "0.85rem" }}>
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center" style={{ color: "var(--tx3)", fontSize: "0.85rem" }}>
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => !notif.read && markSingleAsRead(notif.id)}
                          style={{
                            padding: "12px 14px",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                            background: notif.read ? "transparent" : "rgba(139, 92, 246, 0.06)",
                            cursor: notif.read ? "default" : "pointer",
                            transition: "background 0.2s ease",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px"
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "10px",
                              background: notif.role === "teacher" ? "rgba(59, 130, 246, 0.15)" : "rgba(139, 92, 246, 0.15)",
                              border: notif.role === "teacher" ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid rgba(139, 92, 246, 0.3)",
                              color: notif.role === "teacher" ? "#60a5fa" : "var(--pur)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              marginTop: "2px"
                            }}
                          >
                            <UserCheck size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.85rem",
                                fontWeight: notif.read ? 500 : 600,
                                color: notif.read ? "var(--tx2)" : "var(--tx)",
                                lineHeight: 1.45,
                                wordBreak: "break-word"
                              }}
                            >
                              {notif.message}
                            </p>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                color: "var(--tx3)",
                                display: "inline-block",
                                marginTop: "4px"
                              }}
                            >
                              {notif.created_at ? formatLoginTimestamp(notif.created_at) : ""}
                            </span>
                          </div>
                          {!notif.read && (
                            <span
                              style={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                background: "var(--pur)",
                                flexShrink: 0,
                                marginTop: "6px"
                              }}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
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
