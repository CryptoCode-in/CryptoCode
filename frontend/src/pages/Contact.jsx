import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ContactComponent from "../components/Contact";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";

function Contact({ onLoginSuccess }) {
  const [authModalOpen, setAuthModalOpen] = useState(null);

  const openPanel = (tab) => {
    setAuthModalOpen(tab);
  };

  const closePanel = () => {
    setAuthModalOpen(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

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

    return () => {
      elements.forEach((el) => obs.unobserve(el));
    };
  }, []);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--tx)", display: "flex", flexDirection: "column" }}>
      {/* Global Navbar */}
      <Navbar onOpenPanel={openPanel} />

      {/* Standalone Contact Us Content */}
      <main style={{ flex: 1, paddingTop: "70px" }}>
        <ContactComponent />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Reusable Login/Signup Modal */}
      <LoginModal
        isOpen={authModalOpen !== null}
        initialTab={authModalOpen}
        onClose={closePanel}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
}

export default Contact;
