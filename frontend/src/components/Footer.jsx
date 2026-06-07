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
              <div >
                <img src="src/assets/images/logob.png" width="55" height="55" />
              </div>
              <img src="src/assets/images/logow.png" width="200" height="200" />
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
            <h5>Developed By 🧑‍💻</h5>
            <a href="https://www.linkedin.com/in/devesh-sonawane-4b7965366/">Devesh Sonawane</a>
            <a href="https://www.linkedin.com/in/ninad-bhad-b8118b327/">Ninad Bhad</a>
            <a href="https://www.linkedin.com/in/ritesh-borse-20b513371/">Ritesh Borse</a>
            <a href="https://www.linkedin.com/in/devesh-koshti-720611395/">Devesh Koshti</a>
            <a href="https://www.linkedin.com/in/sai-navarkar-0a7991336/">Sai Navarkar</a>
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
            © 2026 CryptoCode — Secure Online Coding Platform for Students and Teachers
            <br />
            <span style={{ color: "var(--tx3)" }}>Government Polytechnic Nashik</span>
          </p>
          <div className="d-flex gap-2">
            <a href="https://github.com/teamcryptocode" className="sico">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/company/cryptocode-in/" className="sico">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>

            <a href="https://www.instagram.com/cryptocode.in?igsh=MWlmem9ndDU5YWF5Zg==" className="sico">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
