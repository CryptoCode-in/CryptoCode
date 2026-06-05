import { useState, useEffect } from "react";

function LoginModal({ isOpen, initialTab, onClose, onLoginSuccess }) {
  const [show, setShow] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginRole, setLoginRole] = useState("student");
  const [loginErr, setLoginErr] = useState("");

  // Signup Form State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupRole, setSignupRole] = useState("student");
  const [signupErr, setSignupErr] = useState("");

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      const t = setTimeout(() => setSlideIn(true), 10);
      return () => clearTimeout(t);
    } else {
      setSlideIn(false);
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const showLoginErr = (msg) => {
    setLoginErr(msg);
    setTimeout(() => setLoginErr(""), 3000);
  };

  const showSignupErr = (msg) => {
    setSignupErr(msg);
    setTimeout(() => setSignupErr(""), 3000);
  };

  const handleLogin = () => {
    const email = loginEmail.trim();
    const pass = loginPass.trim();
    if (!email || !pass) {
      showLoginErr("Please enter email and password.");
      return;
    }
    const name = email.split("@")[0];
    onLoginSuccess({ name, email, role: loginRole });
    onClose();
  };

  const handleSignup = () => {
    const name = signupName.trim();
    const email = signupEmail.trim();
    const pass = signupPass.trim();
    if (!name || !email || !pass) {
      showSignupErr("Please fill all fields.");
      return;
    }
    onLoginSuccess({ name, email, role: signupRole });
    onClose();
  };

  if (!show) return null;

  return (
    <div
      id="loginPanel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "block",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,.7)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      ></div>
      <div
        id="panelDrawer"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          background: "var(--bg2)",
          borderLeft: "1px solid var(--bd)",
          overflowY: "auto",
          transform: slideIn ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--bd)",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div className="logo-i" style={{ width: "30px", height: "30px", fontSize: ".8rem" }}>
              <i className="fa-solid fa-code"></i>
            </div>
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>CryptoCode</span>
          </div>
          <button
            className="boc"
            style={{ width: "32px", height: "32px", padding: 0, borderRadius: "8px", fontSize: "1.1rem" }}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 24 }}>
          <div className="tab-switch">
            <button
              className={`tab-sw-btn ${activeTab === "login" ? "on" : ""}`}
              id="tabLogin"
              onClick={() => setActiveTab("login")}
            >
              Log In
            </button>
            <button
              className={`tab-sw-btn ${activeTab === "signup" ? "on" : ""}`}
              id="tabSignup"
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Login */}
          <div id="fLogin" style={{ display: activeTab === "login" ? "block" : "none" }}>
            <div id="loginErr" className={`err-msg ${loginErr ? "show" : ""}`}>
              <i className="fa-solid fa-circle-exclamation me-1"></i>
              <span id="loginErrMsg">{loginErr}</span>
            </div>
            <label className="olbl">
              <i className="fa-regular fa-envelope me-1"></i>Email address
            </label>
            <input
              className="oinp"
              type="email"
              id="loginEmail"
              placeholder="you@college.edu"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <label className="olbl">
              <i className="fa-solid fa-lock me-1"></i>Password
            </label>
            <input
              className="oinp"
              type="password"
              id="loginPass"
              placeholder="••••••••"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <label className="olbl" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="loginRole"
                  value="student"
                  checked={loginRole === "student"}
                  onChange={() => setLoginRole("student")}
                />{" "}
                Student
              </label>
              <label className="olbl" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="loginRole"
                  value="teacher"
                  checked={loginRole === "teacher"}
                  onChange={() => setLoginRole("teacher")}
                />{" "}
                Teacher
              </label>
            </div>
            <button className="bgrd btn w-100 py-3 fw-semibold fs-6" onClick={handleLogin}>
              Log In <i className="fa-solid fa-arrow-right ms-1 fa-sm"></i>
            </button>
            <div className="odiv">or continue with</div>
            <button className="oauth">
              <i className="fa-brands fa-google me-2"></i>Continue with Google
            </button>
            <p className="text-center mt-4" style={{ fontSize: ".82rem", color: "var(--tx3)" }}>
              Don't have an account?{" "}
              <a href="#" style={{ color: "var(--pur)" }} onClick={(e) => { e.preventDefault(); setActiveTab("signup"); }}>
                Sign up free
              </a>
            </p>
          </div>

          {/* Sign Up */}
          <div id="fSignup" style={{ display: activeTab === "signup" ? "block" : "none" }}>
            <div id="signupErr" className={`err-msg ${signupErr ? "show" : ""}`}>
              <i className="fa-solid fa-circle-exclamation me-1"></i>
              <span>{signupErr}</span>
            </div>
            <label className="olbl">
              <i className="fa-regular fa-user me-1"></i>Full name
            </label>
            <input
              className="oinp"
              type="text"
              id="signupName"
              placeholder="Your Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            />
            <label className="olbl">
              <i className="fa-regular fa-envelope me-1"></i>College email
            </label>
            <input
              className="oinp"
              type="email"
              id="signupEmail"
              placeholder="you@college.edu"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <label className="olbl">
              <i className="fa-solid fa-lock me-1"></i>Password
            </label>
            <input
              className="oinp"
              type="password"
              id="signupPass"
              placeholder="Min. 8 characters"
              value={signupPass}
              onChange={(e) => setSignupPass(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <label className="olbl" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="signupRole"
                  value="student"
                  checked={signupRole === "student"}
                  onChange={() => setSignupRole("student")}
                />{" "}
                Student
              </label>
              <label className="olbl" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="signupRole"
                  value="teacher"
                  checked={signupRole === "teacher"}
                  onChange={() => setSignupRole("teacher")}
                />{" "}
                Teacher
              </label>
            </div>
            <button className="bgrd btn w-100 py-3 fw-semibold fs-6" onClick={handleSignup}>
              Create Free Account <i className="fa-solid fa-arrow-right ms-1 fa-sm"></i>
            </button>
            <div className="odiv">or sign up with</div>
            <button className="oauth">
              <i className="fa-brands fa-google me-2"></i>Continue with Google
            </button>
            <p className="text-center mt-3" style={{ fontSize: ".76rem", color: "var(--tx3)" }}>
              By signing up you agree to our <a href="#" style={{ color: "var(--pur)" }}>Terms</a> &{" "}
              <a href="#" style={{ color: "var(--pur)" }}>Privacy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
