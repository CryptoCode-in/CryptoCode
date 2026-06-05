function Footer() {
  return (
    <footer id="foot">
      <div className="container">
        <div className="row g-5 mb-5">
          <div style={{ flex: 1, minWidth: "220px", padding: "12px" }}>
            <a
              className="d-flex align-items-center gap-2 mb-3"
              href="#"
              style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--tx)" }}
            >
              <div className="logo-i">
                <i className="fa-solid fa-code"></i>
              </div>
              CryptoCode
            </a>
            <p style={{ fontSize: ".875rem", color: "var(--tx3)", lineHeight: 1.65, maxWidth: "280px" }}>
              Secure Online Coding Platform for Students and Teachers.
            </p>
            <div className="d-flex gap-2 mt-3">
              <input className="nli" type="email" placeholder="your@email.com" style={{ maxWidth: "200px" }} />
              <button className="bgrd btn px-3 py-2" style={{ fontSize: ".85rem", whiteSpace: "nowrap" }}>
                Subscribe
              </button>
            </div>
          </div>
          <div className="col-6 col-md-2 fcol">
            <h5>Platform</h5>
            <a href="#features">Features</a>
            <a href="#languages">Languages</a>
            <a href="#security">Security</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="col-6 col-md-2 fcol">
            <h5>Resources</h5>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Student Guide</a>
            <a href="#">Teacher Guide</a>
            <a href="#">Community</a>
          </div>
          <div className="col-6 col-md-2 fcol">
            <h5>Project</h5>
            <a href="#">About</a>
            <a href="#">Team</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div
          className="d-flex align-items-center justify-content-between flex-wrap gap-3 pt-4"
          style={{ borderTop: "1px solid var(--bd)" }}
        >
          <p style={{ fontSize: ".8rem", color: "var(--tx3)", margin: 0 }}>
            © 2026 CryptoCode — Final Year Capstone Project
            <br />
            <span style={{ color: "var(--tx3)" }}>Government Polytechnic Nashik</span>
          </p>
          <div className="d-flex gap-2">
            <a href="#" className="sico">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="sico">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="#" className="sico">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" className="sico">
              <i className="fa-regular fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
