import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Eye,
  ArrowLeft,
  Calendar,
  Code,
  FileCode,
  CheckCircle2,
  Clock,
  RotateCw,
  Search,
  ShieldAlert,
  Loader2,
  Terminal,
} from "lucide-react";
import TeacherLayout from "../../components/teacher/TeacherLayout";

// Helper for formatting timestamps cleanly from database ISO strings
function formatSubmissionDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  } else if (diffDays < 7) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

// Helper for badge colors based on language
function getLanguageBadgeStyle(lang) {
  const l = (lang || "").toLowerCase();
  switch (l) {
    case "python":
      return { bg: "rgba(59, 130, 246, 0.12)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.25)" };
    case "java":
      return { bg: "rgba(245, 158, 11, 0.12)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.25)" };
    case "cpp":
    case "c++":
      return { bg: "rgba(139, 92, 246, 0.12)", color: "#a78bfa", border: "rgba(139, 92, 246, 0.25)" };
    case "c":
      return { bg: "rgba(6, 182, 212, 0.12)", color: "#22d3ee", border: "rgba(6, 182, 212, 0.25)" };
    default:
      return { bg: "rgba(255, 255, 255, 0.08)", color: "var(--tx2)", border: "var(--bd)" };
  }
}

// Helper for status badge styling
function getStatusBadgeStyle(status) {
  const s = (status || "").toLowerCase();
  if (s === "accepted" || s === "success" || s === "passed") {
    return { bg: "rgba(52, 211, 153, 0.12)", color: "#34d399", border: "rgba(52, 211, 153, 0.25)" };
  } else if (s === "saved") {
    return { bg: "rgba(59, 130, 246, 0.12)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.25)" };
  } else if (s === "wrong answer" || s === "failed") {
    return { bg: "rgba(245, 158, 11, 0.12)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.25)" };
  } else {
    return { bg: "rgba(239, 68, 68, 0.12)", color: "#f87171", border: "rgba(239, 68, 68, 0.25)" };
  }
}

