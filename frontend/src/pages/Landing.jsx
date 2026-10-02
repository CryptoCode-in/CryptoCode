import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Languages from "../components/Languages";
import Security from "../components/Security";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";
import AdminLoginModal from "../components/AdminLoginModal";

function Landing({ onLoginSuccess }) {
  const [authModalOpen, setAuthModalOpen] = useState(null); // null, 'login', 'signup'
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".rv");
    elements.forEach((el) => obs.observe(el));

    // Support URL param trigger if logo 5-click occurred on another page
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1" || params.get("admin") === "true") {
      setAdminModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => {
      elements.forEach((el) => obs.unobserve(el));
    };
  }, []);

  const openPanel = (tab) => {
    setAuthModalOpen(tab);
  };

  const closePanel = () => {
    setAuthModalOpen(null);
  };

  return (
    <div id="landing">
      <Navbar
        onOpenPanel={openPanel}
        onOpenAdminLogin={() => setAdminModalOpen(true)}
      />
      <Hero onOpenPanel={openPanel} />
      <Problem />
      <Features />
      <HowItWorks />
      <Languages />
      <Security />
      <Testimonials />
      <Footer />
      <LoginModal
        isOpen={authModalOpen !== null}
        initialTab={authModalOpen}
        onClose={closePanel}
        onLoginSuccess={onLoginSuccess}
      />
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
}

export default Landing;