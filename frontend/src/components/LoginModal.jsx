import { useState, useEffect } from "react";
import { User, Mail, Hash, Calendar, BookOpen, School, Phone, Lock, Eye, EyeOff, Shield } from "lucide-react";

function LoginModal({ isOpen, initialTab, onClose, onLoginSuccess }) {
  const [show, setShow] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginRole, setLoginRole] = useState("student");
  const [loginErr, setLoginErr] = useState("");

  // Signup Form State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupRollNo, setSignupRollNo] = useState("");
  const [signupYear, setSignupYear] = useState("");
  const [signupBranch, setSignupBranch] = useState("");
  const [signupCollege, setSignupCollege] = useState("");
  const [signupMobileNo, setSignupMobileNo] = useState("");
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

  const handleLogin = async () => {

  const email = loginEmail.trim();
  const pass = loginPass.trim();

  if (!email || !pass) {
    showLoginErr("Please enter email and password.");
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: pass,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      showLoginErr(data.message || "Login Failed");
      return;
    }

    console.log(data);
    localStorage.setItem(
      "session",
      JSON.stringify(data.session)
    );

    localStorage.setItem(
  "cryptocode_user",
  JSON.stringify({
    name: data.user.email.split("@")[0],
    email: data.user.email,
    role: loginRole,
  })
);

    onLoginSuccess({
      name: data.user.email.split("@")[0],
      email: data.user.email,
      role: loginRole,
    });


  } catch (error) {

    console.error(error);

    showLoginErr("Server Error");

  }
};


