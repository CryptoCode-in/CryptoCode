function StudentTable({ students = [], onViewProfile }) {
  const thStyle = {
    padding: "14px 18px",
    textAlign: "left",
    fontSize: "0.75rem",
    color: "var(--tx3)",
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        background: "var(--sf)",
        border: "1px solid var(--bd)",
        borderRadius: "18px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table className="db-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg3)", borderBottom: "1px solid var(--bd)" }}>
              <th style={{ ...thStyle, width: "18%" }}>
                Roll No
              </th>
              <th style={{ ...thStyle, width: "32%" }}>
                Student Name
              </th>
              <th style={{ ...thStyle, width: "24%" }}>
                Branch
              </th>
              <th style={{ ...thStyle, width: "14%" }}>
                Year
              </th>
              <th style={{ ...thStyle, textAlign: "center", width: "12%" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "36px 18px",
                    textAlign: "center",
                    color: "var(--tx3)",
                    fontSize: "0.88rem",
                  }}
                >
                  No students found matching current filters.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} style={{ borderBottom: "1px solid var(--bd)" }}>
                  <td
                    style={{
                      padding: "14px 18px",
                      color: "var(--tx2)",
                      fontWeight: 600,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.82rem",
                    }}
                  >
                    {student.rollNo}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      color: "var(--tx)",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                    }}
                  >
                    {student.name}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      color: "var(--tx2)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {student.branch}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      color: "var(--tx2)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {student.year}
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "center" }}>
                    <button
                      onClick={() => {
                        if (onViewProfile) {
                          onViewProfile(student.id);
                        }
                      }}
                      className="boc"
                      style={{
                        fontSize: "0.78rem",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
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
