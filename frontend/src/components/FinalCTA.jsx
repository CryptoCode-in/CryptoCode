function FinalCTA({ onOpenPanel }) {
  return (
    <section id="cta">
      <div className="aur aur-a" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}></div>
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="rv">
          <span className="hbadge mb-4 d-inline-flex">
            <span className="bdot"></span>Free for Students — No Credit Card Required
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              fontWeight: 700,
              letterSpacing: "-.025em",
              lineHeight: 1.1,
              margin: "16px 0 18px",
            }}
          >
            Ready to Start <span className="gt">Coding?</span>
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--tx2)", maxWidth: "500px", margin: "0 auto 36px" }}>
            Join CryptoCode and experience secure online coding with AI-powered learning, plagiarism detection and
            progress tracking.
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
            <button className="bgrd btn px-4 py-3 fs-6" onClick={() => onOpenPanel("signup")}>
              <i className="fa-solid fa-play me-2"></i>Start Coding Now
            </button>
            <button className="boc btn px-4 py-3 fs-6">
              <i className="fa-regular fa-comment-dots me-2"></i>Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
