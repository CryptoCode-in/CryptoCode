import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLock, FiArrowRight, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { API_URL } from "../utils/api";

/**
 * ResetPassword page — opened when Supabase sends the user a recovery link.
 *
 * Supabase appends a `token_hash` query parameter and a `type=recovery` param
 * to the redirect URL (http://localhost:5173/reset-password?token_hash=...&type=recovery).
 *
 * This page reads token_hash from the URL, lets the user pick a new password,
 * then POSTs to the backend /auth/reset-password endpoint which verifies the
 * token and updates the password via Supabase Admin — keeping all keys server-side.
 */

function ResetPassword() {
  const [tokenHash, setTokenHash] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase puts token_hash in the query string for PKCE-style links
    const params = new URLSearchParams(window.location.search);
    const hash = params.get("token_hash");
    if (hash) {
      setTokenHash(hash);
    } else {
      setMessage({
        type: "error",
        text: "Invalid or missing reset token. Please request a new password-reset link.",
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!newPassword) {
      setMessage({ type: "error", text: "Please enter a new password." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_hash: tokenHash, newPassword }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setMessage({ type: "error", text: data.message || "Failed to reset password." });
      } else {
        setMessage({ type: "success", text: data.message || "Password reset successfully!" });
        setDone(true);
      }
    } catch {
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#070b17",
        padding: "24px",
      }}
    >
      {/* Decorative orbs from Auth.css */}
      <div className="auth-background">
        <div className="auth-orb orb-1" />
        <div className="auth-orb orb-2" />
        <div className="auth-grid" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 28px 70px rgba(2,6,23,0.42)",
          padding: "40px 36px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ margin: "0 0 4px", color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.26em", fontSize: "0.72rem", fontWeight: 700 }}>
          CryptoCode
        </p>
        <h2 style={{ margin: "0 0 8px", color: "#f8fafc", fontSize: "1.6rem", fontWeight: 700 }}>
          Set New Password
        </h2>
        <p style={{ margin: "0 0 28px", color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Choose a strong password for your account.
        </p>

        {message.text && (
          <div
            className="auth-form-alert"
            style={{
              background: message.type === "success" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.16)",
              borderColor: message.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.2)",
              color: message.type === "success" ? "#6ee7b7" : "#fecdd3",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {message.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            <span>{message.text}</span>
          </div>
        )}

        {!done && tokenHash && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="auth-group">
              <label className="auth-label">
                <span className="auth-label-icon"><FiLock /></span>
                New Password
              </label>
              <input
                type="password"
                className="auth-input"
                placeholder="Enter new password (min. 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">
                <span className="auth-label-icon"><FiLock /></span>
                Confirm Password
              </label>
              <input
                type="password"
                className="auth-input"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="auth-btn"
              disabled={loading}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: "8px" }}
            >
              {loading ? <div className="auth-spinner" /> : <><span>Reset Password</span><FiArrowRight /></>}
            </motion.button>
          </form>
        )}

        {done && (
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#c4b5fd",
                fontSize: "0.95rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Go to Login <FiArrowRight />
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ResetPassword;
