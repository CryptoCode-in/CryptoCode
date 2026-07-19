import { useState } from "react";
import { Moon, Bell, Mail, Lock, User, Layout } from "lucide-react";
import TeacherLayout from "../../components/teacher/TeacherLayout";

function Settings({ isDark, onToggleTheme }) {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [submissionAlerts, setSubmissionAlerts] = useState(false);

  return (
    <TeacherLayout
      title="Dashboard Settings"
      description="Configure user preferences, system alerts, and security settings."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Section 1: Appearance */}
        <div className="setting-section-card" style={{ background: "var(--sf)", border: "1px solid var(--bd)", borderRadius: "18px", padding: "24px" }}>
          <h5 className="setting-section-title mb-4 d-flex align-items-center gap-2" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "10px" }}>
            <Moon size={16} style={{ color: "var(--pur)" }} />
            <span>Appearance</span>
          </h5>

          <div className="setting-row-item d-flex align-items-center justify-content-between" style={{ padding: "8px 0" }}>
            <div className="setting-left">
              <div className="setting-info">
                <span className="setting-label" style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--tx)", display: "block" }}>Dark Theme</span>
                <span className="setting-desc" style={{ fontSize: "0.78rem", color: "var(--tx3)" }}>Toggle dark mode interface elements</span>
              </div>
            </div>
            <div className="setting-right">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={onToggleTheme}
                />
                <span className="toggle-thumb"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Notifications */}
        <div className="setting-section-card" style={{ background: "var(--sf)", border: "1px solid var(--bd)", borderRadius: "18px", padding: "24px" }}>
          <h5 className="setting-section-title mb-4 d-flex align-items-center gap-2" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "10px" }}>
            <Bell size={16} style={{ color: "var(--pur)" }} />
            <span>Alert Preferences</span>
          </h5>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div className="setting-row-item d-flex align-items-center justify-content-between">
              <div className="setting-left">
                <div className="setting-info">
                  <span className="setting-label" style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--tx)", display: "block" }}>Email Notifications</span>
                  <span className="setting-desc" style={{ fontSize: "0.78rem", color: "var(--tx3)" }}>Send summaries of student coding errors to your inbox</span>
                </div>
              </div>
              <div className="setting-right">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                  />
                  <span className="toggle-thumb"></span>
                </label>
              </div>
            </div>

            <div className="setting-row-item d-flex align-items-center justify-content-between" style={{ borderTop: "1px solid rgba(255,255,255,0.02)", paddingTop: "14px" }}>
              <div className="setting-left">
                <div className="setting-info">
                  <span className="setting-label" style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--tx)", display: "block" }}>Submission Alerts</span>
                  <span className="setting-desc" style={{ fontSize: "0.78rem", color: "var(--tx3)" }}>Instantly notify when a student submits a new file</span>
                </div>
              </div>
              <div className="setting-right">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={submissionAlerts}
                    onChange={(e) => setSubmissionAlerts(e.target.checked)}
                  />
                  <span className="toggle-thumb"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Password & Security */}
        <div className="setting-section-card" style={{ background: "var(--sf)", border: "1px solid var(--bd)", borderRadius: "18px", padding: "24px" }}>
          <h5 className="setting-section-title mb-4 d-flex align-items-center gap-2" style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "10px" }}>
            <Lock size={16} style={{ color: "var(--pur)" }} />
            <span>Security Credentials</span>
          </h5>

          <div className="setting-row-item d-flex align-items-center justify-content-between" style={{ padding: "8px 0" }}>
            <div className="setting-left">
              <div className="setting-info">
                <span className="setting-label" style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--tx)", display: "block" }}>Change Password</span>
                <span className="setting-desc" style={{ fontSize: "0.78rem", color: "var(--tx3)" }}>Update dashboard login security credentials</span>
              </div>
            </div>
            <div className="setting-right">
              <button
                onClick={() => alert("Change password modal requested (UI placeholder only).")}
                className="boc px-3 py-2"
                style={{ fontSize: "0.8rem", borderRadius: "8px" }}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

      </div>
    </TeacherLayout>
  );
}

export default Settings;
