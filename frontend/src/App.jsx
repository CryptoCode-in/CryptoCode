import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cryptocode_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.getElementById("htmlRoot") || document.documentElement;
    root.classList.toggle("light", !isDark);
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };



  if (currentUser) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", minHeight: "100vh", background: "var(--bg)", color: "var(--tx)" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>Logged in as {currentUser.name} ({currentUser.role})</h2>
        <p style={{ color: "var(--tx2)", marginBottom: "24px" }}>
          Landing page conversion has been successfully verified. Dashboard conversion will proceed in Phase 2.
        </p>
        <button className="bgrd btn px-4 py-2" onClick={() => {

  localStorage.removeItem("user");
  localStorage.removeItem("session");

  setCurrentUser(null);

}}>
          Log Out
        </button>
      </div>
    );
  }
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("cryptocode_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cryptocode_user");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Landing
                isDark={isDark}
                onToggleTheme={handleToggleTheme}
                onLoginSuccess={handleLoginSuccess}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <StudentDashboard
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;