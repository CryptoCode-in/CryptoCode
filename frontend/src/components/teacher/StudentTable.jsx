function StudentTable({ students = [], onViewProfile }) {
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
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Roll No
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Student Name
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Branch
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Year
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Progress
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Avg Score
              </th>
              <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Last Active
              </th>
              <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: "24px", textAlign: "center", color: "var(--tx3)" }}>
                  No students found matching current filters.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} style={{ borderBottom: "1px solid var(--bd)" }}>
                  <td style={{ padding: "14px 16px", color: "var(--tx2)", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem" }}>
                    {student.rollNo}
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--tx)", fontWeight: 600 }}>
                    {student.name}
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--tx2)", fontSize: "0.85rem" }}>
                    {student.branch}
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--tx2)", fontSize: "0.85rem" }}>
                    {student.year}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "80px", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                        <div style={{ width: `${student.progress}%`, height: "100%", background: "var(--grad)", borderRadius: "100px" }}></div>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "var(--tx)", fontWeight: 600 }}>{student.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--tx)", fontWeight: 700 }}>
                    {student.avgScore}%
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--tx3)", fontSize: "0.82rem" }}>
                    {student.lastActive}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <button
                      onClick={() => {
  console.log("VIEW PROFILE CLICKED STUDENT:", student);
  console.log("VIEW PROFILE STUDENT ID:", student.id);

  if (onViewProfile) {
    onViewProfile(student.id);
  }
}}
                      className="boc"
                      style={{
                        fontSize: "0.78rem",
                        padding: "6px 12px",
                        borderRadius: "8px",
                      }}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;