function Submissions({
  onViewSubmissionDetails,
  navbarSearchQuery = "",
  currentUser,
  selectedStudentId,
  onSelectStudent,
}) {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [selectedStudentState, setSelectedStudentState] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");

  // Sync selectedStudentState with props if provided
  const activeSelectedStudentId = selectedStudentId !== undefined ? selectedStudentId : selectedStudentState;

  // 1. Fetch real submissions from database
  const fetchRealSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/submissions");
      if (!res.ok) {
        throw new Error("Unable to load submissions from database.");
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.submissions)) {
        setAllSubmissions(data.submissions);
      } else {
        setAllSubmissions([]);
      }
    } catch (err) {
      console.error("Submissions fetch error:", err);
      setError("Unable to load submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealSubmissions();
  }, []);

  // 2. Group submissions by unique student database ID
  const groupedStudents = useMemo(() => {
    const map = {};

    allSubmissions.forEach((sub) => {
      // Group key based on database student_id or profiles.id
      const studentKey = sub.student_id || sub.profiles?.id || sub.profiles?.user_id || "unknown";

      if (!map[studentKey]) {
        const studentName = sub.profiles?.name || "Student";
        const initial = studentName.trim() ? studentName.trim()[0].toUpperCase() : "S";

        map[studentKey] = {
          studentId: studentKey,
          numericId: sub.student_id || sub.profiles?.id,
          userId: sub.profiles?.user_id,
          studentName,
          studentRoll: sub.profiles?.roll_no ? `CC-ST-${sub.profiles.roll_no}` : (sub.student_id ? `CC-ST-${sub.student_id}` : ""),
          studentEmail: sub.profiles?.email || "",
          studentBranch: sub.profiles?.branch || "",
          studentYear: sub.profiles?.year || "",
          initial,
          latestSubmittedAt: sub.submitted_at,
          latestTimestamp: sub.submitted_at ? new Date(sub.submitted_at).getTime() : 0,
          submissions: [],
        };
      }

      // Check if this submission is newer than recorded latest
      const thisTime = sub.submitted_at ? new Date(sub.submitted_at).getTime() : 0;
      if (thisTime > map[studentKey].latestTimestamp) {
        map[studentKey].latestTimestamp = thisTime;
        map[studentKey].latestSubmittedAt = sub.submitted_at;
      }

      map[studentKey].submissions.push(sub);
    });

    // Sort submissions within each student by latest first
    Object.values(map).forEach((st) => {
      st.submissions.sort((a, b) => {
        const ta = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
        const tb = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
        return tb - ta;
      });
    });

    // Return array of students sorted by their latest submission timestamp descending
    return Object.values(map).sort((a, b) => b.latestTimestamp - a.latestTimestamp);
  }, [allSubmissions]);

  // Determine active selected student object
  const currentSelectedStudent = useMemo(() => {
    if (!activeSelectedStudentId) return null;
    return (
      groupedStudents.find(
        (s) =>
          String(s.studentId) === String(activeSelectedStudentId) ||
          String(s.numericId) === String(activeSelectedStudentId) ||
          (s.userId && String(s.userId) === String(activeSelectedStudentId))
      ) || null
    );
  }, [groupedStudents, activeSelectedStudentId]);

  // Set selected student
  const handleSelectStudent = (studentId) => {
    setSelectedLanguage("All Languages");
    if (onSelectStudent) {
      onSelectStudent(studentId);
    } else {
      setSelectedStudentState(studentId);
    }
  };

  // Back to main students table
  const handleBackToAllStudents = () => {
    setSelectedLanguage("All Languages");
    if (onSelectStudent) {
      onSelectStudent(null);
    } else {
      setSelectedStudentState(null);
    }
  };

  // Filter student submissions by selectedLanguage
  const filteredStudentSubmissions = useMemo(() => {
    if (!currentSelectedStudent || !Array.isArray(currentSelectedStudent.submissions)) return [];
    if (selectedLanguage === "All Languages" || !selectedLanguage) {
      return currentSelectedStudent.submissions;
    }
    const target = selectedLanguage.toLowerCase().trim();
    return currentSelectedStudent.submissions.filter((sub) => {
      const l = (sub.language || "").toLowerCase().trim();
      if (target === "c") {
        return l === "c";
      }
      if (target === "c++" || target === "cpp") {
        return l === "cpp" || l === "c++";
      }
      if (target === "java") {
        return l === "java";
      }
      if (target === "python") {
        return l === "python";
      }
      return l === target;
    });
  }, [currentSelectedStudent, selectedLanguage]);

  // 3. Search query filtering
  const activeSearch = navbarSearchQuery || localSearch;
  const filteredStudents = useMemo(() => {
    if (!activeSearch.trim()) return groupedStudents;
    const query = activeSearch.toLowerCase().trim();

    return groupedStudents.filter(
      (st) =>
        st.studentName.toLowerCase().includes(query) ||
        st.studentRoll.toLowerCase().includes(query) ||
        st.studentEmail.toLowerCase().includes(query)
    );
  }, [groupedStudents, activeSearch]);

  return (
    <TeacherLayout
      title={
        currentSelectedStudent
          ? currentSelectedStudent.studentName
          : "Code Submissions"
      }
      description={
        currentSelectedStudent
          ? `All saved and submitted codes for ${currentSelectedStudent.studentName}.`
          : "Student-centric code submission records and compiler review."
      }
      actions={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {currentSelectedStudent ? (
            <button
              type="button"
              onClick={handleBackToAllStudents}
              className="boc d-inline-flex align-items-center gap-2 px-3 py-2"
              style={{
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 600,
                background: "var(--bg3)",
                border: "1px solid var(--bd)",
                color: "var(--tx)",
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to All Students</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={fetchRealSubmissions}
              disabled={loading}
              className="boc d-inline-flex align-items-center gap-2 px-3 py-2"
              style={{
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 600,
                background: "var(--bg3)",
                border: "1px solid var(--bd)",
                color: "var(--tx)",
              }}
              title="Refresh submissions from database"
            >
              <RotateCw size={14} className={loading ? "spin-loader" : ""} />
              <span>Refresh</span>
            </button>
          )}
        </div>
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .submissions-card-container {
              background: var(--sf);
              border: 1px solid var(--bd);
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
              width: 100%;
            }
            .sub-table {
              width: 100%;
              border-collapse: collapse;
              text-align: left;
            }
            .sub-table th {
              background: var(--bg3);
              padding: 16px 20px;
              font-size: 0.76rem;
              text-transform: uppercase;
              font-weight: 700;
              color: var(--tx3);
              letter-spacing: 0.05em;
              border-bottom: 1px solid var(--bd);
            }
            .sub-table td {
              padding: 16px 20px;
              border-bottom: 1px solid var(--bd);
              vertical-align: middle;
            }
            .sub-table tr:last-child td {
              border-bottom: none;
            }
            .sub-table tbody tr {
              transition: background 0.15s ease;
            }
            .sub-table tbody tr:hover {
              background: rgba(139, 92, 246, 0.03);
            }
            .sub-view-btn {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 7px 16px;
              border-radius: 8px;
              font-size: 0.8rem;
              font-weight: 600;
              background: var(--bg3);
              border: 1px solid var(--bd);
              color: var(--tx);
              cursor: pointer;
              transition: all 0.2s;
            }
            .sub-view-btn:hover {
              border-color: var(--pur);
              color: var(--pur);
              transform: translateY(-1px);
            }
            .sub-view-code-btn {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 7px 14px;
              border-radius: 8px;
              font-size: 0.78rem;
              font-weight: 600;
              background: rgba(139, 92, 246, 0.1);
              border: 1px solid rgba(139, 92, 246, 0.25);
              color: var(--pur);
              cursor: pointer;
              transition: all 0.2s;
            }
            .sub-view-code-btn:hover {
              background: var(--pur);
              color: #fff;
              border-color: var(--pur);
              transform: translateY(-1px);
            }
            @keyframes spinAnimation {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .spin-loader {
              animation: spinAnimation 1s linear infinite;
            }
          `,
        }}
      />

      {/* =====================================================================
          VIEW MODE 1: STUDENT-SPECIFIC SUBMISSION LIST
          Shown when teacher clicks [View] for a student
      ====================================================================== */}
      {currentSelectedStudent ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Student Profile Quick Banner */}
          <div
            style={{
              background: "var(--sf)",
              border: "1px solid var(--bd)",
              borderRadius: "18px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "var(--grad)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.25)",
                  flexShrink: 0,
                }}
              >
                {currentSelectedStudent.initial}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
                    {currentSelectedStudent.studentName}
                  </h4>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "6px",
                      background: "rgba(139, 92, 246, 0.1)",
                      color: "var(--pur)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    {currentSelectedStudent.submissions.length} Total Saved / Submitted Codes
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", fontSize: "0.78rem", color: "var(--tx3)" }}>
                  {currentSelectedStudent.studentRoll && <span>Roll: <strong style={{ color: "var(--tx2)" }}>{currentSelectedStudent.studentRoll}</strong></span>}
                  {currentSelectedStudent.studentEmail && <span>Email: <strong style={{ color: "var(--tx2)" }}>{currentSelectedStudent.studentEmail}</strong></span>}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBackToAllStudents}
              className="sub-view-btn"
            >
              <ArrowLeft size={14} />
              <span>Back to Students List</span>
            </button>
          </div>

          {/* Submissions Filter Toolbar */}
          <div
            style={{
              background: "var(--sf)",
              border: "1px solid var(--bd)",
              borderRadius: "14px",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <label
                htmlFor="submission-language-filter"
                style={{
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  color: "var(--tx)",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Code size={15} style={{ color: "var(--pur)" }} />
                <span>Filter by Language:</span>
              </label>
              <div style={{ position: "relative", display: "inline-block" }}>
                <select
                  id="submission-language-filter"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{
                    background: "var(--bg3)",
                    color: "var(--tx)",
                    border: "1px solid var(--bd)",
                    borderRadius: "8px",
                    padding: "7px 32px 7px 12px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                >
                  <option value="All Languages">All Languages</option>
                  <option value="C">C</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    fontSize: "0.65rem",
                    color: "var(--tx3)",
                  }}
                >
                  ▼
                </span>
              </div>
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--tx3)" }}>
              Showing <strong style={{ color: "var(--tx)" }}>{filteredStudentSubmissions.length}</strong> of{" "}
              <strong style={{ color: "var(--tx)" }}>{currentSelectedStudent.submissions.length}</strong> submissions
            </div>
          </div>

          {/* Student Submissions List Table */}
          <div className="submissions-card-container">
            <div style={{ overflowX: "auto" }}>
              <table className="sub-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px", textAlign: "center" }}>#</th>
                    <th>Practical / Assignment</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Submitted At</th>
                    <th style={{ textAlign: "center", width: "140px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSelectedStudent.submissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--tx3)" }}>
                        No saved or submitted codes recorded for this student.
                      </td>
                    </tr>
                  ) : filteredStudentSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", color: "var(--tx3)" }}>
                          <Code size={28} style={{ opacity: 0.35 }} />
                          <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--tx2)" }}>
                            No {selectedLanguage} submissions found for this student.
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedLanguage("All Languages")}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--pur)",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              textDecoration: "underline",
                              marginTop: "2px",
                            }}
                          >
                            Show all submissions
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudentSubmissions.map((sub, idx) => {
                      const langStyle = getLanguageBadgeStyle(sub.language);
                      const statusStyle = getStatusBadgeStyle(sub.status);

                      return (
                        <tr key={sub.id}>
                          {/* Row Number */}
                          <td style={{ textAlign: "center", color: "var(--tx3)", fontSize: "0.82rem", fontWeight: 600 }}>
                            {idx + 1}
                          </td>

                          {/* Practical / Assignment Name */}
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "8px",
                                  background: "rgba(139, 92, 246, 0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "var(--pur)",
                                  flexShrink: 0,
                                }}
                              >
                                <FileCode size={16} />
                              </div>
                              <div>
                                <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.88rem", display: "block" }}>
                                  {sub.filename || `Lab Practical Assignment #${sub.id}`}
                                </span>
                                <span style={{ fontSize: "0.72rem", color: "var(--tx3)" }}>
                                  ID: CC-SUB-{sub.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Language */}
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "0.74rem",
                                fontWeight: 600,
                                fontFamily: "'JetBrains Mono', monospace",
                                background: langStyle.bg,
                                color: langStyle.color,
                                border: `1px solid ${langStyle.border}`,
                                textTransform: "uppercase",
                              }}
                            >
                              {sub.language || "code"}
                            </span>
                          </td>

                          {/* Status */}
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "0.74rem",
                                fontWeight: 600,
                                background: statusStyle.bg,
                                color: statusStyle.color,
                                border: `1px solid ${statusStyle.border}`,
                                textTransform: "capitalize",
                              }}
                            >
                              {sub.status || "Saved"}
                            </span>
                          </td>

                          {/* Submitted At */}
                          <td style={{ fontSize: "0.82rem", color: "var(--tx2)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Clock size={13} style={{ color: "var(--tx3)" }} />
                              <span>{formatSubmissionDate(sub.submitted_at)}</span>
                            </div>
                          </td>

                          {/* Action - View Code */}
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => {
                                if (onViewSubmissionDetails) {
                                  onViewSubmissionDetails(sub.id);
                                }
                              }}
                              className="sub-view-code-btn"
                              title="Inspect student source code"
                            >
                              <Code size={13} />
                              <span>View Code</span>
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
        </div>
      ) : (
        /* =====================================================================
            VIEW MODE 2: MAIN UNIQUE STUDENT TABLE (EXACTLY 3 COLUMNS)
            1. STUDENT
            2. SUBMITTED ON
            3. VIEW
        ====================================================================== */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Submissions Container Card */}
          <div className="submissions-card-container">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 20px",
                  color: "var(--tx3)",
                  gap: "12px",
                  fontSize: "0.9rem",
                }}
              >
                <Loader2 size={18} className="spin-loader" />
                <span>Loading submissions from database...</span>
              </div>
            ) : error ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#f87171",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <ShieldAlert size={24} />
                <span style={{ fontSize: "0.9rem" }}>{error}</span>
                <button
                  type="button"
                  onClick={fetchRealSubmissions}
                  className="sub-view-btn"
                  style={{ marginTop: "8px" }}
                >
                  <RotateCw size={13} />
                  <span>Retry</span>
                </button>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="sub-table">
                  {/* EXACTLY 3 COLUMNS REQUIRED */}
                  <thead>
                    <tr>
                      <th style={{ width: "45%" }}>Student</th>
                      <th style={{ width: "35%" }}>Submitted On</th>
                      <th style={{ width: "20%", textAlign: "center" }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ padding: "48px 20px", textAlign: "center", color: "var(--tx3)" }}>
                          {activeSearch
                            ? `No students found matching "${activeSearch}".`
                            : "No submissions found."}
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.studentId}>
                          {/* 1. STUDENT COLUMN */}
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                              <div
                                style={{
                                  width: "42px",
                                  height: "42px",
                                  borderRadius: "50%",
                                  background: "var(--grad)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "1.1rem",
                                  fontWeight: 700,
                                  color: "#fff",
                                  flexShrink: 0,
                                  boxShadow: "0 2px 8px rgba(139, 92, 246, 0.2)",
                                }}
                              >
                                {student.initial}
                              </div>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                  <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.92rem" }}>
                                    {student.studentName}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.7rem",
                                      fontWeight: 600,
                                      padding: "2px 8px",
                                      borderRadius: "6px",
                                      background: "rgba(139, 92, 246, 0.08)",
                                      color: "var(--pur)",
                                      border: "1px solid rgba(139, 92, 246, 0.15)",
                                    }}
                                  >
                                    {student.submissions.length} {student.submissions.length === 1 ? "code" : "codes"}
                                  </span>
                                </div>
                                <div style={{ fontSize: "0.74rem", color: "var(--tx3)", marginTop: "2px" }}>
                                  {student.studentRoll ? student.studentRoll : (student.studentEmail || "Student")}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. SUBMITTED ON COLUMN */}
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--tx2)", fontSize: "0.85rem" }}>
                              <Calendar size={14} style={{ color: "var(--tx3)", flexShrink: 0 }} />
                              <span style={{ fontWeight: 500 }}>
                                {formatSubmissionDate(student.latestSubmittedAt)}
                              </span>
                            </div>
                          </td>

                          {/* 3. VIEW COLUMN */}
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleSelectStudent(student.studentId)}
                              className="sub-view-btn"
                              title={`View all submissions for ${student.studentName}`}
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}

export default Submissions;
