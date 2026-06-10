import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Languages from "../components/Languages";
import Security from "../components/Security";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";

function Landing({ isDark, onToggleTheme, onLoginSuccess }) {
  const [authModalOpen, setAuthModalOpen] = useState(null); // null, 'login', 'signup'

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 60);
            obs.unobserve(e.target);r
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".rv");
    elements.forEach((el) => obs.observe(el));

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
      <Navbar isDark={isDark} onToggleTheme={onToggleTheme} onOpenPanel={openPanel} />
      <Hero onOpenPanel={openPanel} />
      <Problem />
      <Features />
      <HowItWorks />
      <Languages />
      <Security />
      <Pricing onOpenPanel={openPanel} />
      <Testimonials />
      <FAQ />
      <FinalCTA onOpenPanel={openPanel} />
      <Footer />
      <LoginModal
        isOpen={authModalOpen !== null}
        initialTab={authModalOpen}
        onClose={closePanel}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
}

export default Landing;