import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Users,
  Code,
  FileCode,
  Clock,
  RotateCw,
  ShieldAlert,
  Loader2,
  Eye,
  Search,
  Bell,
} from "lucide-react";
import { API_URL } from "../../utils/api";
import { formatSubmissionDate, parseUtcDate } from "../../utils/dateTime";
import TeacherLayout from "../../components/teacher/TeacherLayout";

// ─── Constants ────────────────────────────────────────────────────────────────

const YEARS = [
  { value: "First Year",  label: "First Year",  short: "1st" },
  { value: "Second Year", label: "Second Year", short: "2nd" },
  { value: "Third Year",  label: "Third Year",  short: "3rd" },
];

const BRANCHES = [
  { value: "Computer Technology",    label: "Computer Technology",    code: "CM" },
  { value: "Information Technology", label: "Information Technology", code: "IF" },
];

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeYear(v) {
  if (!v && v !== 0) return "";
  const s = String(v).trim().toLowerCase();
  if (!s) return "";
  if (s === "1" || s.includes("first")  || s.includes("1st")) return "First Year";
  if (s === "2" || s.includes("second") || s.includes("2nd")) return "Second Year";
  if (s === "3" || s.includes("third")  || s.includes("3rd")) return "Third Year";
  return "__UNKNOWN__";
}

function formatYearDisplay(yearVal) {
  const norm = normalizeYear(yearVal);
  if (norm && norm !== "__UNKNOWN__") return norm;
  return yearVal ? String(yearVal) : "N/A";
}

function normalizeBranch(v) {
  if (!v) return "";
  const s = String(v).trim().toLowerCase();
  if (!s) return "";
  if (s.includes("computer") || s === "ct" || s === "co" || s === "cm") return "Computer Technology";
  if (s.includes("information") || s === "it" || s === "if")             return "Information Technology";
  return "__UNKNOWN__";
}

function formatBranchDisplay(branchVal) {
  const norm = normalizeBranch(branchVal);
  if (norm && norm !== "__UNKNOWN__") return norm;
  return branchVal ? String(branchVal) : "N/A";
}

// ─── Badge helpers ───────────────────────────────────────────────────────────

function langStyle(lang) {
  switch ((lang || "").toLowerCase()) {
    case "python": return { bg: "rgba(59,130,246,.12)",   color: "#60a5fa", border: "rgba(59,130,246,.25)" };
    case "java":   return { bg: "rgba(245,158,11,.12)",   color: "#fbbf24", border: "rgba(245,158,11,.25)" };
    case "cpp":
    case "c++":    return { bg: "rgba(139,92,246,.12)",   color: "#a78bfa", border: "rgba(139,92,246,.25)" };
    case "c":      return { bg: "rgba(6,182,212,.12)",    color: "#22d3ee", border: "rgba(6,182,212,.25)"  };
    default:       return { bg: "rgba(255,255,255,.08)",  color: "var(--tx2)", border: "var(--bd)" };
  }
}

