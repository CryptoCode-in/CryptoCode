import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiArrowRight, FiMail } from "react-icons/fi";
import { API_URL } from "../../utils/api";

import "./Auth.css";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import AuthBackground from "./AuthBackground";
import LeftPanel from "./LeftPanel";

const LoginModal = ({ isOpen, initialTab = "login", onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "student",
  });
 const [signupData, setSignupData] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",

  // Student fields
  college: "",
  roll: "",
  year: "",
  semester: "",
  branch: "",

  // Teacher fields
  department: "",
  teacherCollege: "",
  subjects: [],

  role: "student",
});
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  // ── Forgot Password state ──────────────────────────────────
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState({ type: "", text: "" });


  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || "login");
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";

    return () => {
      document.body.style.overflow = originalBodyOverflow || "auto";
      document.body.style.height = originalBodyHeight || "";
      document.documentElement.style.overflow = originalHtmlOverflow || "";
      document.documentElement.style.height = originalHtmlHeight || "";
    };
  }, [isOpen]);

  const showLoginError = (message) => {
    setLoginError(message);
    window.setTimeout(() => setLoginError(""), 3200);
  };

  const showSignupError = (message) => {
    setSignupError(message);
    window.setTimeout(() => setSignupError(""), 3200);
  };

  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    setForgotMessage({ type: "", text: "" });
    const email = forgotEmail.trim();
    if (!email) {
      setForgotMessage({ type: "error", text: "Please enter your email address." });
      return;
    }
    setForgotLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setForgotMessage({ type: "error", text: data.message || "Failed to send reset email." });
      } else {
        setForgotMessage({ type: "success", text: data.message || "Reset link sent! Check your inbox." });
      }
    } catch {
      setForgotMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setForgotLoading(false);
    }
  };


  const handleLogin = async (event) => {
    event.preventDefault();
    const email = loginData.email.trim();
    const password = loginData.password.trim();

    if (!email || !password) {
      showLoginError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Use shared API_URL from utils

      const response = await fetch(`${API_URL}/auth/login`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: loginData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showLoginError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("session", JSON.stringify(data.session));
      localStorage.setItem(
        "cryptocode_user",
        JSON.stringify({
          name: data.user.email.split("@")[0],
          email: data.user.email,
          role: loginData.role,
        })
      );

      const authenticatedUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || loginData.role,
        rollNo: data.user.roll_no,
        year: data.user.year,
        semester: data.user.semester,
        branch: data.user.branch,
        college: data.user.college,
        department: data.user.department,
        subjects: data.user.subjects,
      };

      try {
        await fetch(`${API_URL}/notifications/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: authenticatedUser.id,
            user_name: authenticatedUser.name || email.split("@")[0],
            role: authenticatedUser.role,
            type: "login",
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.warn("Could not sync login notification to backend:", err);
      }

      onLoginSuccess(authenticatedUser);
    } catch (error) {
      console.error(error);
      if (import.meta.env.DEV) {
        console.warn("Backend server connection failed during development. Authenticating locally with mock credentials.", error);
        const mockUser = {
          id: "mock_" + email.split("@")[0],
          name: email.split("@")[0],
          email: email,
          role: loginData.role,
        };
        try {
          const localNotifs = JSON.parse(localStorage.getItem("cryptocode_notifications") || "[]");
          const formatter = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Kolkata",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
          });
          const parts = formatter.formatToParts(new Date());
          const m = {};
          parts.forEach(p => { m[p.type] = p.value; });
          const formattedTime = `${m.day} ${m.month} ${m.year}, ${m.hour}:${m.minute} ${(m.dayPeriod || "").toUpperCase()}`;
          const isT = loginData.role === "teacher";
          const newNotif = {
            id: "notif_" + Date.now(),
            user_id: mockUser.id,
            user_name: mockUser.name,
            role: loginData.role,
            title: "Login Successful",
            message: `${isT ? "Teacher" : "Student"} ${mockUser.name} logged in at ${formattedTime}`,
            type: "login",
            read: false,
            created_at: new Date().toISOString()
          };
          localNotifs.unshift(newNotif);
          localStorage.setItem("cryptocode_notifications", JSON.stringify(localNotifs));
        } catch {}

        localStorage.setItem("cryptocode_user", JSON.stringify(mockUser));
        onLoginSuccess(mockUser);
      } else {
        showLoginError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
const handleSignup = async (event) => {
  event.preventDefault();

  const name = signupData.name.trim();
  const email = signupData.email.trim();
  const password = signupData.password.trim();
  const confirmPassword = signupData.confirmPassword.trim();

console.log("SEMESTER VALUE:", signupData.semester);
  if (!name || !email || !password || !confirmPassword) {
    showSignupError("Please fill in every required field.");
    return;
  }

  if (password !== confirmPassword) {
    showSignupError("Passwords do not match.");
    return;
  }
    if (signupData.role === "student") {
      const roll = signupData.roll?.trim();
      const branch = signupData.branch?.trim();
      const year = signupData.year?.trim();
      const semester = signupData.semester?.trim();

      if (!roll || !branch || !year || !semester) {
        showSignupError("Roll number, branch, year, and semester are required for students.");
        return;
      }
    }
    

    if (signupData.role === "teacher") {
      const department = signupData.department?.trim();
      const teacherCollege = signupData.teacherCollege?.trim();
      const subjects = signupData.subjects || [];

      if (!department) {
        showSignupError("Department is required for teachers.");
        return;
      }

      if (!teacherCollege) {
        showSignupError("College / Institute is required for teachers.");
        return;
      }

      if (subjects.length === 0) {
        showSignupError("Select at least one subject handled by the teacher.");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
  name,
  email,
  password,
  role: signupData.role,

  roll_no: signupData.role === "student" ? (signupData.roll?.trim() || null) : null,
  year: signupData.role === "student" ? (signupData.year?.trim() || null) : null,
  semester: signupData.role === "student" ? (signupData.semester?.trim() || null) : null,
  branch: signupData.role === "student" ? (signupData.branch?.trim() || null) : null,
  college: signupData.role === "student"
    ? (signupData.college?.trim() || null)
    : (signupData.teacherCollege?.trim() || null),

  department: signupData.role === "teacher" ? (signupData.department?.trim() || null) : null,
  subjects: signupData.role === "teacher" ? (signupData.subjects || []) : [],
}),
      });

      const data = await response.json();

      if (!response.ok) {
        showSignupError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      const createdProfile = Array.isArray(data.user) ? data.user[0] : data.user;
      const userObj = {
        id: createdProfile?.user_id || createdProfile?.id,
        name: createdProfile?.name || name,
        email: createdProfile?.email || email,
        role: createdProfile?.role || signupData.role,
        rollNo: createdProfile?.roll_no || signupData.roll?.trim() || "",
        year: createdProfile?.year || signupData.year?.trim() || "",
        semester: createdProfile?.semester || signupData.semester?.trim() || "",
        branch: createdProfile?.branch || signupData.branch?.trim() || "",
        college: createdProfile?.college ||
          (signupData.role === "student" ? signupData.college?.trim() : signupData.teacherCollege?.trim()) ||
          "",
        department: createdProfile?.department || signupData.department?.trim() || "",
        subjects: createdProfile?.subjects || signupData.subjects || [],
      };

      localStorage.setItem("cryptocode_user", JSON.stringify(userObj));
      onLoginSuccess(userObj);
      onClose();
    } catch (error) {
      console.error(error);
      if (import.meta.env.DEV) {
        console.warn("Backend server connection failed during development. Signing up locally with mock credentials.", error);
        const mockUser = {
          name,
          email,
          role: signupData.role,
        };
        localStorage.setItem("cryptocode_user", JSON.stringify(mockUser));
        onLoginSuccess(mockUser);
        onClose();
      } else {
        showSignupError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = useMemo(
    () => [
      { id: "login", label: "Login" },
      { id: "signup", label: "Register" },
    ],
    []
  );

  const setSignupRole = (role) => {
    setSignupData((prev) => ({ ...prev, role }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="auth-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <AuthBackground />

        <motion.div
          className="auth-card"
          initial={{ opacity: 0, scale: 0.95, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <button className="auth-close" type="button" onClick={onClose} aria-label="Close authentication panel">
            <FiX />
          </button>

          <div className="auth-panel-left">
            <LeftPanel />
          </div>

          <div className="auth-panel-right auth-right">
            <div className="auth-panel-shell">
              <div className="auth-header">
                <div className="auth-panel-heading">
                  <div>
                    <p className="auth-panel-eyebrow">Welcome back</p>
                    <h3>{activeTab === "login" ? "Access your workspace" : "Create a free account"}</h3>
                  </div>
                  <div className="auth-tab-group" role="tablist" aria-label="Authentication tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`auth-tab ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                    <motion.div
                      className="auth-tab-indicator"
                      layout
                      animate={{ x: activeTab === "login" ? 0 : "100%" }}
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    />
                  </div>
                </div>

                {activeTab === "signup" ? (
                  <div className="signup-role-switch" role="tablist" aria-label="Choose account type">
                    <motion.button type="button" className={`signup-role-pill ${signupData.role === "student" ? "active" : ""}`} onClick={() => setSignupRole("student")} whileTap={{ scale: 0.98 }}>
                      <span>Student</span>
                    </motion.button>
                    <motion.button type="button" className={`signup-role-pill ${signupData.role === "teacher" ? "active" : ""}`} onClick={() => setSignupRole("teacher")} whileTap={{ scale: 0.98 }}>
                      <span>Teacher</span>
                    </motion.button>
                    <motion.div className="signup-role-indicator" layout animate={{ x: signupData.role === "student" ? 0 : "100%" }} transition={{ type: "spring", stiffness: 260, damping: 24 }} />
                  </div>
                ) : null}
              </div>

              <div className="auth-body">
                <AnimatePresence mode="wait">
                  {activeTab === "login" ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25 }}
                    >
                      {showForgotPassword ? (
                        <form className="auth-form" onSubmit={handleForgotPassword}>
                          <div style={{ marginBottom: "8px" }}>
                            <p style={{ margin: "0 0 6px", color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
                              Enter your registered email address and we&#39;ll send you a link to reset your password.
                            </p>
                          </div>
                          <div className="auth-group">
                            <label className="auth-label">
                              <span className="auth-label-icon"><FiMail /></span>
                              Email Address
                            </label>
                            <input
                              type="email"
                              className="auth-input"
                              placeholder="you@college.edu"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              required
                              autoFocus
                            />
                          </div>
                          {forgotMessage.text && (
                            <div
                              className="auth-form-alert"
                              style={{
                                background: forgotMessage.type === "success" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.16)",
                                borderColor: forgotMessage.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.2)",
                                color: forgotMessage.type === "success" ? "#6ee7b7" : "#fecdd3",
                              }}
                            >
                              {forgotMessage.text}
                            </div>
                          )}
                          <motion.button
                            type="submit"
                            className="auth-btn"
                            disabled={forgotLoading}
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {forgotLoading ? <div className="auth-spinner" /> : <><span>Send Reset Link</span><FiArrowRight /></>}
                          </motion.button>
                          <button
                            type="button"
                            className="auth-text-btn"
                            style={{ marginTop: "8px", justifyContent: "center" }}
                            onClick={() => {
                              setShowForgotPassword(false);
                              setForgotEmail("");
                              setForgotMessage({ type: "", text: "" });
                            }}
                          >
                            ← Back to Login
                          </button>
                        </form>
                      ) : (
                        <>
                          {loginError ? <div className="auth-form-alert">{loginError}</div> : null}
                          <LoginForm
                            loginData={loginData}
                            setLoginData={setLoginData}
                            loading={loading}
                            handleLogin={handleLogin}
                            onForgotPassword={() => {
                              setShowForgotPassword(true);
                              setForgotEmail(loginData.email || "");
                              setForgotMessage({ type: "", text: "" });
                            }}
                          />
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.25 }}
                    >
                      {signupError ? <div className="auth-form-alert">{signupError}</div> : null}
                      <SignupForm
                        signupData={signupData}
                        setSignupData={setSignupData}
                        loading={loading}
                        handleSignup={handleSignup}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="auth-footer">
                  <button type="button" className="auth-text-btn" onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}>
                    {activeTab === "login" ? "Need an account?" : "Already have an account?"}
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;