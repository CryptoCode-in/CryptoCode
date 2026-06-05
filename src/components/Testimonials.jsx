function Testimonials() {
  return (
    <section id="testimonials" className="sp">
      <div className="container">
        <div className="text-center mb-5 rv">
          <span className="slbl">Testimonials</span>
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
                "CryptoCode helped me improve my coding skills with instant AI feedback and progress tracking. I can see
                exactly where I need to improve."
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
                  R
                </div>
                <div>
                  <div style={{ fontSize: ".88rem", fontWeight: 600 }}>Rahul Sharma</div>
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
                "CryptoCode makes assignment evaluation and plagiarism detection much easier. I can review all student
                submissions from one dashboard in minutes."
              </p>
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: ".9rem",
                    color: "#fff",
                  }}
                >
                  P
                </div>
                <div>
                  <div style={{ fontSize: ".88rem", fontWeight: 600 }}>Prof. Priya Joshi</div>
                  <div style={{ fontSize: ".76rem", color: "var(--tx3)" }}>
                    Computer Science Teacher, GP Nashik
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
                "A complete coding platform for academic institutions and coding labs. CryptoCode digitized our entire
                practical lab — setup was seamless."
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
                  S
                </div>
                <div>
                  <div style={{ fontSize: ".88rem", fontWeight: 600 }}>Dr. Suresh Patil</div>
                  <div style={{ fontSize: ".76rem", color: "var(--tx3)" }}>
                    HOD, Government Polytechnic Nashik
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
