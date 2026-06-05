import { useState } from "react";
import logob from "../assets/images/logob.png";
import logow from "../assets/images/logow.png";

function Navbar({ isDark, onToggleTheme, onOpenPanel }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav id="nbar">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100">
            <a
              href="#"
              className="d-flex align-items-center gap-2"
              style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--tx)" }}
            >
              <img src={logob} style={{ height: "50px", width: "auto" }} alt="Logo Dark" />
              <img src={logow} style={{ height: "45px", width: "auto" }} alt="Logo Light" />
              <span></span>
            </a>
            <div className="d-none d-lg-flex align-items-center gap-1 ms-auto me-auto">
              <a href="#features" className="nav-link">Features</a>
              <a href="#languages" className="nav-link">Languages</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#faq" className="nav-link">FAQ</a>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="boc d-flex align-items-center justify-content-center"
                id="thbtn"
                style={{ width: "38px", height: "38px", padding: 0, borderRadius: "12px" }}
                aria-label="Toggle theme"
                onClick={onToggleTheme}
              >
                <i className="fa-solid fa-sun" id="suni" style={{ display: isDark ? "none" : "" }}></i>
                <i className="fa-solid fa-moon" id="mooni" style={{ display: isDark ? "" : "none" }}></i>
              </button>
              <button
                className="boc px-3 py-2 d-none d-sm-flex align-items-center gap-1"
                onClick={() => onOpenPanel("login")}
              >
                <i className="fa-regular fa-user fa-sm"></i> Log in
              </button>
              <button
                className="bgrd btn px-3 py-2 d-none d-sm-flex align-items-center gap-1"
                onClick={() => onOpenPanel("signup")}
              >
                Register <i className="fa-solid fa-arrow-right fa-sm ms-1"></i>
              </button>
              <button
                className="boc d-lg-none px-2 py-2"
                id="mbtog"
                style={{ borderRadius: "10px" }}
                onClick={toggleMobileMenu}
              >
                <i className="fa-solid fa-bars" id="barIcon" style={{ display: mobileMenuOpen ? "none" : "" }}></i>
                <i className="fa-solid fa-xmark" id="xIcon" style={{ display: mobileMenuOpen ? "" : "none" }}></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div id="mbmenu" className={mobileMenuOpen ? "open" : ""}>
        <a href="#features" className="nav-link d-block py-3 border-bottom" onClick={closeMobileMenu}>Features</a>
        <a href="#languages" className="nav-link d-block py-3 border-bottom" onClick={closeMobileMenu}>Languages</a>
        <a href="#pricing" className="nav-link d-block py-3 border-bottom" onClick={closeMobileMenu}>Pricing</a>
        <a href="#faq" className="nav-link d-block py-3" onClick={closeMobileMenu}>FAQ</a>
        <div className="d-flex gap-2 mt-3">
          <button
            className="boc flex-fill py-2 btn"
            onClick={() => {
              onOpenPanel("login");
              closeMobileMenu();
            }}
          >
            Log in
          </button>
          <button
            className="bgrd flex-fill py-2 btn"
            onClick={() => {
              onOpenPanel("signup");
              closeMobileMenu();
            }}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
