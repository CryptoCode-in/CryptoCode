import { useState, useEffect } from "react";
import Landing from "./pages/Landing";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.getElementById("htmlRoot") || document.documentElement;
    root.classList.toggle("light", !isDark);
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

useEffect(() => {

  const savedUser =
    localStorage.getItem("user");

  if (savedUser) {
    setCurrentUser(
      JSON.parse(savedUser)
    );
  }

}, []);

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

  return (
    <Landing
      isDark={isDark}
      onToggleTheme={handleToggleTheme}
      onLoginSuccess={setCurrentUser}
    />
  );
}

export default App;