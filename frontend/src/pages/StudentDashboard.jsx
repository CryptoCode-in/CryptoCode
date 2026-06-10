import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSidebar from "../components/DashboardSidebar";
import WelcomeCard from "../components/WelcomeCard";
import StatsCard from "../components/StatsCard";
import CodeEditor from "../components/CodeEditor";
import SubmissionTable from "../components/SubmissionTable";
import ProgressCards from "../components/ProgressCards";
import ProfileCard from "../components/ProfileCard";
import { ArrowRight, Code } from "lucide-react";

function StudentDashboard({ currentUser, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Local settings toggles
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

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
        <main style={{ flex: 1, padding: "28px", overflowX: "hidden" }}>
          <AnimatePresence mode="wait">
            {activeSection === "dashboard" && (
              <motion.div
                key="dashboard"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
              >
                {/* Greetings */}
                <WelcomeCard userName={currentUser?.name} />

                {/* Grid stats overview */}
                <StatsCard level={4} solvedCount={42} assignmentsCount={18} />

                {/* Ready to Code CTA Card */}
                <div
                  style={{
                    background: "var(--sf)",
                    border: "1px solid var(--bd)",
                    borderRadius: "18px",
                    padding: "24px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: "rgba(139,92,246,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--pur)",
                        }}
                      >
                        <Code size={16} />
                      </div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
                        Ready to Code?
                      </h4>
                    </div>
                    <p style={{ color: "var(--tx2)", fontSize: "0.85rem", margin: 0 }}>
                      Launch the online coding environment and start solving programming challenges immediately.
                    </p>
                  </div>
                  <button
                    className="bgrd btn px-4 py-2"
                    style={{ gap: "8px", fontSize: "0.85rem" }}
                    onClick={() => setActiveSection("editor")}
                  >
                    <span>Start Coding</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Details layout: Table & Analytics summary */}
                <div className="row g-4">
                  <div className="col-12 col-xl-8">
                    <SubmissionTable />
                  </div>
                  <div className="col-12 col-xl-4">
                    <div
                      style={{
                        background: "var(--sf)",
                        border: "1px solid var(--bd)",
                        borderRadius: "18px",
                        padding: "20px",
                        height: "100%",
                      }}
                    >
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--tx)", marginBottom: "14px" }}>
                        Recent Activity
                      </h4>
                      <div className="d-flex flex-column gap-3" style={{ fontSize: "0.8rem" }}>
                        <div className="p-3" style={{ background: "var(--bg3)", borderRadius: "10px", border: "1px solid var(--bd)" }}>
                          <div style={{ color: "#34d399", fontWeight: 600 }}>Solved Linked List Reversal</div>
                          <div style={{ color: "var(--tx3)", fontSize: "0.72rem", marginTop: "2px" }}>10 mins ago • C++</div>
                        </div>
                        <div className="p-3" style={{ background: "var(--bg3)", borderRadius: "10px", border: "1px solid var(--bd)" }}>
                          <div style={{ color: "var(--tx2)", fontWeight: 600 }}>Submitted DFS Traversal</div>
                          <div style={{ color: "var(--tx3)", fontSize: "0.72rem", marginTop: "2px" }}>3 hours ago • Java</div>
                        </div>
                        <div className="p-3" style={{ background: "var(--bg3)", borderRadius: "10px", border: "1px solid var(--bd)" }}>
                          <div style={{ color: "#fbbf24", fontWeight: 600 }}>Streak Saved!</div>
                          <div style={{ color: "var(--tx3)", fontSize: "0.72rem", marginTop: "2px" }}>1 day ago • 14 days consecutive</div>
                        </div>
                      </div>
                    </div>
                  </div>
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
              >
                <CodeEditor />
              </motion.div>
            )}

            {activeSection === "submissions" && (
              <motion.div
                key="submissions"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
              >
                <SubmissionTable />
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
