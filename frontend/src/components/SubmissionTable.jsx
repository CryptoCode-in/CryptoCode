import { ShieldAlert, CheckCircle2, Hourglass } from "lucide-react";

const mockSubmissions = [
  {
    id: 1,
    name: "Linked List Reversal",
    lang: "C++",
    status: "Accepted",
    score: "100/100",
    date: "Jun 09, 2026",
  },
  {
    id: 2,
    name: "Binary Tree DFS Traversals",
    lang: "Java",
    status: "Accepted",
    score: "95/100",
    date: "Jun 07, 2026",
  },
  {
    id: 3,
    name: "Bubble Sort Implementation",
    lang: "Python",
    status: "Pending",
    score: "--/100",
    date: "Jun 10, 2026",
  },
  {
    id: 4,
    name: "Regex Parser for Compilers",
    lang: "C",
    status: "Rejected",
    score: "40/100",
    date: "Jun 03, 2026",
  },
  {
    id: 5,
    name: "Dynamic Array Structs",
    lang: "C++",
    status: "Accepted",
    score: "100/100",
    date: "May 28, 2026",
  },
];

function SubmissionTable() {
  return (
    <div id="submissions-section" style={{ marginBottom: "32px" }}>
      <div className="mb-3">
        <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
          Recent Submissions
        </h4>
        <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: 0 }}>
          History of assignments submitted and evaluated.
        </p>
      </div>

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
                <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                  Problem Name
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
                  Submission Date
                </th>
              </tr>
            </thead>
            <tbody>
              {mockSubmissions.map((sub) => {
                let badgeStyle = {};
                let BadgeIcon = Hourglass;

                if (sub.status === "Accepted") {
                  badgeStyle = { background: "rgba(52,211,153,.1)", color: "#34d399", border: "1px solid rgba(52,211,153,.2)" };
                  BadgeIcon = CheckCircle2;
                } else if (sub.status === "Pending") {
                  badgeStyle = { background: "rgba(245,158,11,.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,.2)" };
                  BadgeIcon = Hourglass;
                } else {
                  badgeStyle = { background: "rgba(239,68,68,.1)", color: "#f87171", border: "1px solid rgba(239,68,68,.2)" };
                  BadgeIcon = ShieldAlert;
                }

                return (
                  <tr key={sub.id} style={{ borderBottom: "1px solid var(--bd)" }}>
                    <td style={{ padding: "14px 16px", color: "var(--tx)", fontWeight: 600 }}>
                      {sub.name}
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--tx2)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem" }}>
                      {sub.lang}
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
                          ...badgeStyle,
                        }}
                      >
                        <BadgeIcon size={12} />
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--tx2)", fontWeight: 600 }}>
                      {sub.score}
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--tx3)", fontSize: "0.82rem" }}>
                      {sub.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SubmissionTable;
