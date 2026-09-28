import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSidebar from "../components/DashboardSidebar";
import WelcomeCard from "../components/WelcomeCard";
import CodeEditor from "../components/CodeEditor";
import CodeHistory from "../components/CodeHistory";
import ProgressCards from "../components/ProgressCards";
import ProfileCard from "../components/ProfileCard";
import { 
  Terminal, ShieldAlert, Play, Target, Sliders,
  Moon, Palette, Type, Hash, Save, RotateCcw, 
  Trash2, History, Layout, Bell, Calendar, Lock, LogOut, User
} from "lucide-react";

function StudentDashboard({ currentUser, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Lifted editor states for sharing file load/save across pages
  // Initial values setup for editor
  const getInitialEditorState = () => {
    return {
      lang: "python",
      code: "# Write your Python code here\nprint('Hello, CryptoCode!')\n",
      name: "main.py"
    };
  };

  const initialEditorState = getInitialEditorState();
  const [editorLang, setEditorLang] = useState(initialEditorState.lang);
  const [editorCode, setEditorCode] = useState(initialEditorState.code);
  const [editorFileName, setEditorFileName] = useState(initialEditorState.name);

  // Settings States
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("cryptocode_accent") || "purple";
  });

  const [editorSettings, setEditorSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("cryptocode_editor_settings");
      return saved ? JSON.parse(saved) : {
        fontSize: "14px",
        showLineNumbers: true,
        wordWrap: true
      };
    } catch {
      return {
        fontSize: "14px",
        showLineNumbers: true,
        wordWrap: true
      };
    }
  });

  const [dashboardSettingsState, setDashboardSettingsState] = useState(() => {
    try {
      const saved = localStorage.getItem("cryptocode_dashboard_settings");
      return saved ? JSON.parse(saved) : {
        showWelcome: true,
        showPractical: true,
        showTarget: true
      };
    } catch {
      return {
        showWelcome: true,
        showPractical: true,
        showTarget: true
      };
    }
  });

  const [notificationSettings, setNotificationSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("cryptocode_notification_settings");
      return saved ? JSON.parse(saved) : {
        assignmentAlerts: true
      };
    } catch {
      return {
        assignmentAlerts: true
      };
    }
  });

  // Apply accent color changes
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("cryptocode_accent", accentColor);
    if (accentColor === "blue") {
      root.style.setProperty("--pur", "#3b82f6");
      root.style.setProperty("--pur2", "#2563eb");
      root.style.setProperty("--grad", "linear-gradient(135deg, #3b82f6, #60a5fa)");
      root.style.setProperty("--grad2", "linear-gradient(135deg, #1d4ed8, #3b82f6)");
      root.style.setProperty("--bd", "rgba(59, 130, 246, 0.15)");
      root.style.setProperty("--bd2", "rgba(59, 130, 246, 0.25)");
    } else if (accentColor === "cyan") {
      root.style.setProperty("--pur", "#06b6d4");
      root.style.setProperty("--pur2", "#0891b2");
      root.style.setProperty("--grad", "linear-gradient(135deg, #06b6d4, #22d3ee)");
      root.style.setProperty("--grad2", "linear-gradient(135deg, #0891b2, #06b6d4)");
      root.style.setProperty("--bd", "rgba(6, 182, 212, 0.15)");
      root.style.setProperty("--bd2", "rgba(6, 182, 212, 0.25)");
    } else {
      // purple (default)
      root.style.removeProperty("--pur");
      root.style.removeProperty("--pur2");
      root.style.removeProperty("--grad");
      root.style.removeProperty("--grad2");
      root.style.removeProperty("--bd");
      root.style.removeProperty("--bd2");
    }
  }, [accentColor]);

  const updateEditorSetting = (key, value) => {
    const newSettings = { ...editorSettings, [key]: value };
    setEditorSettings(newSettings);
    localStorage.setItem("cryptocode_editor_settings", JSON.stringify(newSettings));
  };

  const updateDashboardSetting = (key, value) => {
    const newSettings = { ...dashboardSettingsState, [key]: value };
    setDashboardSettingsState(newSettings);
    localStorage.setItem("cryptocode_dashboard_settings", JSON.stringify(newSettings));
  };

  const updateNotificationSetting = (key, value) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    localStorage.setItem("cryptocode_notification_settings", JSON.stringify(newSettings));
  };

  // Today's Practical state (Attempts to fetch, falls back to clean placeholder state if no backend table/data)
  const [todayPractical, setTodayPractical] = useState(null);
  const [isLoadingPractical, setIsLoadingPractical] = useState(true);

  useEffect(() => {
    const FALLBACK_PRACTICAL = {
      id: "p1",
      title: "Java Sorting Algorithms",
      description: "Write programs to implement Bubble Sort, Selection Sort, and Insertion Sort. Analyze time complexity for different input sizes.",
      language: "Java",
      assigned_by: "Prof. Patil",
      assigned_date: "15 Aug 2024",
      due_date: "25 Jul 2026, 11:59 PM"
    };

    // Attempt real database fetch
    fetch("http://localhost:5000/practicals")
      .then((res) => {
        if (!res.ok) throw new Error("API Route not configured");
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setTodayPractical(data[0]);
        } else {
          setTodayPractical(FALLBACK_PRACTICAL);
        }
        setIsLoadingPractical(false);
      })
      .catch((err) => {
        console.warn("Could not load database practicals (backend API not configured). Using local mock data fallback.");
        setTodayPractical(FALLBACK_PRACTICAL);
        setIsLoadingPractical(false);
      });
  }, []);

  // Motion layout presets
  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--tx)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top sticky Navbar */}
      <DashboardNavbar
        currentUser={currentUser}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
      />

      {/* Main content body */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Left Sidebar navigation */}
        <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Content canvas */}
        <main className="dashboard-main-canvas" style={{ flex: 1, overflowX: "hidden", position: "relative" }}>
          <AnimatePresence mode="wait">
            {activeSection === "dashboard" && (
              <motion.div
                key="dashboard"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                className="dashboard-inner-container"
                style={{ 
                  position: "relative", 
                  zIndex: 1
                }}
              >
                {/* Row 1 — WELCOME SECTION (75% / 25% or 100% depending on toggles) */}
                {(dashboardSettingsState.showWelcome || dashboardSettingsState.showTarget) && (
                  <div 
                    className="dashboard-row-1" 
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: dashboardSettingsState.showWelcome && dashboardSettingsState.showTarget ? "3fr 1fr" : "1fr", 
                      gap: "20px", 
                      marginBottom: "20px" 
                    }}
                  >
                    {dashboardSettingsState.showWelcome && (
                      <div className="dashboard-card-wrapper">
                        <WelcomeCard 
                          userName={currentUser?.name} 
                          onStartCoding={() => setActiveSection("editor")}
                          onViewSubmissions={() => setActiveSection("submissions")}
                        />
                      </div>
                    )}
                    {dashboardSettingsState.showTarget && (
                      <div className="dashboard-card-wrapper">
                        <div className="cyber-card d-flex flex-column align-items-center justify-content-center text-center p-4" style={{ height: "100%" }}>
                          <div 
                            className="mb-3 d-flex align-items-center justify-content-center"
                            style={{
                              width: "52px",
                              height: "52px",
                              borderRadius: "14px",
                              background: "rgba(139, 92, 246, 0.08)",
                              border: "1px solid rgba(139, 92, 246, 0.2)",
                              color: "var(--pur)"
                            }}
                          >
                            <Target size={24} />
                          </div>
                          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--tx2)", fontWeight: 700 }}>
                            Today's Target
                          </span>
                          <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--tx)", marginTop: "6px", marginBottom: 0 }}>
                            1 New Topic
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Row 2 — TODAY'S PRACTICAL */}
                {dashboardSettingsState.showPractical && (
                  <div style={{ marginBottom: "20px" }}>
                    {isLoadingPractical ? (
                      <div className="cyber-card today-practical-height text-center d-flex align-items-center justify-content-center" style={{ minHeight: "250px" }}>
                        <span className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </span>
                      </div>
                    ) : todayPractical ? (
                      <div className="cyber-card today-practical-height p-4">
                        <div className="d-flex align-items-center justify-content-between mb-3.5">
                          <div className="d-flex align-items-center gap-2">
                            <Terminal size={15} style={{ color: "var(--pur)" }} />
                            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--tx2)", fontWeight: 700 }}>
                              Today's Practical
                            </span>
                          </div>
                          <span 
                            style={{ 
                              fontSize: "0.72rem", 
                              fontWeight: 700, 
                              padding: "4px 10px", 
                              borderRadius: "8px", 
                              background: "rgba(139,92,246,0.08)", 
                              color: "var(--pur)", 
                              border: "1px solid rgba(139,92,246,0.2)" 
                            }}
                          >
                            {todayPractical.language || "Programming"}
                          </span>
                        </div>
                        
                        <h4 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--tx)", marginBottom: "8px" }}>
                          {todayPractical.title}
                        </h4>
                        <p style={{ color: "var(--tx2)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "24px" }}>
                          {todayPractical.description}
                        </p>

                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                          <div className="d-flex align-items-center gap-4" style={{ fontSize: "0.75rem", color: "var(--tx3)" }}>
                            <span>
                              Assigned By: <strong style={{ color: "var(--tx2)" }}>{todayPractical.assigned_by}</strong>
                            </span>
                            <span>
                              Assigned: {todayPractical.assigned_date}
                            </span>
                            <span style={{ color: "#f87171", fontWeight: 700 }}>
                              Due: {todayPractical.due_date}
                            </span>
                          </div>
                          <button
                            onClick={() => setActiveSection("editor")}
                            className="bgrd btn px-4 py-2"
                            style={{ fontSize: "0.85rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            <Play size={14} fill="currentColor" />
                            <span>Start Practical</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Clean Placeholder State (since no practical exists in Supabase table)
                      <div className="cyber-card today-practical-height text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "220px", padding: "24px" }}>
                        <ShieldAlert size={36} className="mb-3" style={{ color: "var(--pur)", opacity: 0.8 }} />
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--tx)", marginBottom: "6px" }}>
                          No Active Practical Assigned
                        </h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--tx3)", maxWidth: "450px", margin: 0, lineHeight: "1.5" }}>
                          Your course instructor has not posted a practical assignment for today. 
                          Use the coding sandbox to practice or check back later.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === "editor" && (
              <motion.div
                key="editor"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                style={{ width: "100%" }}
              >
                <CodeEditor 
                  lang={editorLang}
                  setLang={setEditorLang}
                  code={editorCode}
                  setCode={setEditorCode}
                  fileName={editorFileName}
                  setFileName={setEditorFileName}
                />
              </motion.div>
            )}

            {activeSection === "submissions" && (
              <motion.div
                key="submissions"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                style={{ width: "100%" }}
              >
                <CodeHistory 
                  onOpenFile={(file) => {
                    setEditorLang(file.lang);
                    setEditorCode(file.code);
                    setEditorFileName(file.name);
                    setActiveSection("editor");
                  }}
                />
              </motion.div>
            )}

            {activeSection === "progress" && (
              <motion.div
                key="progress"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
              >
                <ProgressCards />
              </motion.div>
            )}

            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
              >
                <ProfileCard currentUser={currentUser} />
              </motion.div>
            )}

            {activeSection === "settings" && (
              <motion.div
                key="settings"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                className="dashboard-inner-container"
              >
                <style dangerouslySetInnerHTML={{__html: `
                  .settings-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px; /* Gap between sections */
                    width: 100%;
                    margin-bottom: 48px;
                  }
                  .setting-section-card {
                    background: var(--sf) !important;
                    border: 1px solid var(--bd) !important;
                    border-radius: 20px !important;
                    padding: 24px; /* Section padding */
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
                    width: 100%;
                  }
                  .setting-section-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--tx);
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-bottom: 1px solid var(--bd);
                    padding-bottom: 12px;
                  }
                  .setting-row-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    min-height: 72px; /* Row height */
                    padding: 12px 0;
                    border-bottom: 1px solid var(--bd); /* Border divider */
                  }
                  .setting-row-item:last-child {
                    border-bottom: none;
                  }
                  .setting-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex: 1;
                  }
                  .setting-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    background: rgba(139, 92, 246, 0.08);
                    border: 1px solid rgba(139, 92, 246, 0.15);
                    color: var(--pur);
                    flex-shrink: 0;
                  }
                  .setting-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px; /* Gap between title & description */
                    padding-right: 16px;
                  }
                  .setting-label {
                    font-size: 0.92rem;
                    font-weight: 600;
                    color: var(--tx);
                  }
                  .setting-desc {
                    font-size: 0.78rem;
                    color: var(--tx3);
                    line-height: 1.4;
                  }
                  .setting-right {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    flex-shrink: 0;
                  }
                  .setting-select {
                    background: var(--bg3);
                    border: 1px solid var(--bd);
                    color: var(--tx);
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.82rem;
                    outline: none;
                    min-width: 120px;
                    cursor: pointer;
                    transition: border-color 0.2s;
                  }
                  .setting-select:focus {
                    border-color: var(--pur);
                  }
                  .setting-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                  }
                  .setting-btn-primary {
                    background: var(--bg3);
                    border: 1px solid var(--bd);
                    color: var(--tx2);
                  }
                  .setting-btn-primary:hover {
                    border-color: var(--pur);
                    color: var(--tx);
                  }

                  /* Responsive mobile formatting */
                  @media (max-width: 575.98px) {
                    .setting-row-item {
                      flex-direction: column;
                      align-items: flex-start;
                      gap: 12px;
                      padding: 16px 0;
                      min-height: auto;
                    }
                    .setting-right {
                      width: 100%;
                      justify-content: flex-start;
                      padding-left: 52px; /* indent line align below texts */
                    }
                  }
                `}} />

                <div style={{ marginBottom: "32px" }}>
                  <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
                    Preferences & Settings
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: "4px 0 0 0" }}>
                    Configure your dashboard, editor and account preferences.
                  </p>
                </div>

                <div className="settings-container">
                  {/* Section 1: Appearance */}
                  <div className="setting-section-card">
                    <h5 className="setting-section-title">
                      <Palette size={16} />
                      <span>Appearance</span>
                    </h5>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Palette size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Accent Color</span>
                          <span className="setting-desc">Choose application accent color</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <select 
                          value={accentColor} 
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="setting-select"
                        >
                          <option value="purple">Purple (Default)</option>
                          <option value="blue">Blue</option>
                          <option value="cyan">Cyan</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Editor Preferences */}
                  <div className="setting-section-card">
                    <h5 className="setting-section-title">
                      <Sliders size={16} />
                      <span>Editor Preferences</span>
                    </h5>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Type size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Font Size</span>
                          <span className="setting-desc">Adjust code font size in Monaco editor</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <select 
                          value={editorSettings.fontSize} 
                          onChange={(e) => updateEditorSetting("fontSize", e.target.value)}
                          className="setting-select"
                        >
                          <option value="12px">12px</option>
                          <option value="14px">14px</option>
                          <option value="16px">16px</option>
                          <option value="18px">18px</option>
                          <option value="20px">20px</option>
                        </select>
                      </div>
                    </div>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Hash size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Show Line Numbers</span>
                          <span className="setting-desc">Display line numbers in editor gutter</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={editorSettings.showLineNumbers}
                            onChange={(e) => updateEditorSetting("showLineNumbers", e.target.checked)}
                          />
                          <span className="toggle-thumb"></span>
                        </label>
                      </div>
                    </div>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Sliders size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Word Wrap</span>
                          <span className="setting-desc">Wrap lines that exceed screen width</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={editorSettings.wordWrap}
                            onChange={(e) => updateEditorSetting("wordWrap", e.target.checked)}
                          />
                          <span className="toggle-thumb"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Dashboard Preferences */}
                  <div className="setting-section-card">
                    <h5 className="setting-section-title">
                      <Layout size={16} />
                      <span>Dashboard Preferences</span>
                    </h5>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Layout size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Show Welcome Card</span>
                          <span className="setting-desc">Render welcome message banner on dashboard</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={dashboardSettingsState.showWelcome}
                            onChange={(e) => updateDashboardSetting("showWelcome", e.target.checked)}
                          />
                          <span className="toggle-thumb"></span>
                        </label>
                      </div>
                    </div>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Terminal size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Show Today's Practical</span>
                          <span className="setting-desc">Render assignment instructions panel on dashboard</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={dashboardSettingsState.showPractical}
                            onChange={(e) => updateDashboardSetting("showPractical", e.target.checked)}
                          />
                          <span className="toggle-thumb"></span>
                        </label>
                      </div>
                    </div>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Target size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Show Today's Target</span>
                          <span className="setting-desc">Render today's target topic indicator card on dashboard</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={dashboardSettingsState.showTarget}
                            onChange={(e) => updateDashboardSetting("showTarget", e.target.checked)}
                          />
                          <span className="toggle-thumb"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Notifications */}
                  <div className="setting-section-card">
                    <h5 className="setting-section-title">
                      <Bell size={16} />
                      <span>Notifications</span>
                    </h5>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Bell size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Practical Assignment Alerts</span>
                          <span className="setting-desc">Notify when a new lab practical task is assigned</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={notificationSettings.assignmentAlerts}
                            onChange={(e) => updateNotificationSetting("assignmentAlerts", e.target.checked)}
                          />
                          <span className="toggle-thumb"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section 6: Account Settings */}
                  <div className="setting-section-card">
                    <h5 className="setting-section-title">
                      <User size={16} />
                      <span>Account Settings</span>
                    </h5>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Lock size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Change Password</span>
                          <span className="setting-desc">Update your login security credentials</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <button 
                          onClick={() => alert("Change Password modal requested (UI only placeholder)")}
                          className="setting-btn setting-btn-primary"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div className="setting-row-item">
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <LogOut size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Logout All Devices</span>
                          <span className="setting-desc">End all active web sessions across all browsers</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <button 
                          onClick={() => alert("Logged out of all other devices.")}
                          className="setting-btn setting-btn-primary"
                        >
                          Logout All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
