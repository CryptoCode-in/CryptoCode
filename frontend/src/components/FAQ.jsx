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

              {/* FAQ 1 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f1" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f1")}
                  >
                    What is CryptoCode?
                  </button>
                </h2>

                <div
                  id="f1"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f1" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    CryptoCode is a secure online coding platform designed for
                    students and teachers. Students can write, run, save and
                    submit programs, while teachers can monitor submissions and
                    track progress.
                  </div>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f2" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f2")}
                  >
                    Which programming languages are supported?
                  </button>
                </h2>

                <div
                  id="f2"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f2" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    CryptoCode supports C, C++, Java and Python for coding
                    practice and program execution.
                  </div>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f3" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f3")}
                  >
                    Can students run programs online?
                  </button>
                </h2>

                <div
                  id="f3"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f3" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    Yes. Students can write and execute programs directly
                    through the integrated code editor and interactive
                    terminal.
                  </div>
                </div>
              </div>

              {/* FAQ 4 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f4" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f4")}
                  >
                    Can teachers monitor student submissions?
                  </button>
                </h2>

                <div
                  id="f4"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f4" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    Yes. Teachers can view student records, practicals,
                    submissions and progress through the Teacher Dashboard.
                  </div>
                </div>
              </div>

              {/* FAQ 5 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f5" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f5")}
                  >
                    Can students access their previous code?
                  </button>
                </h2>

                <div
                  id="f5"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f5" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    Yes. Students can use the Code History feature to access
                    their saved programs and previous coding work.
                  </div>
                </div>
              </div>

              {/* FAQ 6 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f6" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f6")}
                  >
                    Does CryptoCode have Exam Mode?
                  </button>
                </h2>

                <div
                  id="f6"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f6" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    Exam Mode is planned as a future enhancement of CryptoCode. It will be designed to provide a controlled environment for academic coding examinations, with features such as fullscreen mode, tab-switch detection and monitoring support.
                  </div>
                </div>
              </div>

              {/* FAQ 7 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f7" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f7")}
                  >
                    Can students save their code?
                  </button>
                </h2>

                <div
                  id="f7"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f7" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    Yes. Students can save their programs and manage their
                    coding work through the Code History feature.
                  </div>
                </div>
              </div>

              {/* FAQ 8 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f8" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f8")}
                  >
                    Is CryptoCode designed for academic use?
                  </button>
                </h2>

                <div
                  id="f8"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f8" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    Yes. CryptoCode is designed for programming practicals,
                    assignments, coding practice and examinations in academic
                    environments.
                  </div>
                </div>
              </div>

              {/* FAQ 9 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f9" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f9")}
                  >
                    What can teachers manage from the Teacher Dashboard?
                  </button>
                </h2>

                <div
                  id="f9"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f9" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    Teachers can manage students, practicals, submissions,
                    analytics and their academic profile from the Teacher
                    Dashboard.
                  </div>
                </div>
              </div>

              {/* FAQ 10 */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      activeFaq === "f10" ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => toggleFaq("f10")}
                  >
                    How does CryptoCode help students?
                  </button>
                </h2>

                <div
                  id="f10"
                  className={`accordion-collapse collapse ${
                    activeFaq === "f10" ? "show" : ""
                  }`}
                >
                  <div className="accordion-body">
                    CryptoCode provides a focused environment for coding
                    practice, program execution, interactive input, saving code
                    and submitting practical solutions.
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