function statusStyle(status) {
  const s = (status || "").toLowerCase();
  if (["accepted", "success", "passed"].includes(s))
    return { bg: "rgba(52,211,153,.12)", color: "#34d399", border: "rgba(52,211,153,.25)" };
  if (s === "saved")
    return { bg: "rgba(59,130,246,.12)", color: "#60a5fa", border: "rgba(59,130,246,.25)" };
  if (["wrong answer", "failed"].includes(s))
    return { bg: "rgba(245,158,11,.12)", color: "#fbbf24", border: "rgba(245,158,11,.25)" };
  return { bg: "rgba(239,68,68,.12)", color: "#f87171", border: "rgba(239,68,68,.25)" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Year / Branch selection card */
function SelectionCard({ label, sublabel, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "22px 24px",
        background: "var(--bg2)",
        border: "1px solid var(--bd)",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        gap: "12px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,92,246,0.12)";
        e.currentTarget.style.background = "rgba(139,92,246,0.07)";
        e.currentTarget.style.borderColor = "var(--bd2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = "var(--bg2)";
        e.currentTarget.style.borderColor = "var(--bd)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "rgba(139,92,246,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {badge ? (
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--pur)", fontFamily: "monospace" }}>
              {badge}
            </span>
          ) : (
            <Users size={20} style={{ color: "var(--pur)" }} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--tx)", marginBottom: "4px" }}>
            {label}
          </div>
          {sublabel && (
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--tx3)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {sublabel}
            </div>
          )}
        </div>
      </div>
      <ChevronRight size={20} style={{ color: "var(--tx3)", flexShrink: 0, marginLeft: "8px" }} />
    </button>
  );
}

/** Breadcrumb + Back navigation button */
function Breadcrumb({ selectedYear, selectedBranch, selectedStudent, onBackToYear, onBackToBranch, onBackToStudents }) {
  const getBackAction = () => {
    if (selectedStudent) return onBackToStudents;
    if (selectedBranch) return onBackToBranch;
    return onBackToYear;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
      <button
        onClick={getBackAction()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "1px solid var(--bd2)",
          background: "transparent",
          color: "var(--tx2)",
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(139,92,246,0.08)";
          e.currentTarget.style.color = "var(--tx)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--tx2)";
        }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--tx3)" }}>
        <span
          style={{
            color: selectedBranch ? "var(--tx3)" : "var(--pur)",
            fontWeight: selectedBranch ? 500 : 700,
            cursor: selectedBranch ? "pointer" : "default",
          }}
          onClick={selectedBranch ? onBackToBranch : undefined}
        >
          {selectedYear}
        </span>

        {selectedBranch && (
          <>
            <ChevronRight size={13} />
            <span
              style={{
                color: selectedStudent ? "var(--tx3)" : "var(--pur)",
                fontWeight: selectedStudent ? 500 : 700,
                cursor: selectedStudent ? onBackToStudents : "default",
              }}
              onClick={selectedStudent ? onBackToStudents : undefined}
            >
              {selectedBranch}
            </span>
          </>
        )}

        {selectedStudent && (
          <>
            <ChevronRight size={13} />
            <span style={{ color: "var(--pur)", fontWeight: 700 }}>
              {selectedStudent.name}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Submissions Component ───────────────────────────────────────────────

function Submissions({
  onViewSubmissionDetails,
  navbarSearchQuery = "",
  currentUser,
  selectedStudentId,
  onSelectStudent,
}) {
  const [allStudents, setAllStudents] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Hierarchy navigation views: "year" | "branch" | "student_list" | "student_submissions"
  const [view, setView] = useState("year");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Student list search
  const [search, setSearch] = useState("");

  // Student submissions state
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [studentSubmissionsLoading, setStudentSubmissionsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");

  // Keep search in sync with navbar search
  useEffect(() => {
    if (navbarSearchQuery) {
      setSearch(navbarSearchQuery);
    }
  }, [navbarSearchQuery]);

  // ── Fetch All Students and Submissions from Database ──────────────────────────
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError("");

      const [studentsRes, subsRes] = await Promise.all([
        fetch(`${API_URL}/students`),
        fetch(`${API_URL}/submissions`),
      ]);

      if (!studentsRes.ok || !subsRes.ok) {
        throw new Error("Unable to load records from the database.");
      }

      const [studentsData, subsData] = await Promise.all([
        studentsRes.json(),
        subsRes.json(),
      ]);

      if (studentsData.success && Array.isArray(studentsData.students)) {
        const formatted = studentsData.students.map((s) => ({
          id: s.id,
          name: s.name || "N/A",
          rollNo: s.roll_no || "",
          roll_no: s.roll_no || "",
          year: s.year,
          normYear: normalizeYear(s.year),
          branch: s.branch,
          normBranch: normalizeBranch(s.branch),
          email: s.email || "",
          userId: s.user_id,
        }));
        setAllStudents(formatted);
      } else {
        setAllStudents([]);
      }

      if (subsData.success && Array.isArray(subsData.submissions)) {
        setAllSubmissions(subsData.submissions);
      } else {
        setAllSubmissions([]);
      }
    } catch (err) {
      console.error("Submissions load error:", err);
      setFetchError("Unable to load data from database. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ── Handle Initial Prop `selectedStudentId` if passed ─────────────────────────
  useEffect(() => {
    if (selectedStudentId && allStudents.length > 0 && !selectedStudent) {
      const matched = allStudents.find(
        (s) =>
          String(s.id) === String(selectedStudentId) ||
          (s.userId && String(s.userId) === String(selectedStudentId))
      );
      if (matched) {
        if (matched.normYear && matched.normYear !== "__UNKNOWN__") {
          setSelectedYear(matched.normYear);
        }
        if (matched.normBranch && matched.normBranch !== "__UNKNOWN__") {
          setSelectedBranch(matched.normBranch);
        }
        handleViewStudentSubmissions(matched);
      }
    }
  }, [selectedStudentId, allStudents, selectedStudent]);

  // ── Navigation Handlers ──────────────────────────────────────────────────────

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    setSelectedBranch(null);
    setSelectedStudent(null);
    setSearch("");
    setView("branch");
  };

  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    setSelectedStudent(null);
    setSearch("");
    setView("student_list");
  };

  const handleBackToYear = () => {
    setSelectedYear(null);
    setSelectedBranch(null);
    setSelectedStudent(null);
    setSearch("");
    setView("year");
  };

  const handleBackToBranch = () => {
    setSelectedBranch(null);
    setSelectedStudent(null);
    setSearch("");
    setView("branch");
  };

  const handleBackToStudents = () => {
    setSelectedStudent(null);
    setSelectedLanguage("All Languages");
    setStudentSubmissions([]);
    setView("student_list");
    if (onSelectStudent) {
      onSelectStudent(null);
    }
  };

  // ── View Submissions for a Specific Student ──────────────────────────────────
  const handleViewStudentSubmissions = async (student) => {
    setSelectedStudent(student);
    setSelectedLanguage("All Languages");
    setView("student_submissions");

    if (onSelectStudent) {
      onSelectStudent(student.id);
    }

    try {
      setStudentSubmissionsLoading(true);
      // Fetch submissions for this specific student ID directly from database
      const res = await fetch(`${API_URL}/submissions?student_id=${student.id}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.submissions)) {
        setStudentSubmissions(data.submissions);
      } else {
        // Fallback: filter from allSubmissions
        const fallback = allSubmissions.filter(
          (sub) =>
            String(sub.student_id) === String(student.id) ||
            String(sub.profiles?.id) === String(student.id)
        );
        setStudentSubmissions(fallback);
      }
    } catch (err) {
      console.error("Error fetching submissions for student:", err);
      // Fallback: filter from allSubmissions
      const fallback = allSubmissions.filter(
        (sub) =>
          String(sub.student_id) === String(student.id) ||
          String(sub.profiles?.id) === String(student.id)
      );
      setStudentSubmissions(fallback);
    } finally {
      setStudentSubmissionsLoading(false);
    }
  };

  // ── Derived Data / Counts ───────────────────────────────────────────────────

  /** Count total submissions for a year & branch */
  const countSubmissionsFor = (normYear, normBranch) =>
    allSubmissions.filter((sub) => {
      const y = normalizeYear(sub.profiles?.year);
      const b = normalizeBranch(sub.profiles?.branch);
      const yearOk = y !== "" && y !== "__UNKNOWN__";
      const branchOk = b !== "" && b !== "__UNKNOWN__";
      if (!normBranch) return yearOk && y === normYear;
      return yearOk && branchOk && y === normYear && b === normBranch;
    }).length;

  /** Count registered students in a year & branch */
  const countStudentsFor = (normYear, normBranch) =>
    allStudents.filter((st) => {
      if (!normBranch) return st.normYear === normYear;
      return st.normYear === normYear && st.normBranch === normBranch;
    }).length;

  /** Registered students belonging to selected year & branch */
  const branchStudents = useMemo(() => {
    if (!selectedYear || !selectedBranch) return [];
    return allStudents.filter(
      (st) => st.normYear === selectedYear && st.normBranch === selectedBranch
    );
  }, [allStudents, selectedYear, selectedBranch]);

  /** Filtered branch students by search term */
  const filteredBranchStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return branchStudents;
    return branchStudents.filter(
      (st) =>
        st.name.toLowerCase().includes(query) ||
        String(st.rollNo).toLowerCase().includes(query)
    );
  }, [branchStudents, search]);

  /** Count submissions per student */
  const submissionCountByStudentId = useMemo(() => {
    const map = {};
    allSubmissions.forEach((sub) => {
      const sId = sub.student_id || sub.profiles?.id;
      if (sId) {
        map[sId] = (map[sId] || 0) + 1;
      }
    });
    return map;
  }, [allSubmissions]);

  /** Global latest 5 submissions for the year overview */
  const globalRecentSubmissions = useMemo(() => {
    return [...allSubmissions]
      .sort((a, b) => {
        const ta = parseUtcDate(a.submitted_at)?.getTime() || 0;
        const tb = parseUtcDate(b.submitted_at)?.getTime() || 0;
        return tb - ta;
      })
      .slice(0, 5);
  }, [allSubmissions]);

  /** Sorted student submissions (newest first) */
  const sortedStudentSubmissions = useMemo(() => {
    return [...studentSubmissions].sort((a, b) => {
      const ta = parseUtcDate(a.submitted_at)?.getTime() || 0;
      const tb = parseUtcDate(b.submitted_at)?.getTime() || 0;
      return tb - ta;
    });
  }, [studentSubmissions]);

  /** Submissions filtered by language */
  const filteredSubmissions = useMemo(() => {
    if (!selectedLanguage || selectedLanguage === "All Languages") {
      return sortedStudentSubmissions;
    }
    const target = selectedLanguage.toLowerCase().trim();
    return sortedStudentSubmissions.filter((sub) => {
      const l = (sub.language || "").toLowerCase().trim();
      if (target === "c") return l === "c";
      if (target === "c++") return l === "cpp" || l === "c++";
      if (target === "java") return l === "java";
      if (target === "python") return l === "python";
      return l === target;
    });
  }, [sortedStudentSubmissions, selectedLanguage]);

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

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <TeacherLayout
      title={
        view === "student_submissions" && selectedStudent
          ? selectedStudent.name
          : "Submissions"
      }
      description={
        view === "student_submissions" && selectedStudent
          ? `All code submissions and compiler records for ${selectedStudent.name}.`
          : "Browse student code submissions by academic year and branch."
      }
      actions={
        <button
          type="button"
          onClick={fetchAllData}
          disabled={loading}
          className="boc d-inline-flex align-items-center gap-2 px-3 py-2"
          style={{
            borderRadius: "8px",
            fontSize: "0.82rem",
            fontWeight: 600,
            background: "var(--bg3)",
            border: "1px solid var(--bd)",
            color: "var(--tx)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          title="Refresh database records"
        >
          <RotateCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          <span>Refresh</span>
        </button>
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
        }}
      />

      {/* ── Error Banner ── */}
      {fetchError && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#fca5a5",
            fontSize: "0.82rem",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ShieldAlert size={15} />
          {fetchError}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 1 — YEAR SELECTION
      ════════════════════════════════════════════════════ */}
      {view === "year" && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <p style={{ fontSize: "0.85rem", color: "var(--tx3)", margin: 0 }}>
              Select an academic year to view branches and student submissions.
            </p>
            {!loading && (
              <span style={{ fontSize: "0.82rem", color: "var(--tx2)", fontWeight: 600 }}>
                Total submissions:{" "}
                <span style={{ color: "var(--pur)", fontWeight: 700 }}>{allSubmissions.length}</span>
              </span>
            )}
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "var(--tx3)",
                padding: "48px 0",
                justifyContent: "center",
              }}
            >
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              <span>Loading records from database…</span>
            </div>
          ) : (
            <>
              {/* Year Cards Grid */}
              <div className="students-year-grid">
                {YEARS.map((yr) => {
                  const subCount = countSubmissionsFor(yr.value, null);
                  const studCount = countStudentsFor(yr.value, null);
                  return (
                    <SelectionCard
                      key={yr.value}
                      label={yr.label}
                      sublabel={`${subCount} submission${subCount !== 1 ? "s" : ""} • ${studCount} student${studCount !== 1 ? "s" : ""}`}
                      badge={yr.short}
                      onClick={() => handleSelectYear(yr.value)}
                    />
                  );
                })}
              </div>

              {/* Recent Submissions Card */}
              <div
                style={{
                  marginTop: "28px",
                  background: "var(--sf)",
                  border: "1px solid var(--bd)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  width: "100%",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background: "var(--bg3)",
                    borderBottom: "1px solid var(--bd)",
                    padding: "16px 22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "rgba(139, 92, 246, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--pur)",
                        flexShrink: 0,
                      }}
                    >
                      <Bell size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1.02rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
                        Recent Submissions
                      </h4>
                      <p style={{ fontSize: "0.76rem", color: "var(--tx3)", margin: "2px 0 0" }}>
                        Latest student coding submissions evaluated by the compiler
                      </p>
                    </div>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      background: "rgba(139, 92, 246, 0.1)",
                      border: "1px solid rgba(139, 92, 246, 0.25)",
                      color: "var(--pur)",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--pur)",
                      }}
                    />
                    {globalRecentSubmissions.length} Recent
                  </span>
                </div>

                {/* Submissions Table */}
                <div style={{ overflowX: "auto", width: "100%" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--bg3)", borderBottom: "1px solid var(--bd)" }}>
                        <th style={{ ...thStyle, minWidth: "160px" }}>Student Name</th>
                        <th style={{ ...thStyle, width: "120px" }}>Roll Number</th>
                        <th style={{ ...thStyle, minWidth: "200px" }}>Practical / Assignment</th>
                        <th style={{ ...thStyle, width: "120px" }}>Language</th>
                        <th style={{ ...thStyle, width: "120px" }}>Status</th>
                        <th style={{ ...thStyle, width: "180px" }}>Submitted Date & Time</th>
                        <th style={{ ...thStyle, width: "120px", textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalRecentSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: "40px 20px", textAlign: "center", color: "var(--tx3)" }}>
                            <FileCode size={30} style={{ opacity: 0.35, marginBottom: "8px" }} />
                            <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--tx2)" }}>
                              No recent submissions available.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        globalRecentSubmissions.map((sub, idx) => {
                          const ls = langStyle(sub.language);
                          const ss = statusStyle(sub.status);
                          const studentName = sub.profiles?.name || "Student";
                          const rollNo = sub.profiles?.roll_no || "—";

                          return (
                            <tr
                              key={sub.id}
                              onClick={() => onViewSubmissionDetails && onViewSubmissionDetails(sub.id)}
                              style={{
                                borderBottom: idx < globalRecentSubmissions.length - 1 ? "1px solid var(--bd)" : "none",
                                cursor: "pointer",
                                transition: "background 0.15s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139, 92, 246, 0.04)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              title="Click to view submission details"
                            >
                              {/* Student Name */}
                              <td style={{ padding: "14px 18px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <div
                                    style={{
                                      width: "34px",
                                      height: "34px",
                                      borderRadius: "50%",
                                      background: "var(--grad)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "0.88rem",
                                      fontWeight: 700,
                                      color: "#fff",
                                      flexShrink: 0,
                                      boxShadow: "0 2px 8px rgba(139, 92, 246, 0.2)",
                                    }}
                                  >
                                    {studentName.trim()[0]?.toUpperCase() || "S"}
                                  </div>
                                  <div>
                                    <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.88rem", display: "block" }}>
                                      {studentName}
                                    </span>
                                    {sub.profiles?.branch && (
                                      <span style={{ fontSize: "0.72rem", color: "var(--tx3)" }}>
                                        {formatBranchDisplay(sub.profiles.branch)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Roll Number */}
                              <td
                                style={{
                                  padding: "14px 18px",
                                  color: "var(--tx2)",
                                  fontSize: "0.84rem",
                                  fontFamily: "'JetBrains Mono', monospace",
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {rollNo}
                              </td>

                              {/* Practical / Assignment Name */}
                              <td style={{ padding: "14px 18px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <FileCode size={15} style={{ color: "var(--pur)", flexShrink: 0 }} />
                                  <div>
                                    <div style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.85rem" }}>
                                      {sub.filename || `Practical Assignment #${sub.id}`}
                                    </div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--tx3)" }}>
                                      ID: CC-SUB-{sub.id}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Programming Language */}
                              <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontSize: "0.73rem",
                                    fontWeight: 600,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    background: ls.bg,
                                    color: ls.color,
                                    border: `1px solid ${ls.border}`,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {sub.language || "—"}
                                </span>
                              </td>

                              {/* Submission Status */}
                              <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontSize: "0.73rem",
                                    fontWeight: 600,
                                    textTransform: "capitalize",
                                    background: ss.bg,
                                    color: ss.color,
                                    border: `1px solid ${ss.border}`,
                                  }}
                                >
                                  {sub.status || "saved"}
                                </span>
                              </td>

                              {/* Submitted Date & Time (IST) */}
                              <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--tx2)", fontSize: "0.82rem" }}>
                                  <Clock size={13} style={{ color: "var(--tx3)" }} />
                                  <span>{formatSubmissionDate(sub.submitted_at)}</span>
                                </div>
                              </td>

                              {/* Action */}
                              <td style={{ padding: "14px 18px", textAlign: "center" }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onViewSubmissionDetails) {
                                      onViewSubmissionDetails(sub.id);
                                    }
                                  }}
                                  className="boc"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    background: "rgba(139, 92, 246, 0.1)",
                                    border: "1px solid rgba(139, 92, 246, 0.25)",
                                    color: "var(--pur)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    whiteSpace: "nowrap",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "var(--pur)";
                                    e.currentTarget.style.color = "#fff";
                                    e.currentTarget.style.borderColor = "var(--pur)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
                                    e.currentTarget.style.color = "var(--pur)";
                                    e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)";
                                  }}
                                  title="View submission source code"
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
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 2 — BRANCH SELECTION
      ════════════════════════════════════════════════════ */}
      {view === "branch" && selectedYear && (
        <div>
          <Breadcrumb
            selectedYear={selectedYear}
            selectedBranch={null}
            selectedStudent={null}
            onBackToYear={handleBackToYear}
            onBackToBranch={handleBackToBranch}
            onBackToStudents={handleBackToStudents}
          />

          <p style={{ fontSize: "0.85rem", color: "var(--tx3)", margin: "16px 0 20px" }}>
            Select a branch under <strong style={{ color: "var(--pur)" }}>{selectedYear}</strong>.
          </p>

          <div className="students-branch-grid">
            {BRANCHES.map((br) => {
              const subCount = loading ? null : countSubmissionsFor(selectedYear, br.value);
              const studCount = loading ? null : countStudentsFor(selectedYear, br.value);
              return (
                <SelectionCard
                  key={br.value}
                  label={br.label}
                  sublabel={
                    subCount !== null
                      ? `${subCount} submission${subCount !== 1 ? "s" : ""} • ${studCount} student${studCount !== 1 ? "s" : ""}`
                      : "Loading…"
                  }
                  badge={br.code}
                  onClick={() => handleSelectBranch(br.value)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 3 — STUDENT LIST (AFTER SELECTING BRANCH)
          Table: | Roll No | Student Name | Action |
      ════════════════════════════════════════════════════ */}
      {view === "student_list" && selectedYear && selectedBranch && (
        <div>
          <Breadcrumb
            selectedYear={selectedYear}
            selectedBranch={selectedBranch}
            selectedStudent={null}
            onBackToYear={handleBackToYear}
            onBackToBranch={handleBackToBranch}
            onBackToStudents={handleBackToStudents}
          />

          {/* Context Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(139,92,246,0.12)",
              border: "1px solid var(--pur)",
              borderRadius: "10px",
              padding: "8px 16px",
              margin: "14px 0 20px",
            }}
          >
            <BookOpen size={15} style={{ color: "var(--pur)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pur)" }}>
              {selectedYear}
            </span>
            <ChevronRight size={13} style={{ color: "var(--tx3)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--tx)" }}>
              {selectedBranch}
            </span>
          </div>

          {/* Search Toolbar */}
          <div
            className="submissions-filter-toolbar"
            style={{
              padding: "16px 20px",
              background: "var(--sf)",
              border: "1px solid var(--bd)",
              borderRadius: "14px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flex: 1, maxWidth: "400px", minWidth: "240px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "var(--bg)",
                  border: "1px solid var(--bd)",
                  borderRadius: "8px",
                  padding: "0 12px",
                  height: "38px",
                  gap: "8px",
                  width: "100%",
                }}
              >
                <Search size={14} style={{ color: "var(--tx3)", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search student name or roll no..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--tx)",
                    fontSize: "0.82rem",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            <div style={{ fontSize: "0.85rem", color: "var(--tx2)", fontWeight: 600 }}>
              Registered Students:{" "}
              <span style={{ color: "var(--pur)" }}>{filteredBranchStudents.length}</span>
              {filteredBranchStudents.length !== branchStudents.length && (
                <span style={{ color: "var(--tx3)", fontWeight: 400, fontSize: "0.78rem", marginLeft: "6px" }}>
                  (filtered from {branchStudents.length})
                </span>
              )}
            </div>
          </div>

          {/* Students Table */}
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
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg3)", borderBottom: "1px solid var(--bd)" }}>
                    <th style={{ ...thStyle, width: "25%" }}>Roll No</th>
                    <th style={{ ...thStyle, width: "50%" }}>Student Name</th>
                    <th style={{ ...thStyle, width: "25%", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBranchStudents.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: "48px 20px", textAlign: "center", color: "var(--tx3)" }}>
                        <Users size={32} style={{ opacity: 0.35, marginBottom: "8px" }} />
                        <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--tx2)" }}>
                          {search.trim()
                            ? `No students found matching "${search}".`
                            : `No registered students found for ${selectedYear} - ${selectedBranch}.`}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBranchStudents.map((st) => {
                      const count = submissionCountByStudentId[st.id] || 0;
                      return (
                        <tr
                          key={st.id}
                          style={{ borderBottom: "1px solid var(--bd)", transition: "background 0.15s ease" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139, 92, 246, 0.03)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          {/* Roll No */}
                          <td
                            style={{
                              padding: "16px 20px",
                              color: "var(--tx2)",
                              fontWeight: 600,
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "0.85rem",
                            }}
                          >
                            {st.rollNo || st.roll_no || "—"}
                          </td>

                          {/* Student Name */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: "var(--grad)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.92rem",
                                  fontWeight: 700,
                                  color: "#fff",
                                  flexShrink: 0,
                                  boxShadow: "0 2px 8px rgba(139, 92, 246, 0.2)",
                                }}
                              >
                                {st.name ? st.name.trim()[0].toUpperCase() : "S"}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.9rem" }}>
                                  {st.name}
                                </div>
                                <div style={{ fontSize: "0.74rem", color: "var(--tx3)", marginTop: "2px" }}>
                                  {count} {count === 1 ? "submission" : "submissions"} recorded
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Action */}
                          <td style={{ padding: "16px 20px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleViewStudentSubmissions(st)}
                              className="boc"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "0.8rem",
                                padding: "7px 16px",
                                borderRadius: "8px",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--pur)";
                                e.currentTarget.style.color = "var(--pur)";
                                e.currentTarget.style.transform = "translateY(-1px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--bd2)";
                                e.currentTarget.style.color = "var(--tx)";
                                e.currentTarget.style.transform = "translateY(0)";
                              }}
                            >
                              <Eye size={14} />
                              <span>View Submissions</span>
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
      )}

      {/* ════════════════════════════════════════════════════
          STEP 4 — DEDICATED STUDENT SUBMISSIONS VIEW
          Table: | # | Practical / Assignment | Language | Status | Submitted At | Action |
      ════════════════════════════════════════════════════ */}
      {view === "student_submissions" && selectedStudent && (
        <div>
          <Breadcrumb
            selectedYear={selectedYear}
            selectedBranch={selectedBranch}
            selectedStudent={selectedStudent}
            onBackToYear={handleBackToYear}
            onBackToBranch={handleBackToBranch}
            onBackToStudents={handleBackToStudents}
          />

          {/* 1. Student Information Header Card */}
          <div
            style={{
              padding: "24px 28px",
              background: "var(--sf)",
              border: "1px solid var(--bd)",
              borderRadius: "18px",
              margin: "16px 0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--grad)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(139, 92, 246, 0.3)",
                  flexShrink: 0,
                }}
              >
                {selectedStudent.name ? selectedStudent.name.trim()[0].toUpperCase() : "S"}
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 6px" }}>
                  {selectedStudent.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "0.82rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--tx2)" }}>
                    <span style={{ color: "var(--tx3)" }}>Roll No:</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "var(--tx)" }}>
                      {selectedStudent.rollNo || selectedStudent.roll_no || "—"}
                    </span>
                  </div>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--tx3)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--tx2)" }}>
                    <span style={{ color: "var(--tx3)" }}>Academic Year:</span>
                    <span style={{ fontWeight: 600, color: "var(--pur)" }}>
                      {selectedYear || formatYearDisplay(selectedStudent.year)}
                    </span>
                  </div>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--tx3)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--tx2)" }}>
                    <span style={{ color: "var(--tx3)" }}>Branch:</span>
                    <span style={{ fontWeight: 600, color: "var(--tx)" }}>
                      {selectedBranch || formatBranchDisplay(selectedStudent.branch)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBackToStudents}
              className="boc"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: 600,
                background: "var(--bg3)",
                border: "1px solid var(--bd)",
                color: "var(--tx)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--pur)";
                e.currentTarget.style.color = "var(--pur)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--bd)";
                e.currentTarget.style.color = "var(--tx)";
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Students</span>
            </button>
          </div>

          {/* 2. Language Filter Toolbar */}
          <div
            className="submissions-filter-toolbar"
            style={{
              padding: "16px 20px",
              background: "var(--sf)",
              border: "1px solid var(--bd)",
              borderRadius: "14px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <label
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--tx2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  margin: 0,
                }}
              >
                <Code size={15} style={{ color: "var(--pur)" }} />
                <span>Language Filter:</span>
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="code-topbar select"
                style={{
                  width: "160px",
                  height: "38px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  background: "var(--bg)",
                  border: "1px solid var(--bd)",
                  color: "var(--tx)",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="All Languages">All Languages</option>
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
              </select>
            </div>

            <div style={{ fontSize: "0.82rem", color: "var(--tx3)" }}>
              Showing <strong style={{ color: "var(--pur)" }}>{filteredSubmissions.length}</strong> of{" "}
              <strong style={{ color: "var(--tx)" }}>{studentSubmissions.length}</strong> submissions
            </div>
          </div>

          {/* 3. Student Submissions Table */}
          <div
            style={{
              background: "var(--sf)",
              border: "1px solid var(--bd)",
              borderRadius: "18px",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {studentSubmissionsLoading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "var(--tx3)",
                  padding: "48px 0",
                  justifyContent: "center",
                }}
              >
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                <span>Loading submissions from database…</span>
              </div>
            ) : (
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--bg3)", borderBottom: "1px solid var(--bd)" }}>
                      <th style={{ ...thStyle, width: "60px", textAlign: "center" }}>#</th>
                      <th style={{ ...thStyle, minWidth: "220px" }}>Practical / Assignment</th>
                      <th style={{ ...thStyle, width: "120px" }}>Language</th>
                      <th style={{ ...thStyle, width: "120px" }}>Status</th>
                      <th style={{ ...thStyle, width: "180px" }}>Submitted At</th>
                      <th style={{ ...thStyle, width: "130px", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "var(--tx3)" }}>
                          <FileCode size={32} style={{ opacity: 0.35, marginBottom: "8px" }} />
                          <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--tx2)" }}>
                            No submissions recorded for this student.
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "var(--tx3)", marginTop: "4px" }}>
                            This student has not saved or submitted any code yet.
                          </div>
                        </td>
                      </tr>
                    ) : filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center" }}>
                          <Code size={32} style={{ opacity: 0.35, color: "var(--pur)", marginBottom: "8px" }} />
                          <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--tx2)" }}>
                            No {selectedLanguage} submissions found for this student.
                          </div>
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
                              marginTop: "8px",
                            }}
                          >
                            Show all submissions
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub, idx) => {
                        const ls = langStyle(sub.language);
                        const ss = statusStyle(sub.status);

                        return (
                          <tr
                            key={sub.id}
                            style={{
                              borderBottom: idx < filteredSubmissions.length - 1 ? "1px solid var(--bd)" : "none",
                              transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,92,246,0.03)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {/* Row Number */}
                            <td
                              style={{
                                padding: "14px 18px",
                                textAlign: "center",
                                color: "var(--tx3)",
                                fontSize: "0.82rem",
                                fontWeight: 600,
                              }}
                            >
                              {idx + 1}
                            </td>

                            {/* Practical / Assignment Name */}
                            <td style={{ padding: "14px 18px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    background: "rgba(139, 92, 246, 0.1)",
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
                                  <div style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.88rem" }}>
                                    {sub.filename || `Practical Assignment #${sub.id}`}
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "var(--tx3)" }}>
                                    ID: CC-SUB-{sub.id}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Language */}
                            <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.74rem",
                                  fontWeight: 600,
                                  fontFamily: "'JetBrains Mono', monospace",
                                  background: ls.bg,
                                  color: ls.color,
                                  border: `1px solid ${ls.border}`,
                                  textTransform: "uppercase",
                                }}
                              >
                                {sub.language || "—"}
                              </span>
                            </td>

                            {/* Status */}
                            <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  fontSize: "0.74rem",
                                  fontWeight: 600,
                                  textTransform: "capitalize",
                                  background: ss.bg,
                                  color: ss.color,
                                  border: `1px solid ${ss.border}`,
                                }}
                              >
                                {sub.status || "saved"}
                              </span>
                            </td>

                            {/* Submitted At (IST) */}
                            <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--tx2)", fontSize: "0.82rem" }}>
                                <Clock size={13} style={{ color: "var(--tx3)" }} />
                                <span>{formatSubmissionDate(sub.submitted_at)}</span>
                              </div>
                            </td>

                            {/* Action - View Code */}
                            <td style={{ padding: "14px 18px", textAlign: "center" }}>
                              <button
                                type="button"
                                onClick={() => onViewSubmissionDetails && onViewSubmissionDetails(sub.id)}
                                className="boc"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  padding: "7px 14px",
                                  borderRadius: "8px",
                                  fontSize: "0.78rem",
                                  fontWeight: 600,
                                  background: "rgba(139, 92, 246, 0.1)",
                                  border: "1px solid rgba(139, 92, 246, 0.25)",
                                  color: "var(--pur)",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "var(--pur)";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.borderColor = "var(--pur)";
                                  e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
                                  e.currentTarget.style.color = "var(--pur)";
                                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)";
                                  e.currentTarget.style.transform = "translateY(0)";
                                }}
                                title="Inspect submission source code"
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
            )}
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}

export default Submissions;
