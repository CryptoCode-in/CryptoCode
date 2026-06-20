import { useState } from "react";
import { motion } from "framer-motion";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: "error", message: "Please fill out all fields." });
      return;
    }
    setStatus({
      type: "success",
      message: `Thank you, ${formData.name}! Your message has been sent successfully.`,
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus({ type: "", message: "" }), 5000);
  };

  return (
    <section id="contact" className="sp" style={{ background: "var(--bg)", position: "relative" }}>
      {/* Background Orbs for professional visual polish */}
      <div className="aur aur-a" style={{ top: "10%", left: "-150px", opacity: 0.25 }}></div>
      <div className="aur aur-b" style={{ bottom: "10%", right: "-150px", opacity: 0.2 }}></div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        {/* Section Header */}
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="slbl">GET IN TOUCH</span>
          <h2 className="stitle">
            Have Questions? <span className="gt">Let's Talk</span>
          </h2>
          <p className="ssub mx-auto text-center"
                style={{
                          maxWidth: "700px",
                          textAlign: "center",
                          marginLeft: "auto",
                          marginRight: "auto"
                        }}>
            We would love to hear your feedback, questions, suggestions and partnership inquiries.
          </p>
        </motion.div>

        {/* Section Content */}
        <div className="row g-4 justify-content-center">
          {/* Left Side: Contact Form */}
          <motion.div 
            className="col-lg-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="contact-form-card">
              <form onSubmit={handleSubmit}>
                {status.message && (
                  <div
                    className="mb-4 p-3"
                    style={{
                      borderRadius: "10px",
                      background: status.type === "success" ? "rgba(52, 211, 153, 0.15)" : "rgba(239, 68, 68, 0.15)",
                      border: `1px solid ${status.type === "success" ? "rgba(52, 211, 153, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                      color: status.type === "success" ? "#34d399" : "#f87171",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    {status.message}
                  </div>
                )}
                
                <div className="row g-3">
                  <div className="col-md-6 text-start">
                    <div className="d-flex flex-column gap-2">
                      <label htmlFor="name" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--tx2)" }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="contact-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 text-start">
                    <div className="d-flex flex-column gap-2">
                      <label htmlFor="email" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--tx2)" }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="user@example.com"
                        className="contact-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2 mt-3 text-start">
                  <label htmlFor="subject" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--tx2)" }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Feedback, Issue Report, Inquiry..."
                    className="contact-input"
                    required
                  />
                </div>

                <div className="d-flex flex-column gap-2 mt-3 text-start">
                  <label htmlFor="message" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--tx2)" }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hi, I would like to get in touch with..."
                    className="contact-input"
                    style={{ resize: "none" }}
                    required
                  ></textarea>
                </div>

                <div className="mt-4 text-start">
                  <button type="submit" className="bgrd btn px-4 py-3 w-100 fs-6 justify-content-center">
                    <i className="fa-regular fa-paper-plane me-2"></i>Send Message
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right Side: Contact Info Cards */}
          <motion.div 
            className="col-lg-4 d-flex flex-column gap-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            {/* Card 1: Email Support */}
            <div className="info-card">
              <div className="info-icon">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div className="info-content text-start">
                <h4>Email Support</h4>
                <p className="mb-2">For general support and updates regarding accounts.</p>
                <a href="mailto:cryptocode.official@gmail.com">cryptocode.official@gmail.com</a>
              </div>
            </div>

            {/* Card 2: Technical Help */}
            <div className="info-card">
              <div className="info-icon">
                <i className="fa-solid fa-headset"></i>
              </div>
              <div className="info-content text-start">
                <h4>Technical Help</h4>
                <p className="mb-2">Facing platform errors or code evaluation issues?</p>
                <a href="mailto:help.cryptocode@gmail.com">help.cryptocode@gmail.com</a>
              </div>
            </div>

            {/* Card 3: LinkedIn */}
            <div className="info-card">
              <div className="info-icon">
                <i className="fa-brands fa-linkedin"></i>
              </div>
              <div className="info-content text-start">
                <h4>LinkedIn</h4>
                <p className="mb-2">Join our LinkedIn official Profile.</p>
                <a
  href="#"
  onClick={() => window.open("https://www.linkedin.com/company/cryptocode-in/", "_blank")}
>
  Join LinkedIn
</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
