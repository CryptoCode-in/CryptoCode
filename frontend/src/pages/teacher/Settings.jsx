import { useState, useEffect } from "react";
import {
  Palette,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TeacherLayout from "../../components/teacher/TeacherLayout";

function Settings({ currentUser, onLogout }) {
  // Resolve base user info from prop or fallback to localStorage
  const user = currentUser || (() => {
    try {
      return JSON.parse(localStorage.getItem("cryptocode_user") || "{}");
    } catch {
      return {};
    }
  })();

  const userEmail = user?.email || "";
  const userId = user?.id || user?.user_id || "";

  // ==========================================
  // 1. APPEARANCE PREFERENCES (Accent Color)
  // ==========================================
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("cryptocode_accent") || "purple";
  });

  // Apply accent color changes dynamically to root styles (matching Student Settings)
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
      // Purple (Default)
      root.style.removeProperty("--pur");
      root.style.removeProperty("--pur2");
      root.style.removeProperty("--grad");
      root.style.removeProperty("--grad2");
      root.style.removeProperty("--bd");
      root.style.removeProperty("--bd2");
    }
  }, [accentColor]);

  // ==========================================
  // 2. CHANGE PASSWORD STATE & HANDLERS
  // ==========================================
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordForm.currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (!passwordForm.newPassword) {
      setError("Please enter your new password.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setError("New password cannot be the same as your current password.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      setSuccess("Password updated successfully! Your new password is now active.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordForm(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
  };

  // ==========================================
  // 3. LOGOUT ALL DEVICES
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

  return (
    <TeacherLayout
      title="Preferences & Settings"
      description="Manage your appearance preferences and security credentials."
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .settings-container {
              display: flex;
              flex-direction: column;
              gap: 24px;
              width: 100%;
              margin-bottom: 48px;
            }
            .setting-section-card {
              background: var(--sf) !important;
              border: 1px solid var(--bd) !important;
              border-radius: 20px !important;
              padding: 24px;
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
              justify-content: space-between;
              border-bottom: 1px solid var(--bd);
              padding-bottom: 12px;
            }
            .setting-row-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              min-height: 72px;
              padding: 12px 0;
              border-bottom: 1px solid var(--bd);
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
              gap: 4px;
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
                padding-left: 52px;
              }
            }
          `,
        }}
      />

      <div className="settings-container">
        {/* =========================================================
            SECTION 1: APPEARANCE (Accent Color)
        ========================================================= */}
        <div className="setting-section-card">
          <div className="setting-section-title">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Palette size={16} />
              <span>Appearance</span>
            </div>
          </div>

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

        {/* =========================================================
            SECTION 2: ACCOUNT SECURITY & PASSWORD
            Fully working Change Password via Supabase Auth + Admin
        ========================================================= */}
        <div className="setting-section-card">
          <div className="setting-section-title">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Lock size={16} />
              <span>Account Security</span>
            </div>
          </div>

          {/* Change Password Row */}
          <div className="setting-row-item" style={{ borderBottom: showPasswordForm ? "none" : undefined }}>
            <div className="setting-left">
              <div className="setting-icon-wrapper">
                <Lock size={16} />
              </div>
              <div className="setting-info">
                <span className="setting-label">Change Password</span>
                <span className="setting-desc">
                  Update your login security credentials with Supabase authentication
                </span>
              </div>
            </div>
            <div className="setting-right">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm((prev) => !prev);
                  setError("");
                  setSuccess("");
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
                      {/* Current Password Field */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "var(--tx2)",
                            marginBottom: "6px",
                          }}
                        >
                          Current Password
                        </label>
                        <div className="pw-field-container">
                          <span className="pw-field-icon">
                            <Lock size={15} />
                          </span>
                          <input
                            type={showPassword.current ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                            placeholder="Enter current password"
                            className="pw-field-input"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                current: !prev.current,
                              }))
                            }
                            className="pw-eye-btn"
                            title={showPassword.current ? "Hide password" : "Show password"}
                          >
                            {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* New Password Field */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "var(--tx2)",
                            marginBottom: "6px",
                          }}
                        >
                          New Password
                        </label>
                        <div className="pw-field-container">
                          <span className="pw-field-icon">
                            <KeyRound size={15} />
                          </span>
                          <input
                            type={showPassword.new ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            placeholder="Enter new password (min. 6 characters)"
                            className="pw-field-input"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                            className="pw-eye-btn"
                            title={showPassword.new ? "Hide password" : "Show password"}
                          >
                            {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.72rem",
                            color: "var(--tx3)",
                            marginTop: "4px",
                          }}
                        >
                          Must contain at least 6 characters.
                        </span>
                      </div>

                      {/* Confirm New Password Field */}
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "var(--tx2)",
                            marginBottom: "6px",
                          }}
                        >
                          Confirm New Password
                        </label>
                        <div className="pw-field-container">
                          <span className="pw-field-icon">
                            <KeyRound size={15} />
                          </span>
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            placeholder="Re-enter new password"
                            className="pw-field-input"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                            className="pw-eye-btn"
                            title={showPassword.confirm ? "Hide password" : "Show password"}
                          >
                            {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Error Alert Banner */}
                      {error && (
                        <div
                          style={{
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "1px solid rgba(239, 68, 68, 0.25)",
                            borderRadius: "10px",
                            padding: "12px 16px",
                            color: "#f87171",
                            fontSize: "0.84rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <AlertCircle size={16} style={{ flexShrink: 0 }} />
                          <span>{error}</span>
                        </div>
                      )}

                      {/* Success Alert Banner */}
                      {success && (
                        <div
                          style={{
                            background: "rgba(16, 185, 129, 0.08)",
                            border: "1px solid rgba(16, 185, 129, 0.25)",
                            borderRadius: "10px",
                            padding: "12px 16px",
                            color: "#34d399",
                            fontSize: "0.84rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                          <span>{success}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          paddingTop: "6px",
                        }}
                      >
                        <button
                          type="submit"
                          disabled={loading}
                          className="setting-btn setting-btn-submit"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={14} className="spin-loader" />
                              <span>Updating Password...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={14} />
                              <span>Update Password</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelPassword}
                          disabled={loading}
                          className="setting-btn setting-btn-primary"
                        >
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
                <span className="setting-desc">
                  End all active web sessions across all browsers
                </span>
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
    </TeacherLayout>
  );
}

export default Settings;
