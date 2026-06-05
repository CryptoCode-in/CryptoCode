import { useState } from "react";

function FAQ() {
  const [activeFaq, setActiveFaq] = useState("f1");

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <section id="faq" className="sp" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div className="text-center mb-5 rv">
          <span className="slbl">FAQ</span>
          <h2 className="stitle">
            Common <span className="gt">questions</span>
          </h2>
        </div>
        <div className="row justify-content-center rv">
          <div className="col-lg-8">
            <div className="accordion acco" id="faqAcc">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeFaq === "f1" ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => toggleFaq("f1")}
                  >
                    Which programming languages are supported?
                  </button>
                </h2>
                <div id="f1" className={`accordion-collapse collapse ${activeFaq === "f1" ? "show" : ""}`}>
                  <div className="accordion-body">
                    CryptoCode supports C, C++, Java, Python, JavaScript and PHP — all major languages taught in
                    polytechnic and computer science curricula.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeFaq === "f2" ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => toggleFaq("f2")}
                  >
                    Can teachers monitor student submissions?
                  </button>
                </h2>
                <div id="f2" className={`accordion-collapse collapse ${activeFaq === "f2" ? "show" : ""}`}>
                  <div className="accordion-body">
                    Yes. The teacher dashboard gives full visibility into all student submissions, execution results,
                    assignment progress and analytics across the entire class.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeFaq === "f3" ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => toggleFaq("f3")}
                  >
                    Does CryptoCode detect plagiarism?
                  </button>
                </h2>
                <div id="f3" className={`accordion-collapse collapse ${activeFaq === "f3" ? "show" : ""}`}>
                  <div className="accordion-body">
                    Yes. The platform includes built-in automated plagiarism detection that compares all submissions
                    and highlights similar code pairs with similarity scores for teacher review.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeFaq === "f4" ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => toggleFaq("f4")}
                  >
                    Can students access their coding history?
                  </button>
                </h2>
                <div id="f4" className={`accordion-collapse collapse ${activeFaq === "f4" ? "show" : ""}`}>
                  <div className="accordion-body">
                    Yes. Students can view all previous code submissions, execution logs, AI feedback history and
                    progress charts from their personal dashboard at any time.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${activeFaq === "f5" ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => toggleFaq("f5")}
                  >
                    Is there a free plan for students?
                  </button>
                </h2>
                <div id="f5" className={`accordion-collapse collapse ${activeFaq === "f5" ? "show" : ""}`}>
                  <div className="accordion-body">
                    Yes. The Student plan is completely free and includes full code editor access, all 6 languages,
                    submission history and basic AI suggestions — no credit card required.
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

export default FAQ;
