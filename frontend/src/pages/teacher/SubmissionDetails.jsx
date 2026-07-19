import { useState, useEffect } from "react";
import { ArrowLeft, Copy, ClipboardCheck, Terminal, Cpu, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import Editor from "@monaco-editor/react";
import { mockTeacherData } from "../../utils/mockTeacherData";
import TeacherLayout from "../../components/teacher/TeacherLayout";

function SubmissionDetails({ submissionId, onBack }) {
  const [submission, setSubmission] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (submissionId) {
      setSubmission(mockTeacherData.getSubmissionById(submissionId));
    }
  }, [submissionId]);

  if (!submission) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--tx2)" }}>
        Loading submission details...
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(submission.code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "#34d399";
      case "Wrong Answer":
        return "#fbbf24";
      case "Compilation Error":
        return "#f87171";
      default:
        return "#f87171";
    }
  };

  return (
    <TeacherLayout
      title="Submission Details"
      description="Detailed run time execution logs and compiler output."
      actions={
        <button
          onClick={onBack}
          className="boc d-inline-flex align-items-center gap-2 px-3 py-2"
          style={{ borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}
        >
          <ArrowLeft size={14} />
          <span>Back to Submissions</span>
        </button>
      }
    >
      {/* Quick summary strip */}
      <div 
        style={{
          background: "var(--sf)",
          border: "1px solid var(--bd)",
          borderRadius: "10px",
          padding: "12px 18px",
          fontSize: "0.82rem",
          color: "var(--tx2)",
          marginBottom: "24px"
        }}
        className="d-flex align-items-center gap-4 flex-wrap"
      >
        <span>Practical: <strong style={{ color: "#fff" }}>{submission.practicalTitle}</strong></span>
        <span>Language: <strong style={{ color: "#fff" }}>{submission.language}</strong></span>
        <span>
          Status:{" "}
          <strong style={{ color: getStatusColor(submission.status) }}>{submission.status}</strong>
        </span>
        <span>Score: <strong style={{ color: "var(--pur)" }}>{submission.score} / 100</strong></span>
      </div>

      {/* Main Panel Division */}
      <div className="row g-4">
        {/* Left Side: Code Editor */}
        <div className="col-12 col-lg-8">
          <div className="cyber-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div 
              style={{
                background: "#121214",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "12px 18px",
              }}
              className="d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>Source Code</span>
                <span style={{ fontSize: "0.68rem", color: "var(--tx3)", background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: "4px" }}>
                  Read Only
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="boc d-flex align-items-center gap-1.5 px-3 py-1.5"
                style={{ fontSize: "0.75rem", borderRadius: "6px" }}
              >
                {copied ? <ClipboardCheck size={12} style={{ color: "#34d399" }} /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </button>
            </div>

            <div style={{ height: "450px", width: "100%" }}>
              <Editor
                height="100%"
                width="100%"
                language={submission.language.toLowerCase()}
                value={submission.code}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                  automaticLayout: true,
                  readOnly: true,
                  lineNumbers: "on",
                  wordWrap: "on"
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Output and Details */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-4">
            
            {/* Program Output */}
            <div className="cyber-card" style={{ padding: "20px" }}>
              <h5 className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                <Terminal size={14} style={{ color: "var(--pur)" }} />
                <span>Program Output</span>
              </h5>

              <pre
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--bd)",
                  borderRadius: "8px",
                  padding: "14px",
                  fontSize: "0.82rem",
                  color: "#34d399",
                  fontFamily: "'JetBrains Mono', monospace",
                  maxHeight: "150px",
                  overflowY: "auto",
                  margin: 0,
                  whiteSpace: "pre-wrap"
                }}
              >
                {submission.output}
              </pre>
            </div>

            {/* Execution Details Card */}
            <div className="cyber-card" style={{ padding: "20px" }}>
              <h5 className="mb-4 d-flex align-items-center gap-2" style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                <Cpu size={14} style={{ color: "var(--pur)" }} />
                <span>Execution Details</span>
              </h5>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="d-flex align-items-center justify-content-between" style={{ fontSize: "0.82rem", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "10px" }}>
                  <span style={{ color: "var(--tx3)" }}>Time Taken</span>
                  <strong style={{ color: "var(--tx)", fontFamily: "monospace" }}>{submission.timeTaken}</strong>
                </div>
                <div className="d-flex align-items-center justify-content-between" style={{ fontSize: "0.82rem", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "10px" }}>
                  <span style={{ color: "var(--tx3)" }}>Memory Used</span>
                  <strong style={{ color: "var(--tx)", fontFamily: "monospace" }}>{submission.memoryUsed}</strong>
                </div>
                <div className="d-flex align-items-center justify-content-between" style={{ fontSize: "0.82rem", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "10px" }}>
                  <span style={{ color: "var(--tx3)" }}>Submitted On</span>
                  <strong style={{ color: "var(--tx)", fontSize: "0.78rem" }}>{submission.submittedOn}</strong>
                </div>
                <div className="d-flex align-items-center justify-content-between" style={{ fontSize: "0.82rem", paddingBottom: "2px" }}>
                  <span style={{ color: "var(--tx3)" }}>Compiler Sandbox</span>
                  <strong style={{ color: "var(--pur)" }}>{submission.system}</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

export default SubmissionDetails;
