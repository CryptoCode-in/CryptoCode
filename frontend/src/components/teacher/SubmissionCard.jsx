import { CheckCircle2, ShieldAlert, Clock, Eye } from "lucide-react";

// Columns shown in StudentProfile (simplified): Practical/Assignment | Language | Status | View
// Columns shown in Submissions page (full): Student | Practical/Assignment | Language | Status | Score | Submitted On | View
function SubmissionCard({
  submissions = [],
  onViewDetails,
  showStudentInfo = true,
  simplified = false, // when true: hide Score and Submitted On columns
}) {
  const getBadgeStyle = (status) => {
    const s = String(status || "").toLowerCase().trim();

    // Accepted / Passed / Success -> Vibrant emerald green
    if (s === "accepted" || s === "passed" || s === "success") {
      return {
        bg: "rgba(52, 211, 153, 0.12)",
        color: "#34d399",
        border: "1px solid rgba(52, 211, 153, 0.25)",
        icon: CheckCircle2,
      };
    }

    // Saved / Draft -> Subtle soft green success badge (never red / alert style)
    if (s === "saved" || s === "draft") {
      return {
        bg: "rgba(16, 185, 129, 0.12)",
        color: "#10b981",
        border: "1px solid rgba(16, 185, 129, 0.25)",
        icon: CheckCircle2,
      };
    }

    // Submitted / Pending / In Review -> Soft blue
    if (s === "submitted" || s === "pending" || s === "in review") {
      return {
        bg: "rgba(59, 130, 246, 0.12)",
        color: "#60a5fa",
        border: "1px solid rgba(59, 130, 246, 0.25)",
        icon: Clock,
      };
    }

    // Wrong Answer -> Amber / Yellow warning
    if (s === "wrong answer" || s === "wrong_answer") {
      return {
        bg: "rgba(245, 158, 11, 0.12)",
        color: "#fbbf24",
        border: "1px solid rgba(245, 158, 11, 0.25)",
        icon: ShieldAlert,
      };
    }

    // Compilation Error / Failed / Rejected -> Soft Red
    return {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#f87171",
      border: "1px solid rgba(239, 68, 68, 0.25)",
      icon: ShieldAlert,
    };
  };

  // Column count for the empty-state colspan
  let colCount = 4; // Practical/Assignment, Language, Status, View
  if (showStudentInfo) colCount++;
  if (!simplified) colCount += 2; // Score, Submitted On

  const thStyle = {
    padding: "14px 18px",
    textAlign: "left",
    fontSize: "0.72rem",
    color: "var(--tx3)",
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        background: "var(--sf)",
        border: "1px solid var(--bd)",
        borderRadius: "14px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table
          className="db-table"
          style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}
        >
          <thead>
            <tr
              style={{
                background: "var(--bg3)",
                borderBottom: "1px solid var(--bd)",
              }}
            >
              {showStudentInfo && (
                <th style={thStyle}>Student</th>
              )}
              <th style={{ ...thStyle, width: simplified ? "50%" : undefined }}>
                Practical / Assignment
              </th>
              <th style={{ ...thStyle, width: simplified ? "20%" : undefined }}>
                Language
              </th>
              <th style={{ ...thStyle, width: simplified ? "20%" : undefined }}>
                Status
              </th>
              {!simplified && (
                <>
                  <th style={thStyle}>Score</th>
                  <th style={thStyle}>Submitted On</th>
                </>
              )}
              <th
                style={{
                  ...thStyle,
                  textAlign: "center",
                  width: simplified ? "10%" : undefined,
                }}
              >
                View
              </th>
            </tr>
          </thead>

          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td
                  colSpan={colCount}
                  style={{
                    padding: "44px 20px",
                    textAlign: "center",
                    color: "var(--tx3)",
                    fontSize: "0.85rem",
                  }}
                >
                  No submissions recorded.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => {
                const badge = getBadgeStyle(sub.status);
                const BadgeIcon = badge.icon;

                return (
                  <tr
                    key={sub.id}
                    style={{ borderBottom: "1px solid var(--bd)" }}
                  >
                    {showStudentInfo && (
                      <td style={{ padding: "14px 18px" }}>
                        <div
                          style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.85rem" }}
                        >
                          {sub.studentName}
                        </div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--tx3)",
                            fontFamily: "monospace",
                          }}
                        >
                          {sub.studentRoll}
                        </div>
                      </td>
                    )}

                    {/* Practical/Assignment */}
                    <td
                      style={{
                        padding: "14px 18px",
                        color: "var(--tx)",
                        fontWeight: 500,
                        fontSize: "0.85rem",
                      }}
                      title={sub.practicalTitle}
                    >
                      {sub.practicalTitle}
                    </td>

                    {/* Language */}
                    <td
                      style={{
                        padding: "14px 18px",
                        color: "var(--tx2)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.82rem",
                      }}
                    >
                      {sub.language}
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: "14px 18px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "100px",
                          background: badge.bg,
                          color: badge.color,
                          border: badge.border,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <BadgeIcon size={12} />
                        {sub.status}
                      </span>
                    </td>

                    {/* Score + Submitted On (only in non-simplified mode) */}
                    {!simplified && (
                      <>
                        <td
                          style={{
                            padding: "14px 18px",
                            color: "var(--tx2)",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                          }}
                        >
                          {sub.score}/100
                        </td>
                        <td
                          style={{
                            padding: "14px 18px",
                            color: "var(--tx3)",
                            fontSize: "0.82rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {sub.submittedOn}
                        </td>
                      </>
                    )}

                    {/* View button */}
                    <td style={{ padding: "14px 18px", textAlign: "center" }}>
                      <button
                        onClick={() => onViewDetails && onViewDetails(sub.id)}
                        className="boc"
                        style={{
                          width: "32px",
                          height: "32px",
                          padding: 0,
                          borderRadius: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="View Code & Execution Output"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubmissionCard;
