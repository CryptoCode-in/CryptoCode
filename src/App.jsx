import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cryptocode_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("cryptocode_theme");
      return saved !== "light";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const root = document.getElementById("htmlRoot") || document.documentElement;
    root.classList.toggle("light", !isDark);
    localStorage.setItem("cryptocode_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
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
              currentUser.role === "teacher" ? (
                <Navigate to="/teacher/dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
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
              currentUser.role === "teacher" ? (
                <Navigate to="/teacher/dashboard" replace />
              ) : (
                <StudentDashboard
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  isDark={isDark}
                  onToggleTheme={handleToggleTheme}
                />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            currentUser ? (
              currentUser.role === "teacher" ? (
                <TeacherDashboard
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  isDark={isDark}
                  onToggleTheme={handleToggleTheme}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
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
