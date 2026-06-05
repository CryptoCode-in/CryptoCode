function Pricing({ onOpenPanel }) {
  return (
    <section id="pricing" className="sp position-relative">
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5 rv">
          <span className="slbl">Pricing</span>
          <h2 className="stitle">
            Simple, <span className="gt">transparent pricing</span>
          </h2>
          <p className="ssub mx-auto">Start for free. Scale your institution as needed.</p>
        </div>
        <div className="row g-4 align-items-start rv">
          <div className="col-md-4">
            <div className="pcard h-100">
              <div
                style={{
                  fontSize: ".82rem",
                  fontWeight: 600,
                  color: "var(--tx3)",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  marginBottom: "10px",
                }}
              >
                Student
              </div>
              <div className="pamt mb-1">
                <sup>$</sup>
                <span>0</span>
              </div>
              <div style={{ fontSize: ".82rem", color: "var(--tx3)" }}>free forever</div>
              <p
                style={{
                  fontSize: ".875rem",
                  color: "var(--tx2)",
                  margin: "14px 0 20px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid var(--bd)",
                }}
              >
                Perfect for individual students learning to code.
              </p>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Code Editor Access
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                6 Languages
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Submission History
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Basic AI Suggestions
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Progress Dashboard
              </div>
              <button className="boc btn w-100 py-2 mt-4" onClick={() => onOpenPanel("signup")}>
                Get Started Free
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="pcard pop h-100">
              <span className="pbadge">
                <i className="fa-solid fa-star me-1"></i>Most Popular
              </span>
              <div
                style={{
                  fontSize: ".82rem",
                  fontWeight: 600,
                  color: "var(--tx3)",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  marginBottom: "10px",
                }}
              >
                Institution
              </div>
              <div className="pamt mb-1">
                <sup>$</sup>
                <span>49</span>
              </div>
              <div style={{ fontSize: ".82rem", color: "var(--tx3)" }}>per month</div>
              <p
                style={{
                  fontSize: ".875rem",
                  color: "var(--tx2)",
                  margin: "14px 0 20px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid var(--bd)",
                }}
              >
                For colleges and coding labs with multiple classes.
              </p>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Unlimited Students
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Teacher Dashboard
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Plagiarism Detection
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Advanced AI Analysis
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Priority Support
              </div>
              <button className="bgrd btn w-100 py-2 mt-4" onClick={() => onOpenPanel("signup")}>
                Get Started <i className="fa-solid fa-arrow-right ms-1 fa-sm"></i>
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="pcard h-100">
              <div
                style={{
                  fontSize: ".82rem",
                  fontWeight: 600,
                  color: "var(--tx3)",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  marginBottom: "10px",
                }}
              >
                Enterprise
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "4px", paddingTop: "4px" }}>Custom</div>
              <div style={{ fontSize: ".82rem", color: "var(--tx3)" }}>contact us for pricing</div>
              <p
                style={{
                  fontSize: ".875rem",
                  color: "var(--tx2)",
                  margin: "14px 0 20px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid var(--bd)",
                }}
              >
                For universities and large academic networks.
              </p>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Everything in Institution
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Custom Integrations
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                SSO & LDAP
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                Dedicated Manager
              </div>
              <div className="pfl">
                <span className="pchk">
                  <i className="fa-solid fa-check"></i>
                </span>
                On-premises deployment
              </div>
              <button className="boc btn w-100 py-2 mt-4">Talk to Us</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
