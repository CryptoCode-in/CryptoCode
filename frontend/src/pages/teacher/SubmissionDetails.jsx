import { useState, useEffect } from "react";
import { ArrowLeft, Copy, ClipboardCheck, Code, Info, ShieldAlert, Loader2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import { API_URL, getAuthHeaders } from "../../utils/api";
import { formatSubmissionDate } from "../../utils/dateTime";

function SubmissionDetails({ submissionId, onBack }) {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSubmission = async () => {
      if (!submissionId) {
        setLoading(false);
        setError("No submission specified.");
        return;
      }

      setLoading(true);
      setError("");

      // If submissionId is an object already passed
      if (typeof submissionId === "object" && submissionId !== null) {
        const sub = submissionId;
        const formattedDate = sub.submitted_at
          ? formatSubmissionDate(sub.submitted_at)
          : "—";

        setSubmission({
          id: sub.id,
          studentName: sub.profiles?.name || sub.studentName || "Student",
          studentRoll: sub.profiles?.roll_no
            ? (String(sub.profiles.roll_no).startsWith("CC-ST-") ? sub.profiles.roll_no : `CC-ST-${sub.profiles.roll_no}`)
            : (sub.student_id ? `CC-ST-${sub.student_id}` : (sub.studentRoll || "—")),
          practicalTitle: sub.filename || sub.practicalTitle || "Lab Practical Submission",
          language: sub.language
            ? (sub.language.charAt(0).toUpperCase() + sub.language.slice(1).toLowerCase())
            : "Code",
          status: sub.status || "Saved",
          code: sub.source_code || sub.code || "",
          submittedOn: formattedDate,
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/submissions/${submissionId}`, { headers: getAuthHeaders() });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Session expired or authentication required. Please log in again.");
          } else if (res.status === 403) {
            throw new Error(data.message || "Access denied. Submission belongs to another college.");
          } else if (res.status === 404) {
            throw new Error("Submission not found.");
          } else {
            throw new Error(data.message || "Failed to load submission details.");
          }
        }

        if (data.success && data.submission && isMounted) {
          const sub = data.submission;
          const formattedDate = sub.submitted_at
            ? formatSubmissionDate(sub.submitted_at)
            : "—";

          setSubmission({
            id: sub.id,
            studentName: sub.profiles?.name || "Student",
            studentRoll: sub.profiles?.roll_no
              ? (String(sub.profiles.roll_no).startsWith("CC-ST-") ? sub.profiles.roll_no : `CC-ST-${sub.profiles.roll_no}`)
              : (sub.student_id ? `CC-ST-${sub.student_id}` : "—"),
            practicalTitle: sub.filename || "Lab Practical Submission",
            language: sub.language
              ? (sub.language.charAt(0).toUpperCase() + sub.language.slice(1).toLowerCase())
              : "Code",
            status: sub.status || "Saved",
            code: sub.source_code || "",
            submittedOn: formattedDate,
          });
        } else {
          throw new Error(data.message || "Submission not found.");
        }
      } catch (err) {
        console.error("Failed to fetch submission from backend:", err);
        if (isMounted) {
          setError(err.message || "Failed to load submission details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSubmission();

    return () => {
      isMounted = false;
    };
  }, [submissionId]);

  if (loading) {
    return (
      <TeacherLayout title="Submission Details" description="Loading submission...">
        <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--tx3)" }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
          <div>Loading submission details from database…</div>
        </div>
      </TeacherLayout>
    );
  }

  if (error || !submission) {
    return (
      <TeacherLayout
        title="Submission Details"
        description="Unable to load submission"
        actions={
          <button
            onClick={onBack}
            className="boc d-inline-flex align-items-center gap-2 px-3 py-2"
            style={{ borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        }
      >
        <div
          className="cyber-card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            color: "var(--tx2)",
            borderRadius: "16px",
            background: "var(--sf)",
            border: "1px solid var(--bd)",
            maxWidth: "600px",
            margin: "40px auto",
          }}
        >
          <ShieldAlert size={36} style={{ color: "#ef4444", margin: "0 auto 16px" }} />
          <p style={{ marginBottom: "20px", fontSize: "0.95rem", color: "var(--tx)" }}>
            {error || "Submission record not found."}
          </p>
          <button
            onClick={onBack}
            className="boc px-3 py-2"
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
              background: "var(--pur)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Submissions
          </button>
        </div>
      </TeacherLayout>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(submission.code || "");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusInfo = () => {
    return {
      label: "Saved",
      color: "#34d399", // emerald green
      bg: "rgba(52, 211, 153, 0.12)",
      border: "rgba(52, 211, 153, 0.25)",
    };
  };

  const statusInfo = getStatusInfo(submission.status);

  const infoFields = [
    { label: "Student", value: submission.studentName },
    { label: "Roll No", value: submission.studentRoll, isMono: true },
    { label: "Practical", value: submission.practicalTitle },
    { label: "Language", value: submission.language },
    { label: "Status", isStatus: true },
    { label: "Submitted On", value: submission.submittedOn },
  ];

  return (
    <TeacherLayout
      title="Submission Details"
      description="Inspect student source code and submission details."
      actions={
        <button
          onClick={onBack}
          className="boc d-inline-flex align-items-center gap-2 px-3 py-2"
          style={{ borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
        >
          <ArrowLeft size={14} />
          <span>Back to Submissions</span>
        </button>
      }
    >
      {/* 50-50 Equal Grid Container */}
      <div className="submission-details-grid">
        {/* Left Column: Source Code */}
        <div
          className="cyber-card"
          style={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            borderRadius: "14px",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            background: "var(--sf)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Card Header */}
          <div 
            style={{
              background: "#121214",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "14px 20px",
              minHeight: "56px",
            }}
            className="d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center gap-2">
              <Code size={16} style={{ color: "var(--pur)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>Source Code</span>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "var(--tx3)",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: 500,
                }}
              >
                Read Only
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="boc d-flex align-items-center gap-1.5 px-3 py-1.5"
              style={{
                fontSize: "0.78rem",
                borderRadius: "6px",
                cursor: "pointer",
                color: copiedCode ? "#34d399" : "var(--tx)",
                borderColor: copiedCode ? "rgba(52, 211, 153, 0.4)" : "var(--bd)",
              }}
            >
              {copiedCode ? <ClipboardCheck size={13} style={{ color: "#34d399" }} /> : <Copy size={13} />}
              <span>{copiedCode ? "Copied" : "Copy Code"}</span>
            </button>
          </div>

          {/* Monaco Editor Container */}
          <div style={{ flex: 1, minHeight: "500px", width: "100%", position: "relative" }}>
            <Editor
              height="100%"
              width="100%"
              language={submission.language ? submission.language.toLowerCase() : "c"}
              value={submission.code}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                automaticLayout: true,
                readOnly: true,
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>

        {/* Right Column: Submission Information */}
        <div
          className="cyber-card"
          style={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            borderRadius: "14px",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            background: "var(--sf)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Card Header */}
          <div 
            style={{
              background: "#121214",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "14px 20px",
              minHeight: "56px",
            }}
            className="d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center gap-2">
              <Info size={16} style={{ color: "var(--pur)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>
                Submission Information
              </span>
            </div>
          </div>

          {/* Card Body with Detailed Rows */}
          <div 
            style={{
              flex: 1,
              minHeight: "500px",
              padding: "24px 22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "14px",
              overflowY: "auto",
              width: "100%",
            }}
          >
            {infoFields.map((field) => (
              <div
                key={field.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  padding: "14px 18px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "10px",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--tx3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {field.label}
                </span>

                <div
                  style={{
                    textAlign: "right",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    maxWidth: "70%",
                  }}
                >
                  {field.isStatus ? (
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        padding: "4px 14px",
                        borderRadius: "6px",
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.border}`,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: statusInfo.color,
                        }}
                      />
                      {statusInfo.label}
                    </span>
                  ) : (
                    <strong
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "var(--tx)",
                        fontFamily: field.isMono ? "'JetBrains Mono', monospace" : "inherit",
                      }}
                    >
                      {field.value}
                    </strong>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

export default SubmissionDetails;
