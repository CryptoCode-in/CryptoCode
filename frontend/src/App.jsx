import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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
        <Route
          path="/privacy-policy"
          element={
            <PrivacyPolicy
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
              onLoginSuccess={handleLoginSuccess}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;