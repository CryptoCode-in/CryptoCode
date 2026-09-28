import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
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

  useEffect(() => {
    const root = document.getElementById("htmlRoot") || document.documentElement;
    root.classList.remove("light");
    if (localStorage.getItem("cryptocode_theme") === "light") {
      localStorage.removeItem("cryptocode_theme");
    }
  }, []);

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
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PrivacyPolicy
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