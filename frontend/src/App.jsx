import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";

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
    localStorage.removeItem("cryptocode_admin_token");
  };

  const isAdmin = currentUser?.role?.toUpperCase() === "ADMIN";
  const isTeacher = currentUser?.role === "teacher";
  const isStudent = currentUser && !isAdmin && !isTeacher;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              isAdmin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : isTeacher ? (
                <Navigate to="/teacher/dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Landing onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Admin Dashboard - Protected: ADMIN Only */}
        <Route
          path="/admin/dashboard"
          element={
            currentUser ? (
              isAdmin ? (
                <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
              ) : isTeacher ? (
                <Navigate to="/teacher/dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Student Dashboard - Protected: STUDENT Only */}
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              isAdmin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : isTeacher ? (
                <Navigate to="/teacher/dashboard" replace />
              ) : (
                <StudentDashboard currentUser={currentUser} onLogout={handleLogout} />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Alias for /student/dashboard */}
        <Route
          path="/student/dashboard"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Teacher Dashboard - Protected: TEACHER Only */}
        <Route
          path="/teacher/dashboard"
          element={
            currentUser ? (
              isAdmin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : isTeacher ? (
                <TeacherDashboard currentUser={currentUser} onLogout={handleLogout} />
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
          element={<PrivacyPolicy onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/policy"
          element={<Navigate to="/privacy-policy" replace />}
        />
        <Route
          path="/faq"
          element={<FAQ onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/contact"
          element={<Contact onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;