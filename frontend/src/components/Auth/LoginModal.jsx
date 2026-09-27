import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiArrowRight, FiChrome } from "react-icons/fi";

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
  subjects: [],

  role: "student",
});
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

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
      const response = await fetch("http://localhost:5000/auth/login", {
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

      onLoginSuccess({
  id: data.user.id,
  name: data.user.name,
  email: data.user.email,
  role: data.user.role,
  rollNo: data.user.roll_no,
  year: data.user.year,
  semester: data.user.semester,
  branch: data.user.branch,
  college: data.user.college,
  department: data.user.department,
  subjects: data.user.subjects,
});
    } catch (error) {
      console.error(error);
      if (import.meta.env.DEV) {
        console.warn("Backend server connection failed during development. Authenticating locally with mock credentials.", error);
        const mockUser = {
          name: email.split("@")[0],
          email: email,
          role: loginData.role,
        };
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
      const subjects = signupData.subjects || [];

      if (!department) {
        showSignupError("Department is required for teachers.");
        return;
      }

      if (subjects.length === 0) {
        showSignupError("Select at least one subject handled by the teacher.");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
  name,
  email,
  password,
  role: signupData.role,

  roll_no: signupData.roll?.trim() || null,
  year: signupData.year?.trim() || null,
  semester: signupData.semester?.trim() || null,
  branch: signupData.branch?.trim() || null,
  college: signupData.college?.trim() || null,

  department: signupData.department?.trim() || null,
  subjects: signupData.subjects || [],
}),
      });

      const data = await response.json();

      if (!response.ok) {
        showSignupError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "cryptocode_user",
        JSON.stringify({
          name,
          email,
          role: signupData.role,
        })
      );

      onLoginSuccess({
        name,
        email,
        role: signupData.role,
      });
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
                      {loginError ? <div className="auth-form-alert">{loginError}</div> : null}
                      <LoginForm
                        loginData={loginData}
                        setLoginData={setLoginData}
                        loading={loading}
                        handleLogin={handleLogin}
                      />
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
                  <button type="button" className="auth-ghost-btn">
                    <FiChrome />
                    Continue with Google
                  </button>
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