const handleSignup = async () => {

  const name = signupName.trim();
  const email = signupEmail.trim();
  const pass = signupPass.trim();

  if (!name || !email || !pass) {
    showSignupErr("Please fill all fields.");
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password: pass,
          role: signupRole,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      showSignupErr(data.message || "Signup Failed");
      return;
    }

    alert("Signup Successful");

    onClose();

  } catch (error) {

    console.error(error);

    showSignupErr("Server Error");
  }
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
          width: "min(460px, 100vw)",
          background: "var(--bg2)",
          borderLeft: "1px solid var(--bd)",
          overflowY: "auto",
          transform: slideIn ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--bd)",
            background: "var(--bg3)",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div className="logo-i" style={{ width: "30px", height: "30px", fontSize: ".8rem" }}>
              <i className="fa-solid fa-code"></i>
            </div>
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>CryptoCode Portal</span>
          </div>
          <button
            className="boc"
            style={{ width: "32px", height: "32px", padding: 0, borderRadius: "8px", fontSize: "1.1rem" }}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Content Form Wrapper */}
        <div style={{ padding: "24px", flex: 1 }}>
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

          {/* Login Section */}
          <div id="fLogin" style={{ display: activeTab === "login" ? "block" : "none" }}>
            <div id="loginErr" className={`err-msg ${loginErr ? "show" : ""}`}>
              <i className="fa-solid fa-circle-exclamation me-1"></i>
              <span id="loginErrMsg">{loginErr}</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="olbl"><User size={14} style={{ marginRight: "6px", display: "inline" }} />Email address</label>
                <input
                  className="oinp"
                  type="email"
                  placeholder="you@college.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="olbl"><Lock size={14} style={{ marginRight: "6px", display: "inline" }} />Password</label>
                <input
                  className="oinp"
                  type="password"
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                />
              </div>

              <div>
                <label className="olbl"><Shield size={14} style={{ marginRight: "6px", display: "inline" }} />Portal Access Role</label>
                <div style={{ display: "flex", gap: "16px" }}>
                  <label className="olbl" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="loginRole"
                      value="student"
                      checked={loginRole === "student"}
                      onChange={() => setLoginRole("student")}
                    />{" "}
                    Student
                  </label>
                  <label className="olbl" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: 500 }}>
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
              </div>
            </div>

            <button className="bgrd btn w-100 py-3 fw-semibold fs-6 mt-4" onClick={handleLogin}>
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

          {/* Sign Up Section */}
          <div id="fSignup" style={{ display: activeTab === "signup" ? "block" : "none" }}>
            <div id="signupErr" className={`err-msg ${signupErr ? "show" : ""}`}>
              <i className="fa-solid fa-circle-exclamation me-1"></i>
              <span>{signupErr}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name */}
              <div>
                <label className="olbl"><User size={13} style={{ marginRight: "4px", display: "inline" }} />Full Name</label>
                <input
                  className="oinp"
                  type="text"
                  placeholder="Rahul Sharma"
                  value={signupName}
                  style={{ marginBottom: 0 }}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label className="olbl"><Mail size={13} style={{ marginRight: "4px", display: "inline" }} />College Email</label>
                <input
                  className="oinp"
                  type="email"
                  placeholder="you@college.edu"
                  value={signupEmail}
                  style={{ marginBottom: 0 }}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>

              {/* Roll No */}
              <div>
                <label className="olbl"><Hash size={13} style={{ marginRight: "4px", display: "inline" }} />Roll Number</label>
                <input
                  className="oinp"
                  type="text"
                  placeholder="220501"
                  value={signupRollNo}
                  style={{ marginBottom: 0 }}
                  onChange={(e) => setSignupRollNo(e.target.value)}
                />
              </div>

              {/* Academic Year Selector */}
              <div>
                <label className="olbl"><Calendar size={13} style={{ marginRight: "4px", display: "inline" }} />Academic Year</label>
                <select
                  className="oinp"
                  value={signupYear}
                  style={{ marginBottom: 0, cursor: "pointer", background: "var(--sf)", color: "var(--tx)" }}
                  onChange={(e) => setSignupYear(e.target.value)}
                >
                  <option value="">Select Year...</option>
                  <option value="First Year (FY)">First Year (FY)</option>
                  <option value="Second Year (SY)">Second Year (SY)</option>
                  <option value="Third Year (TY)">Third Year (TY)</option>
                  <option value="Final Year (B.Tech)">Final Year (B.Tech)</option>
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="olbl"><BookOpen size={13} style={{ marginRight: "4px", display: "inline" }} />Branch / Stream</label>
                <input
                  className="oinp"
                  type="text"
                  placeholder="Computer Technology (CM)"
                  value={signupBranch}
                  style={{ marginBottom: 0 }}
                  onChange={(e) => setSignupBranch(e.target.value)}
                />
              </div>

              {/* College */}
              <div>
                <label className="olbl"><School size={13} style={{ marginRight: "4px", display: "inline" }} />College / Institute Name</label>
                <input
                  className="oinp"
                  type="text"
                  placeholder="Government Polytechnic Nashik"
                  value={signupCollege}
                  style={{ marginBottom: 0 }}
                  onChange={(e) => setSignupCollege(e.target.value)}
                />
              </div>

              {/* Mobile No */}
              <div>
                <label className="olbl"><Phone size={13} style={{ marginRight: "4px", display: "inline" }} />Mobile Number</label>
                <input
                  className="oinp"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={signupMobileNo}
                  style={{ marginBottom: 0 }}
                  onChange={(e) => setSignupMobileNo(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="olbl"><Lock size={13} style={{ marginRight: "4px", display: "inline" }} />Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="oinp"
                    type={showPassword ? "text" : "password" }
                    placeholder="Min. 8 characters"
                    value={signupPass}
                    style={{ marginBottom: 0, paddingRight: "40px" }}
                    onChange={(e) => setSignupPass(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--tx3)" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="olbl" style={{ marginBottom: "6px" }}><Shield size={13} style={{ marginRight: "4px", display: "inline" }} />Registration Role</label>
                <div style={{ display: "flex", gap: "16px" }}>
                  <label className="olbl" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="signupRole"
                      value="student"
                      checked={signupRole === "student"}
                      onChange={() => setSignupRole("student")}
                    />{" "}
                    Student
                  </label>
                  <label className="olbl" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: 500 }}>
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
              </div>
            </div>

            <button className="bgrd btn w-100 py-3 fw-semibold fs-6 mt-4" onClick={handleSignup}>
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
