import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSidebar from "../components/DashboardSidebar";
import WelcomeCard from "../components/WelcomeCard";
import CodeEditor from "../components/CodeEditor";
import CodeHistory from "../components/CodeHistory";
import ProgressCards from "../components/ProgressCards";
import ProfileCard from "../components/ProfileCard";
import { API_URL } from "../utils/api";
import {
  Terminal,
  ShieldAlert,
  Play,
  Target,
  Sliders,
  Moon,
  Palette,
  Type,
  Hash,
  Save,
  RotateCcw,
  Trash2,
  History,
  Layout,
  Bell,
  Calendar,
  Lock,
  LogOut,
  User,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Code2,
  Clock,
  ArrowRight,
} from "lucide-react";

function StudentDashboard({ currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const [editorSubmissionId, setEditorSubmissionId] = useState(null);

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

  // ==========================================
  // CHANGE PASSWORD STATE & HANDLERS
  // ==========================================
  const user = currentUser || (() => {
    try {
      return JSON.parse(localStorage.getItem("cryptocode_user") || "{}");
    } catch {
      return {};
    }
  })();
  const userEmail = user?.email || "";
  const userId = user?.id || user?.user_id || "";

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!passwordForm.currentPassword) {
      setPwError("Please enter your current password.");
      return;
    }
    if (!passwordForm.newPassword) {
      setPwError("Please enter your new password.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPwError("New password must be at least 6 characters long.");
      return;
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setPwError("New password cannot be the same as your current password.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwError("New password and confirm password do not match.");
      return;
    }

    setPwLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          user_id: userId,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update password.");
      }
      setPwSuccess("Password updated successfully! Your new password is now active.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPwSuccess(""), 5000);
    } catch (err) {
      setPwError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPwError("");
    setPwSuccess("");
  };

  // ==========================================
  // LOGOUT ALL DEVICES STATE & HANDLER
  // ==========================================
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutAll = () => {
    localStorage.removeItem("cryptocode_user");
    localStorage.removeItem("cryptocode_admin_token");
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/";
    }
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
    fetch(`${API_URL}/practicals`)
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
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Main content body */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Left Sidebar navigation */}
        <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

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
                className="dashboard-inner-container ccc-container"
                style={{ 
                  position: "relative", 
                  zIndex: 1
                }}
              >
                {/* Section B – Terminal-Inspired Breadcrumb */}
                <div className="ccc-breadcrumb-wrap">
                  <span className="ccc-breadcrumb">
                    ~/cryptocode/student
                  </span>
                </div>

                {/* Section C – Welcome Message */}
                <div className="ccc-welcome-section">
                  <h1 className="ccc-welcome-heading">
                    Hello, <span className="ccc-welcome-name">{currentUser?.name || "Student"}</span>!
                  </h1>
                  <p className="ccc-welcome-subtitle">
                    Welcome to your coding workspace.
                  </p>
                </div>

                {/* Section D – Main Coding Action Panel */}
                <div className="ccc-action-panel">
                  <div className="ccc-action-panel-topbar">
                    <span className="ccc-panel-dot red" />
                    <span className="ccc-panel-dot yellow" />
                    <span className="ccc-panel-dot green" />
                  </div>
                  <div className="ccc-action-content">
                    <div className="ccc-action-info">
                      <div className="ccc-code-line">
                        <span className="ccc-prompt-arrow">&gt;</span>
                        <span className="ccc-code-text">initialize_coding_workspace()</span>
                      </div>
                      <p className="ccc-action-subtitle">
                        Start building your next program.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="ccc-primary-btn"
                      onClick={() => setActiveSection("editor")}
                    >
                      <span>RUN / START CODING</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Section E – Workspace Cards */}
                <div className="ccc-workspace-grid">
                  {/* Card 1 – Editor */}
                  <div
                    className="ccc-workspace-card"
                    onClick={() => setActiveSection("editor")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveSection("editor");
                      }
                    }}
                  >
                    <div>
                      <div className="ccc-card-header">
                        <span className="ccc-card-title">
                          <Code2 size={16} />
                          &lt;/&gt; EDITOR
                        </span>
                      </div>
                      <p className="ccc-card-desc">
                        Open your coding environment and write your next program.
                      </p>
                    </div>
                    <div className="ccc-card-action">
                      <span>Start Coding</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>

                  {/* Card 2 – History */}
                  <div
                    className="ccc-workspace-card"
                    onClick={() => setActiveSection("submissions")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveSection("submissions");
                      }
                    }}
                  >
                    <div>
                      <div className="ccc-card-header">
                        <span className="ccc-card-title">
                          <Clock size={16} />
                          ◷ HISTORY
                        </span>
                      </div>
                      <p className="ccc-card-desc">
                        Return to your previously saved code.
                      </p>
                    </div>
                    <div className="ccc-card-action">
                      <span>Code History</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </div>

                {/* Section F – Motivational Footer Message */}
                <div className="ccc-motivational-footer">
                  <span className="ccc-motivational-quote">
                    &ldquo;Every expert was once a beginner. Keep coding, keep growing.&rdquo;
                  </span>
                  <span className="ccc-motivational-icon" aria-label="rocket">
                    🚀
                  </span>
                </div>
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
  submissionId={editorSubmissionId}
  setSubmissionId={setEditorSubmissionId}
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
                <CodeHistory currentUser={currentUser} 
  onOpenFile={(file) => {
    setEditorLang(file.lang);
    setEditorCode(file.code);
    setEditorFileName(file.name);
    setEditorSubmissionId(file.id);
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
                className="dashboard-inner-container"
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
                className="dashboard-inner-container"
              >
                <ProfileCard 
                  currentUser={currentUser} 
                  onNavigateSettings={() => setActiveSection("settings")}
                />
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
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
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
                  .setting-btn-submit {
                    background: var(--grad);
                    border: none;
                    color: #fff;
                    box-shadow: 0 4px 14px rgba(139, 92, 246, 0.25);
                  }
                  .setting-btn-submit:hover:not(:disabled) {
                    opacity: 0.92;
                    transform: translateY(-1px);
                  }
                  .setting-btn-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                  }
                  .pw-field-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                  }
                  .pw-field-input {
                    width: 100%;
                    background: var(--sf);
                    border: 1px solid var(--bd);
                    border-radius: 10px;
                    padding: 10px 42px 10px 38px;
                    color: var(--tx);
                    font-size: 0.86rem;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                  }
                  .pw-field-input:focus {
                    border-color: var(--pur);
                    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
                  }
                  .pw-field-icon {
                    position: absolute;
                    left: 12px;
                    color: var(--tx3);
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                  }
                  .pw-eye-btn {
                    position: absolute;
                    right: 12px;
                    background: none;
                    border: none;
                    color: var(--tx3);
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                  }
                  .pw-eye-btn:hover {
                    color: var(--tx);
                  }
                  @keyframes spinAnimation {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  .spin-loader {
                    animation: spinAnimation 1s linear infinite;
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

                    {/* Change Password Row */}
                    <div className="setting-row-item" style={{ borderBottom: showPasswordForm ? "none" : undefined }}>
                      <div className="setting-left">
                        <div className="setting-icon-wrapper">
                          <Lock size={16} />
                        </div>
                        <div className="setting-info">
                          <span className="setting-label">Change Password</span>
                          <span className="setting-desc">Update your login security credentials with Supabase authentication</span>
                        </div>
                      </div>
                      <div className="setting-right">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm((prev) => !prev);
                            setPwError("");
                            setPwSuccess("");
                          }}
                          className="setting-btn setting-btn-primary"
                        >
                          <Lock size={14} />
                          <span>{showPasswordForm ? "Close Form" : "Change Password"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Change Password Form */}
                    <AnimatePresence>
                      {showPasswordForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              background: "var(--bg3)",
                              border: "1px solid var(--bd)",
                              borderRadius: "16px",
                              padding: "24px",
                              marginTop: "8px",
                              marginBottom: "20px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "18px",
                                paddingBottom: "12px",
                                borderBottom: "1px solid var(--bd)",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <ShieldCheck size={18} style={{ color: "var(--pur)" }} />
                                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--tx)" }}>
                                  Update Account Password
                                </span>
                              </div>
                              {userEmail && (
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "var(--tx3)",
                                    background: "var(--sf)",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--bd)",
                                  }}
                                >
                                  {userEmail}
                                </span>
                              )}
                            </div>

                            <form onSubmit={handlePasswordSubmit}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {/* Current Password */}
                                <div>
                                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--tx2)", marginBottom: "6px" }}>
                                    Current Password
                                  </label>
                                  <div className="pw-field-container">
                                    <span className="pw-field-icon"><Lock size={15} /></span>
                                    <input
                                      type={showPassword.current ? "text" : "password"}
                                      value={passwordForm.currentPassword}
                                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                                      placeholder="Enter current password"
                                      className="pw-field-input"
                                      autoComplete="current-password"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                                      className="pw-eye-btn"
                                      title={showPassword.current ? "Hide password" : "Show password"}
                                    >
                                      {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  </div>
                                </div>

                                {/* New Password */}
                                <div>
                                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--tx2)", marginBottom: "6px" }}>
                                    New Password
                                  </label>
                                  <div className="pw-field-container">
                                    <span className="pw-field-icon"><KeyRound size={15} /></span>
                                    <input
                                      type={showPassword.new ? "text" : "password"}
                                      value={passwordForm.newPassword}
                                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                                      placeholder="Enter new password (min. 6 characters)"
                                      className="pw-field-input"
                                      autoComplete="new-password"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                                      className="pw-eye-btn"
                                      title={showPassword.new ? "Hide password" : "Show password"}
                                    >
                                      {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  </div>
                                  <span style={{ display: "block", fontSize: "0.72rem", color: "var(--tx3)", marginTop: "4px" }}>
                                    Must contain at least 6 characters.
                                  </span>
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--tx2)", marginBottom: "6px" }}>
                                    Confirm New Password
                                  </label>
                                  <div className="pw-field-container">
                                    <span className="pw-field-icon"><KeyRound size={15} /></span>
                                    <input
                                      type={showPassword.confirm ? "text" : "password"}
                                      value={passwordForm.confirmPassword}
                                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                      placeholder="Re-enter new password"
                                      className="pw-field-input"
                                      autoComplete="new-password"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                                      className="pw-eye-btn"
                                      title={showPassword.confirm ? "Hide password" : "Show password"}
                                    >
                                      {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                  </div>
                                </div>

                                {/* Error Banner */}
                                {pwError && (
                                  <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "12px 16px", color: "#f87171", fontSize: "0.84rem", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                    <span>{pwError}</span>
                                  </div>
                                )}

                                {/* Success Banner */}
                                {pwSuccess && (
                                  <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "10px", padding: "12px 16px", color: "#34d399", fontSize: "0.84rem", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                                    <span>{pwSuccess}</span>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "6px" }}>
                                  <button type="submit" disabled={pwLoading} className="setting-btn setting-btn-submit">
                                    {pwLoading ? (
                                      <><Loader2 size={14} className="spin-loader" /><span>Updating Password...</span></>
                                    ) : (
                                      <><ShieldCheck size={14} /><span>Update Password</span></>
                                    )}
                                  </button>
                                  <button type="button" onClick={handleCancelPassword} disabled={pwLoading} className="setting-btn setting-btn-primary">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Logout All Devices Row */}
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
                        {showLogoutConfirm ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={handleLogoutAll}
                              className="setting-btn setting-btn-submit"
                              style={{ background: "#ef4444" }}
                            >
                              Confirm Logout
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowLogoutConfirm(false)}
                              className="setting-btn setting-btn-primary"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowLogoutConfirm(true)}
                            className="setting-btn setting-btn-primary"
                          >
                            Logout All
                          </button>
                        )}
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
