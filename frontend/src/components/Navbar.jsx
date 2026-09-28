import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logob from "../assets/images/logob.png";
import logow from "../assets/images/logow.png";

function Navbar({ onOpenPanel }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();
  const isPrivacyPage = location.pathname === "/privacy-policy" || location.pathname === "/policy";
  const isFaqPage = location.pathname === "/faq";
  const isContactPage = location.pathname === "/contact";
  const isSubPage = isPrivacyPage || isFaqPage || isContactPage;

  useEffect(() => {
    if (isSubPage) return;

    const sections = ["hero", "problem", "features", "languages", "security"];
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // triggers when section occupies the middle 20% of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScrollFallback = () => {
      if (window.scrollY < 50) {
        setActiveSection("hero");
      }
    };
    window.addEventListener("scroll", handleScrollFallback);

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      window.removeEventListener("scroll", handleScrollFallback);
    };
  }, [location.pathname, isSubPage]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav id="landing-nbar" className="landing-navbar-pill">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100">
            <a
              href="/#hero"
              className="d-flex align-items-center gap-2"
              style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--tx)", textDecoration: "none" }}
            >
              <img src={logob} style={{ height: "46px", width: "auto" }} alt="Logo Dark" />
              <img src={logow} style={{ height: "40px", width: "auto" }} alt="Logo Light" />
              <span></span>
            </a>
            <div className="d-none d-lg-flex align-items-center gap-1 ms-auto me-auto">
              <a href="/#hero" className={`nav-link ${!isSubPage && activeSection === "hero" ? "active" : ""}`}>Home</a>
              
              <a href="/#features" className={`nav-link ${!isSubPage && activeSection === "features" ? "active" : ""}`}>Features</a>
              <a href="/#languages" className={`nav-link ${!isSubPage && activeSection === "languages" ? "active" : ""}`}>Languages</a>
              <a href="/#security" className={`nav-link ${!isSubPage && activeSection === "security" ? "active" : ""}`}>Security</a>
              <Link to="/faq" className={`nav-link ${isFaqPage ? "active" : ""}`}>FAQ</Link>
              <Link to="/contact" className={`nav-link ${isContactPage ? "active" : ""}`}>Contact Us</Link>
              <Link to="/privacy-policy" className={`nav-link ${isPrivacyPage ? "active" : ""}`}>Policy</Link>
            </div>
            <div className="d-flex align-items-center gap-2">
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
        <a href="/#hero" className={`nav-link d-block py-3 border-bottom ${!isSubPage && activeSection === "hero" ? "active" : ""}`} onClick={closeMobileMenu}>Home</a>
        <a href="/#problem" className={`nav-link d-block py-3 border-bottom ${!isSubPage && activeSection === "problem" ? "active" : ""}`} onClick={closeMobileMenu}>Problem</a>
        <a href="/#features" className={`nav-link d-block py-3 border-bottom ${!isSubPage && activeSection === "features" ? "active" : ""}`} onClick={closeMobileMenu}>Features</a>
        <a href="/#languages" className={`nav-link d-block py-3 border-bottom ${!isSubPage && activeSection === "languages" ? "active" : ""}`} onClick={closeMobileMenu}>Languages</a>
        <a href="/#security" className={`nav-link d-block py-3 border-bottom ${!isSubPage && activeSection === "security" ? "active" : ""}`} onClick={closeMobileMenu}>Security</a>
        <Link to="/faq" className={`nav-link d-block py-3 border-bottom ${isFaqPage ? "active" : ""}`} onClick={closeMobileMenu}>FAQ</Link>
        <Link to="/contact" className={`nav-link d-block py-3 border-bottom ${isContactPage ? "active" : ""}`} onClick={closeMobileMenu}>Contact Us</Link>
        <Link to="/privacy-policy" className={`nav-link d-block py-3 ${isPrivacyPage ? "active" : ""}`} onClick={closeMobileMenu}>Privacy Policy</Link>
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
