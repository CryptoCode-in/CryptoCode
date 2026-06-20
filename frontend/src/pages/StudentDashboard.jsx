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
  ArrowRight, Calendar, FileText, Terminal,
  ShieldAlert, Play, Target
} from "lucide-react";

function StudentDashboard({ currentUser, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Lifted editor states for sharing file load/save across pages
  const [editorLang, setEditorLang] = useState("python");
  const [editorCode, setEditorCode] = useState('print("Welcome to CryptoCode")');
  const [editorFileName, setEditorFileName] = useState("main.py");

  // Local settings toggles
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // Future-ready student achievements (All locked by default)
  const [achievements] = useState([
    { id: 1, title: "First Program Executed", desc: "First compilation run", emoji: "🚀", unlocked: false },
    { id: 2, title: "First Assignment Submitted", desc: "Submit first lab assignment", emoji: "📂", unlocked: false },
    { id: 3, title: "10 Programs Completed", desc: "Successfully run 10 programs", emoji: "💻", unlocked: false },
    { id: 4, title: "Perfect Practical Score", desc: "Get full marks on a practical", emoji: "💯", unlocked: false },
    { id: 5, title: "C Programming Expert", desc: "Complete all C practicals", emoji: "⚡", unlocked: false },
    { id: 6, title: "Python Explorer", desc: "Complete all Python practicals", emoji: "🐍", unlocked: false },
  ]);

  // Recent Activity timeline details
  const [recentActivities] = useState([
    { type: "Program Executed", desc: "Compiled file_io.c successfully in sandbox", time: "10 mins ago", color: "blue" },
    { type: "Practical Submitted", desc: "Submitted C programming practical task 5", time: "2 hours ago", color: "emerald" },
    { type: "Assignment Submitted", desc: "Uploaded Java OOP inheritance lab assignment", time: "Yesterday", color: "amber" },
    { type: "Practical Completed", desc: "Prof. Patil approved Python dict practical 3", time: "2 days ago", color: "blue" },
    { type: "Program Executed", desc: "Ran code compiles for Python basic test", time: "3 days ago", color: "blue" },
  ]);

  // Today's Practical state (Attempts to fetch, falls back to clean placeholder state if no backend table/data)
  const [todayPractical, setTodayPractical] = useState(null);
  const [isLoadingPractical, setIsLoadingPractical] = useState(true);

  useEffect(() => {
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
          setTodayPractical(null);
        }
        setIsLoadingPractical(false);
      })
      .catch((err) => {
        console.warn("Could not load database practicals (backend API not configured). Using clean placeholder state.");
        setTodayPractical(null);
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
                {/* Row 1 — WELCOME SECTION (75% / 25%) */}
                <div className="dashboard-row-1">
                  <div className="dashboard-card-wrapper">
                    <WelcomeCard 
                      userName={currentUser?.name} 
                      onStartCoding={() => setActiveSection("editor")}
                      onViewSubmissions={() => setActiveSection("submissions")}
                    />
                  </div>
                  <div className="dashboard-card-wrapper">
                    <div className="cyber-card d-flex flex-column align-items-center justify-content-center text-center">
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
                </div>

                {/* Row 2 — TODAY'S PRACTICAL */}
                {isLoadingPractical ? (
                  <div className="cyber-card today-practical-height text-center d-flex align-items-center justify-content-center" style={{ minHeight: "250px" }}>
                    <span className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                  </div>
                ) : todayPractical ? (
                  <div className="cyber-card today-practical-height">
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
                  <div className="cyber-card today-practical-height text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "220px" }}>
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

                {/* Row 3 — Recent Activity (50%) & Coding Activity Heatmap (50%) */}
                <div className="dashboard-row-3-refined">
                  {/* Left Column (50%) - Recent Activity */}
                  <div className="dashboard-card-wrapper">
                    <div className="cyber-card activity-card-layout">
                      <h4 className="section-title">
                        Recent Activity
                      </h4>
                      <div className="timeline-container recent-activity-scroll">
                        <div className="timeline-line"></div>
                        {recentActivities.map((act, idx) => (
                          <div key={idx} className="timeline-item d-flex justify-content-between align-items-start">
                            <div className={`timeline-node ${act.color}`}></div>
                            <div className="timeline-content">
                              <div className="activity-type">
                                {act.type}
                              </div>
                              <div className="activity-desc">
                                {act.desc}
                              </div>
                            </div>
                            <div className="activity-time">
                              {act.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (50%) - Coding Activity Heatmap */}
                  <div className="dashboard-card-wrapper">
                    <div className="cyber-card heatmap-card-layout">
                      {/* Header Layout */}
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--tx)", margin: 0 }}>
                          Coding Activity
                        </h4>
                        <div className="d-flex align-items-center gap-2.5">
                          <span style={{ fontSize: "0.75rem", color: "var(--tx3)" }}>Activity Map</span>
                          <span 
                            style={{ 
                              fontSize: "0.7rem", 
                              fontWeight: 700, 
                              padding: "3px 8px", 
                              borderRadius: "6px", 
                              background: "rgba(139,92,246,0.08)", 
                              color: "var(--pur)", 
                              border: "1px solid rgba(139,92,246,0.2)" 
                            }}
                          >
                            29% Active
                          </span>
                        </div>
                      </div>
                      
                      {/* Center Heatmap Grid */}
                      <div className="heatmap-grid-container">
                        <div className="activity-columns-wrapper">
                          {Array.from({ length: 14 }).map((_, colIdx) => (
                            <div key={colIdx} className="activity-column">
                              {Array.from({ length: 5 }).map((_, cellIdx) => {
                                // ~29% active cells (20 active cells out of 70 total cells)
                                const seed = (colIdx * 3 + cellIdx * 7) % 11;
                                let level = 0;
                                if (seed === 2 || seed === 5 || seed === 9) level = 4;
                                return (
                                  <div
                                    key={cellIdx}
                                    className={`heatmap-cell level-${level}`}
                                    title={level > 0 ? "Active session logs" : "No activity"}
                                  ></div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Legend Bottom Right */}
                      <div className="d-flex align-items-center justify-content-end gap-3 mt-2" style={{ fontSize: "0.72rem", color: "var(--tx3)" }}>
                        <div className="d-flex align-items-center gap-1.5">
                          <div className="heatmap-cell level-0" style={{ width: 10, height: 10, cursor: "default" }}></div>
                          <span>Inactive</span>
                        </div>
                        <div className="d-flex align-items-center gap-1.5">
                          <div className="heatmap-cell level-4" style={{ width: 10, height: 10, cursor: "default" }}></div>
                          <span>Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 4 — Achievements (Full Width) */}
                {achievements.length > 0 && (
                  <div className="cyber-card achievements-card-layout">
                    <h4 className="section-title" style={{ marginBottom: "8px" }}>
                      Achievements
                    </h4>
                    <div className="achievements-grid-refined">
                      {achievements.map((item) => (
                        <div 
                          key={item.id} 
                          className={`achievement-badge ${item.unlocked ? "unlocked" : "locked"} d-flex align-items-center gap-3`}
                          title={item.desc}
                        >
                          <div className="achievement-emoji">{item.emoji}</div>
                          <div>
                            <div className="achievement-title">{item.title}</div>
                            <div className="achievement-desc">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
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
              >
                <div style={{ marginBottom: "32px" }}>
                  <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
                    Preferences & Settings
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: 0 }}>
                    Customize your student sandbox and dashboard experience.
                  </p>
                </div>

                <div
                  style={{
                    background: "var(--sf)",
                    border: "1px solid var(--bd)",
                    borderRadius: "18px",
                    padding: "24px",
                    maxWidth: "600px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className="setting-row">
                      <div>
                        <div style={{ fontSize: ".875rem", fontWeight: 500, color: "var(--tx)" }}>AI Code Suggestions</div>
                        <div style={{ fontSize: ".78rem", color: "var(--tx3)" }}>Real-time AI analysis in editor</div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={aiSuggestions}
                          onChange={() => setAiSuggestions(!aiSuggestions)}
                        />
                        <span className="toggle-thumb"></span>
                      </label>
                    </div>

                    <div className="setting-row">
                      <div>
                        <div style={{ fontSize: ".875rem", fontWeight: 500, color: "var(--tx)" }}>Auto-save Code</div>
                        <div style={{ fontSize: ".78rem", color: "var(--tx3)" }}>Automatically save editor drafts</div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={autoSave}
                          onChange={() => setAutoSave(!autoSave)}
                        />
                        <span className="toggle-thumb"></span>
                      </label>
                    </div>

                    <div className="setting-row" style={{ border: "none" }}>
                      <div>
                        <div style={{ fontSize: ".875rem", fontWeight: 500, color: "var(--tx)" }}>Assignment Reminders</div>
                        <div style={{ fontSize: ".78rem", color: "var(--tx3)" }}>Email alerts before due dates</div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={emailAlerts}
                          onChange={() => setEmailAlerts(!emailAlerts)}
                        />
                        <span className="toggle-thumb"></span>
                      </label>
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
