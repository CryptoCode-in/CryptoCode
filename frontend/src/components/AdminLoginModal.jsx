import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, RefreshCw, X, ShieldAlert } from "lucide-react";
import logob from "../assets/images/logob.png";

// Characters excluding ambiguous ones like 0, O, 1, I
const CAPTCHA_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const generateRandomCaptcha = (length = 5) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length));
  }
  return result;
};

function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Generate initial random CAPTCHA whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setCaptchaCode(generateRandomCaptcha(5));
      setUsername("");
      setPassword("");
      setCaptchaInput("");
      setErrorMessage("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleRefreshCaptcha = () => {
    setIsRotating(true);
    setCaptchaCode(generateRandomCaptcha(5));
    setCaptchaInput("");
    setTimeout(() => setIsRotating(false), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. Validate CAPTCHA first (Case-insensitive)
    if (!captchaInput.trim() || captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage("Invalid CAPTCHA");
      // Generate new CAPTCHA upon failed attempt
      setCaptchaCode(generateRandomCaptcha(5));
      setCaptchaInput("");
      return;
    }

    // 2. Validate empty credentials
    if (!username.trim() || !password) {
      setErrorMessage("Please enter both username and password");
      setCaptchaCode(generateRandomCaptcha(5));
      setCaptchaInput("");
      return;
    }

    setLoading(true);

    try {
      // 3. Authenticate with backend API
      const response = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Invalid username or password");
        setCaptchaCode(generateRandomCaptcha(5));
        setCaptchaInput("");
        setLoading(false);
        return;
      }

      // 4. Save admin token and user details safely
      if (data.token) {
        localStorage.setItem("cryptocode_admin_token", data.token);
      }

      const adminUser = {
        name: data.user.name || "Administrator",
        username: data.user.username || "ccAdmin",
        role: "ADMIN",
      };

      localStorage.setItem("cryptocode_user", JSON.stringify(adminUser));

      if (onLoginSuccess) {
        onLoginSuccess(adminUser);
      }

      setLoading(false);
      onClose();
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login request error:", err);
      // Fallback network error message
      setErrorMessage("Unable to connect to authentication server. Please check backend status.");
      setCaptchaCode(generateRandomCaptcha(5));
      setCaptchaInput("");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(3, 5, 12, 0.78)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="cyber-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "linear-gradient(145deg, #0d0f1c, #090a14)",
          border: "1px solid rgba(139, 92, 246, 0.35)",
          borderRadius: "20px",
          boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.2)",
          padding: "32px 28px",
          position: "relative",
          animation: "fadeInScale 0.25s ease-out forwards",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--tx2)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "var(--pur)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--tx2)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.15))",
              border: "1px solid rgba(139, 92, 246, 0.35)",
              marginBottom: "14px",
            }}
          >
            <img src={logob} alt="CryptoCode" style={{ height: "34px", width: "auto" }} />
          </div>
          <h2
            style={{
              fontSize: "1.45rem",
              fontWeight: 700,
              color: "var(--tx)",
              letterSpacing: "-0.02em",
              marginBottom: "4px",
            }}
          >
            CryptoCode
          </h2>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "var(--pur)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Admin Login
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#fca5a5",
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}
          >
            <ShieldAlert size={16} style={{ flexShrink: 0, color: "#ef4444" }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="admin-username"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--tx2)",
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(10, 10, 18, 0.8)",
                border: "1px solid rgba(139, 92, 246, 0.22)",
                borderRadius: "10px",
                padding: "10px 14px",
                gap: "10px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--pur)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.22)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <User size={16} style={{ color: "var(--tx3)" }} />
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--tx)",
                  fontSize: "0.9rem",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--tx2)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(10, 10, 18, 0.8)",
                border: "1px solid rgba(139, 92, 246, 0.22)",
                borderRadius: "10px",
                padding: "10px 14px",
                gap: "10px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--pur)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.22)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Lock size={16} style={{ color: "var(--tx3)" }} />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--tx)",
                  fontSize: "0.9rem",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* CAPTCHA Section */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--tx2)",
                marginBottom: "6px",
              }}
            >
              CAPTCHA
            </label>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
              {/* CAPTCHA Display Box */}
              <div
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, rgba(20, 18, 38, 0.95), rgba(12, 14, 28, 0.95))",
                  border: "1px dashed rgba(139, 92, 246, 0.45)",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  letterSpacing: "0.35em",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#e2e8f0",
                  textShadow: "0 0 10px rgba(139, 92, 246, 0.6)",
                  userSelect: "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle decorative slash lines across captcha */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.15,
                    backgroundImage: "repeating-linear-gradient(45deg, #8b5cf6 0, #8b5cf6 2px, transparent 0, transparent 8px)",
                    pointerEvents: "none",
                  }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>{captchaCode}</span>
              </div>

              {/* Regenerate CAPTCHA Button */}
              <button
                type="button"
                onClick={handleRefreshCaptcha}
                title="Regenerate CAPTCHA"
                aria-label="Regenerate CAPTCHA"
                style={{
                  width: "44px",
                  height: "44px",
                  background: "rgba(139, 92, 246, 0.12)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--pur)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.25)";
                  e.currentTarget.style.borderColor = "var(--pur)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                }}
              >
                <RefreshCw
                  size={18}
                  style={{
                    transform: isRotating ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.4s ease",
                  }}
                />
              </button>
            </div>

            {/* Enter CAPTCHA Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(10, 10, 18, 0.8)",
                border: "1px solid rgba(139, 92, 246, 0.22)",
                borderRadius: "10px",
                padding: "10px 14px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--pur)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.22)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <input
                id="admin-captcha"
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter CAPTCHA"
                autoComplete="off"
                required
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--tx)",
                  fontSize: "0.9rem",
                  width: "100%",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.1em",
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bgrd"
            style={{
              padding: "13px 20px",
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "8px",
              boxShadow: "0 8px 24px rgba(139, 92, 246, 0.35)",
            }}
          >
            {loading ? "VALIDATING..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginModal;
