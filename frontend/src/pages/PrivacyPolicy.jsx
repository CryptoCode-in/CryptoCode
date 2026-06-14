import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal";

function PrivacyPolicy({ isDark, onToggleTheme, onLoginSuccess }) {
  const [authModalOpen, setAuthModalOpen] = useState(null);
  const [activeDocSection, setActiveDocSection] = useState("collection");

  const openPanel = (tab) => {
    setAuthModalOpen(tab);
  };

  const closePanel = () => {
    setAuthModalOpen(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const sections = [
      "collection",
      "accounts",
      "submissions",
      "analytics",
      "services",
      "opt-out",
      "retention",
      "children",
      "security-doc",
      "changes",
      "consent",
      "contact-doc",
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -50% 0px", // triggers when section is near the middle-upper part of screen
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveDocSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleSidebarClick = (id) => {
    setActiveDocSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // offset for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Sidebar navigation links array
  const sidebarLinks = [
    { id: "collection", label: "Information Collection" },
    { id: "accounts", label: "User Accounts" },
    { id: "submissions", label: "Code Submissions" },
    { id: "analytics", label: "Analytics" },
    { id: "services", label: "Third-Party Services" },
    { id: "opt-out", label: "Opt-Out Rights" },
    { id: "retention", label: "Data Retention" },
    { id: "children", label: "Children's Privacy" },
    { id: "security-doc", label: "Security" },
    { id: "changes", label: "Policy Changes" },
    { id: "consent", label: "Your Consent" },
    { id: "contact-doc", label: "Contact Us" },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--tx)" }}>
      {/* Global Navbar */}
      <Navbar isDark={isDark} onToggleTheme={onToggleTheme} onOpenPanel={openPanel} />

      {/* Main Privacy Policy Page Wrapper */}
      <section className="sp" style={{ paddingTop: "140px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>
        <div className="aur aur-a" style={{ top: "-100px", left: "-100px", opacity: 0.2 }}></div>
        <div className="aur aur-b" style={{ top: "100px", right: "-150px", opacity: 0.15 }}></div>
        
        <div className="container">
          {/* Centered Hero Header */}
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="slbl">Legal Document</span>
            <h1 className="mt-2 mb-3">
              Privacy <span className="gt">Policy</span>
            </h1>
          <p
                className="ssub mx-auto text-center"
                style={{
                          maxWidth: "700px",
                          textAlign: "center",
                          marginLeft: "auto",
                          marginRight: "auto"
                        }}
          >
            Your trust matters. This policy explains how CryptoCode collects, uses,
            stores, and protects your information when you use our secure online
            coding platform.
          </p>
          </motion.div>

          {/* Metadata Info Cards */}
          <div className="row g-4 justify-content-center mb-4"
          style={{ marginBottom: "1rem" }}>
            <div className="col-lg-4 col-md-6 col-12">
              <motion.div 
                className="gc p-4 text-center h-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>📅</div>
                <div style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--tx3)", fontWeight: 700 }}>Last Updated</div>
                <div className="fw-semibold mt-1" style={{ color: "var(--tx)" }}>June 2026</div>
              </motion.div>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <motion.div 
                className="gc p-4 text-center h-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>🛡️</div>
                <div style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--tx3)", fontWeight: 700 }}>Service Provider</div>
                <div className="fw-semibold mt-1" style={{ color: "var(--tx)" }}>CryptoCode</div>
              </motion.div>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <motion.div 
                className="gc p-4 text-center h-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "px" }}>💻</div>
                <div style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--tx3)", fontWeight: 700 }}>Applies To</div>
                <div className="fw-semibold mt-1" style={{ color: "var(--tx)" }}>CryptoCode Web Platform</div>
              </motion.div>
            </div>
          </div>

          {/* Introduction Card */}
          <div className="row mb-5">
            <div className="col-12">
              <motion.div 
                className="gc p-4 p-md-5 text-start d-flex align-items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ borderLeft: "4px solid var(--pur)", background: "rgba(19, 19, 30, 0.45)" }}
              >
                <p style={{ color: "var(--tx2)", fontSize: "1.02rem", lineHeight: 1.7, margin: 0 }}>
                  📄 This Privacy Policy applies to the CryptoCode platform (hereby referred to as the <strong>"Platform"</strong>), created and maintained by CryptoCode (hereby referred to as the <strong>"Service Provider"</strong>). This service is provided on an "AS IS" basis.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Main Legal Content Block */}
          <div className="row g-5">
            {/* Left Sidebar Table of Contents */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="privacy-sidebar">
                <h5 className="mb-3 text-start" style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--tx3)", fontWeight: 800, letterSpacing: "0.08em" }}>
                  Contents
                </h5>
                <nav className="d-flex flex-column">
                  {sidebarLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleSidebarClick(link.id)}
                      className={`sidebar-link text-start ${activeDocSection === link.id ? "active" : ""}`}
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Side Content Areas */}
            <div className="col-lg-9 col-12">
              
              {/* Section 01: Information Collection */}
              <motion.div 
                id="collection" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>🤖</span>
                  <h3 className="fs-5 fw-bold m-0">01. Information Collection and Use</h3>
                </div>
                <p className="mb-4" style={{ color: "var(--tx2)", fontSize: "0.95rem" }}>
                  CryptoCode collects information necessary to provide coding, assignment management, evaluation, progress tracking, and educational services. The information collected is used solely to operate, maintain, secure, and improve the Platform.
                </p>
                <h4 className="fs-6 fw-semibold mb-3" style={{ color: "var(--pur)" }}>A. Information Collected Automatically:</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>🌐 IP Address</div>
                      <p style={{ fontSize: "0.82rem", color: "var(--tx2)", margin: 0 }}>Used for security monitoring, abuse prevention, login protection, and general analytics.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>📊 Usage Analytics</div>
                      <p style={{ fontSize: "0.82rem", color: "var(--tx2)", margin: 0 }}>Pages visited, features used, login timestamps, and session activity indicators.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>💻 Browser Info</div>
                      <p style={{ fontSize: "0.82rem", color: "var(--tx2)", margin: 0 }}>Browser version, operating system version, device types, and diagnostics.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>🔍 Performance Logs</div>
                      <p style={{ fontSize: "0.82rem", color: "var(--tx2)", margin: 0 }}>Error reports and platform stability indices to optimize user workflows.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section 02: User Accounts */}
              <motion.div 
                id="accounts" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>👥</span>
                  <h3 className="fs-5 fw-bold m-0">02. User Account Information</h3>
                </div>
                <p className="mb-4" style={{ color: "var(--tx2)", fontSize: "0.95rem" }}>
                  Information collected during student/teacher account registration is required to identify platform participants, deliver personalized coursework, and manage authentication safely.
                </p>
                <div className="row g-3">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>🧑 Full Name</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>Used for identification, rosters, and profile tracking.</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>📧 Email Address</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>Used for login authentication, notification alerts, and recovery.</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>🔐 Password</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>Encrypted securely (salted and hashed) — never stored as plain text.</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>🎓 Roll Number</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>Matches assignments and student identifiers correctly.</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>🏫 Institute Name</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>Enables institution-scoped classroom sandboxes.</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>📚 Course Details</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>Scopes assigned tasks, templates, and language compilers.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section 03: Code Submissions */}
              <motion.div 
                id="submissions" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>💻</span>
                  <h3 className="fs-5 fw-bold m-0">03. Code Submissions and Coding Activity</h3>
                </div>
                <p className="mb-4" style={{ color: "var(--tx2)", fontSize: "0.95rem" }}>
                  CryptoCode is a cloud compiler platform. All student codes submitted are processed to assess accuracy, run diagnostic tests, and compile reports.
                </p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>💻 Source Code</div>
                      <p style={{ fontSize: "0.82rem", color: "var(--tx2)", margin: 0 }}>User codes submitted for evaluation. Ownership remains 100% with the student author.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>📈 Progress Records</div>
                      <p style={{ fontSize: "0.82rem", color: "var(--tx2)", margin: 0 }}>Evaluation scores, completion rates, levels, streaks, and solve logs.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>📝 Submission History</div>
                      <p style={{ fontSize: "0.82rem", color: "var(--tx2)", margin: 0 }}>Compiler tags, execution times, language runtimes, and scores.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>⚡ Execution Logs</div>
                      <p style={{ fontSize: "0.82rem", color: "var(--tx2)", margin: 0 }}>StdOut records, diagnostics, compiler syntax warnings, and debugger outputs.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section 04: Analytics */}
              <motion.div 
                id="analytics" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>📊</span>
                  <h3 className="fs-5 fw-bold m-0">04. Analytics and Platform Improvement</h3>
                </div>
                <p className="mb-3" style={{ color: "var(--tx2)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  CryptoCode may analyze aggregated, non-identifying platform data to evaluate usage patterns. We do this to achieve the following performance milestones:
                </p>
                <ul style={{ color: "var(--tx2)", fontSize: "0.95rem", paddingLeft: "20px", lineHeight: 1.8 }}>
                  <li><strong>Platform Optimization:</strong> Optimizing sandbox resources and compiler caching.</li>
                  <li><strong>Performance Improvements:</strong> Speeding up runtime evaluations.</li>
                  <li><strong>Security Monitoring:</strong> Scanning for script injections or server breaches.</li>
                  <li><strong>Fraud Prevention:</strong> Powering plagiarism evaluation pipelines.</li>
                </ul>
              </motion.div>

              {/* Section 05: Third-Party Services */}
              <motion.div 
                id="services" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>🔗</span>
                  <h3 className="fs-5 fw-bold m-0">05. Third-Party Services</h3>
                </div>
                <p className="mb-3" style={{ color: "var(--tx2)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  We work with trusted partners to host, database, and authenticate sessions. These service providers only process the minimum metadata required to fulfill tasks:
                </p>
                <div className="row g-3">
                  <div className="col-md-6 col-12"><div className="doc-card py-3 text-center" style={{ fontSize: "0.88rem" }}>☁️ Cloud Hosting Infrastructure</div></div>
                  <div className="col-md-6 col-12"><div className="doc-card py-3 text-center" style={{ fontSize: "0.88rem" }}>🔐 Authentication Handlers</div></div>
                  <div className="col-md-6 col-12"><div className="doc-card py-3 text-center" style={{ fontSize: "0.88rem" }}>🗄️ Managed Databases</div></div>
                  <div className="col-md-6 col-12"><div className="doc-card py-3 text-center" style={{ fontSize: "0.88rem" }}>📊 Diagnostics Providers</div></div>
                </div>
              </motion.div>

              {/* Section 06: Opt-Out Rights */}
              <motion.div 
                id="opt-out" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>🚫</span>
                  <h3 className="fs-5 fw-bold m-0">06. Opt-Out Rights</h3>
                </div>
                <p style={{ color: "var(--tx2)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                  You have full rights over your profile data. You may request account deletion, opt out of newsletter alerts, or demand full records removal by emailing support. Please note that academic records or institutional coursework logs assigned by teachers may require direct school administrative approvals before purging.
                </p>
              </motion.div>

              {/* Section 07: Data Retention */}
              <motion.div 
                id="retention" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>🗄️</span>
                  <h3 className="fs-5 fw-bold m-0">07. Data Retention Policy</h3>
                </div>
                <p style={{ color: "var(--tx2)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                  We retain account parameters while your student/classroom subscription remains active. If your account goes inactive or is deleted, profile attributes are purged within 30 days. Active assignments, codes, or grades may remain indexed inside school folders for reporting purposes.
                </p>
              </motion.div>

              {/* Section 08: Children's Privacy */}
              <motion.div 
                id="children" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>👶</span>
                  <h3 className="fs-5 fw-bold m-0">08. Children's Privacy</h3>
                </div>
                <p style={{ color: "var(--tx2)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                  CryptoCode operates primarily as a classroom lab aid. If you are under the legal age of consent in your region, platform onboarding must be performed under the supervision of a parent, legal guardian, or registered teacher/institution.
                </p>
              </motion.div>

              {/* Section 09: Security */}
              <motion.div 
                id="security-doc" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>🔒</span>
                  <h3 className="fs-5 fw-bold m-0">09. Security Measures</h3>
                </div>
                <p className="mb-4" style={{ color: "var(--tx2)", fontSize: "0.95rem" }}>
                  We adopt state-of-the-art security controls to guarantee safe execution of student submissions:
                </p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>🔒 Encrypted Auth</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>Credentials, details, and databases use AES-256 standard encryption keys.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>🛡️ Access Controls</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>Strict role-based permissions separating teachers, student dashboards, and admins.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>💻 Sandbox Isolation</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>All compilers execute in locked sandbox runtimes lacking server filesystem access.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="doc-card">
                      <div className="fw-semibold mb-1" style={{ color: "var(--tx)" }}>📡 Secure Transmission</div>
                      <p style={{ fontSize: "0.8rem", color: "var(--tx2)", margin: 0 }}>All sessions, code logs, and grades transit over encrypted HTTPS protocols.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section 10: Policy Changes */}
              <motion.div 
                id="changes" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>📝</span>
                  <h3 className="fs-5 fw-bold m-0">10. Changes to This Privacy Policy</h3>
                </div>
                <p style={{ color: "var(--tx2)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                  We may update this legal document to reflect adjustments in infrastructure, features, or legislation. Any modifications will be indicated by updating the "Last Updated" date at the top. Continual usage of our tools indicates your agreement to changes.
                </p>
              </motion.div>

              {/* Section 11: Consent */}
              <motion.div 
                id="consent" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>✅</span>
                  <h3 className="fs-5 fw-bold m-0">11. Your Consent</h3>
                </div>
                <p style={{ color: "var(--tx2)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                  By onboarding your account, creating workspaces, submitting compilers, and using CryptoCode tools, you declare that you have read this document and fully consent to data protocols defined herein.
                </p>
              </motion.div>

              {/* Section 12: Contact Us */}
              <motion.div 
                id="contact-doc" 
                className="doc-section text-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                style={{ borderBottom: "4px solid var(--pur)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "1.5rem" }}>📧</span>
                  <h3 className="fs-5 fw-bold m-0">12. Contact Us</h3>
                </div>
                <p className="mb-3" style={{ color: "var(--tx2)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  Have questions, concerns, or requests regarding this Privacy Policy or data protection? Please email our dedicated data team, and we will get back to you as soon as possible.
                </p>
                <div className="doc-card d-inline-flex align-items-center gap-2 py-3 px-4">
                  <i className="fa-regular fa-envelope" style={{ color: "var(--pur)" }}></i>
                  <a href="mailto:cryptocode.official@gmail.com" style={{ color: "var(--tx)", fontWeight: 600 }}>cryptocode.official@gmail.com</a>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="py-4 text-center" style={{ borderTop: "2px solid var(--bd)", background: "rgba(10, 10, 15, 0.4)" }}>
        <div className="container" style={{ fontSize: "0.82rem", color: "var(--tx3)" }} style={{ marginTop: "1rem" }} style={{ marginBottom: "1rem" }}>
          © {new Date().getFullYear()} CryptoCode. All rights reserved.
        </div>
      </footer>

      {/* Reusable Login/Signup Modal (Passed directly without changing modal code) */}
      <LoginModal
        isOpen={authModalOpen !== null}
        initialTab={authModalOpen}
        onClose={closePanel}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
}

export default PrivacyPolicy;
