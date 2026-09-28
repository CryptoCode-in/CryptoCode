function Testimonials() {
  return (
    <section id="testimonials" className="sp">
      <div className="container">
        <div className="text-center mb-5 rv">
          <span className="slbl">Feedback</span>
          <h2 className="stitle">
            Loved by <span className="gt">students & teachers</span>
          </h2>
        </div>
        <div className="row g-3">
          <div className="col-md-4 rv">
            <div className="gc p-4 h-100">
              <div className="d-flex gap-1 mb-3">
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
              </div>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)", lineHeight: 1.65, fontStyle: "italic", marginBottom: "18px" }}>
                “CryptoCode provides a focused environment for students to practice programming, run their code and organize their practical work.”
              </p>
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--grad)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: ".9rem",
                    color: "#fff",
                  }}
                >
                  S
                </div>
                <div>
                  <div style={{ fontSize: ".88rem", fontWeight: 600 }}>Sai Navarkar</div>
                  <div style={{ fontSize: ".76rem", color: "var(--tx3)" }}>Student, GP Nashik</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".1s" }}>
            <div className="gc p-4 h-100">
              <div className="d-flex gap-1 mb-3">
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
              </div>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)", lineHeight: 1.65, fontStyle: "italic", marginBottom: "18px" }}>
                “CryptoCode helps teachers manage student programming activities and review practical submissions through a centralized platform.”
              </p>
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f63b8f, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: ".9rem",
                    color: "#fff",
                  }}
                >
                  D
                </div>
                <div>
                  <div style={{ fontSize: ".88rem", fontWeight: 600 }}>Prof. D.N.Bhoye</div>
                  <div style={{ fontSize: ".76rem", color: "var(--tx3)" }}>
                    Faculty, Government Polytechnic Nashik
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 rv" style={{ transitionDelay: ".2s" }}>
            <div className="gc p-4 h-100">
              <div className="d-flex gap-1 mb-3">
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
                <i className="fa-solid fa-star text-warning"></i>
              </div>
              <p style={{ fontSize: ".875rem", color: "var(--tx2)", lineHeight: 1.65, fontStyle: "italic", marginBottom: "18px" }}>
                “CryptoCode provides a simple and focused coding environment for academic practicals. It helps me write programs, test them and submit my work conveniently.”
              </p>
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #34d399, #059669)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: ".9rem",
                    color: "#fff",
                  }}
                >
                  D
                </div>
                <div>
                  <div style={{ fontSize: ".88rem", fontWeight: 600 }}>Devesh Sonawane</div>
                  <div style={{ fontSize: ".76rem", color: "var(--tx3)" }}>
                    Student, GP Nashik
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
