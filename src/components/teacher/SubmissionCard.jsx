import { CheckCircle2, ShieldAlert, Hourglass, Eye } from "lucide-react";

function SubmissionCard({ submissions = [], onViewDetails, showStudentInfo = true }) {
  const getBadgeStyle = (status) => {
    switch (status) {
      case "Accepted":
        return {
          bg: "rgba(52,211,153,.1)",
          color: "#34d399",
          border: "1px solid rgba(52,211,153,.2)",
          icon: CheckCircle2
        };
      case "Wrong Answer":
        return {
          bg: "rgba(245,158,11,.1)",
          color: "#fbbf24",
          border: "1px solid rgba(245,158,11,.2)",
          icon: ShieldAlert
        };
      case "Compilation Error":
        return {
          bg: "rgba(239,68,68,.1)",
          color: "#f87171",
          border: "1px solid rgba(239,68,68,.2)",
          icon: ShieldAlert
        };
      default:
        return {
          bg: "rgba(239,68,68,.1)",
          color: "#f87171",
          border: "1px solid rgba(239,68,68,.2)",
          icon: ShieldAlert
        };
    }
  };

  return (
    <div
      style={{
        background: "var(--sf)",
        border: "1px solid var(--bd)",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table className="db-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg3)", borderBottom: "1px solid var(--bd)" }}>
              {showStudentInfo && (
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                  Student
                </th>
              )}
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Practical/Assignment
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Language
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Status
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Score
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Submitted On
              </th>
              <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={showStudentInfo ? 7 : 6} style={{ padding: "24px", textAlign: "center", color: "var(--tx3)" }}>
                  No submissions recorded.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => {
                const badge = getBadgeStyle(sub.status);
                const BadgeIcon = badge.icon;
                
                return (
                  <tr key={sub.id} style={{ borderBottom: "1px solid var(--bd)" }}>
                    {showStudentInfo && (
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, color: "var(--tx)" }}>{sub.studentName}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--tx3)", fontFamily: "monospace" }}>{sub.studentRoll}</div>
                      </td>
                    )}
                    <td style={{ padding: "14px 16px", color: "var(--tx)", fontWeight: 500 }}>
                      {sub.practicalTitle}
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--tx2)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem" }}>
                      {sub.language}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        className="bst"
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
                          border: badge.border
                        }}
                      >
                        <BadgeIcon size={12} />
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--tx2)", fontWeight: 700 }}>
                      {sub.score}/100
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--tx3)", fontSize: "0.82rem" }}>
                      {sub.submittedOn}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
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
                          justifyContent: "center"
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
