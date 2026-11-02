import { CheckCircle2, ShieldAlert, Clock, Eye } from "lucide-react";

// Columns shown in StudentProfile: Practical/Assignment | Language | Status | Submitted On | View
// Columns shown in Submissions page: Student | Practical/Assignment | Language | Status | Submitted On | View
function SubmissionCard({
  submissions = [],
  onViewDetails,
  showStudentInfo = true,
  simplified = false, // when true: hide Submitted On column
  showScore = false, // Score column removed from Student Profile as per requirements
}) {
  const getBadgeStyle = () => {
    return {
      bg: "rgba(52, 211, 153, 0.12)",
      color: "#34d399",
      border: "1px solid rgba(52, 211, 153, 0.25)",
      icon: CheckCircle2,
    };
  };

  // Column count for the empty-state colspan
  let colCount = 4; // Practical/Assignment, Language, Status, View
  if (showStudentInfo) colCount++;
  if (showScore) colCount++;
  if (!simplified) colCount++; // Submitted On

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
              <th style={{ ...thStyle, width: simplified ? "50%" : undefined, minWidth: !simplified ? "200px" : undefined }}>
                Practical / Assignment
              </th>
              <th style={{ ...thStyle, width: simplified ? "20%" : "120px" }}>
                Language
              </th>
              <th style={{ ...thStyle, width: simplified ? "20%" : "120px" }}>
                Status
              </th>
              {showScore && (
                <th style={{ ...thStyle, width: "100px" }}>Score</th>
              )}
              {!simplified && (
                <th style={{ ...thStyle, width: "160px" }}>Submitted On</th>
              )}
              <th
                style={{
                  ...thStyle,
                  textAlign: "center",
                  width: simplified ? "10%" : "90px",
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
                const badge = getBadgeStyle(sub.rawStatus || sub.status);
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
                        Saved
                      </span>
                    </td>

                    {/* Score (optional, hidden by default) */}
                    {showScore && (
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
                    )}

                    {/* Submitted On (only in non-simplified mode) */}
                    {!simplified && (
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
