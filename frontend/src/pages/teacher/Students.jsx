import { useState, useEffect } from "react";
import { Search, X, ChevronRight, ArrowLeft, BookOpen, Users, AlertCircle } from "lucide-react";
import StudentTable from "../../components/teacher/StudentTable";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import { API_URL } from "../../utils/api";

// ─── Constants ───────────────────────────────────────────────────────────────

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

function normalizeYear(yearVal) {
  if (!yearVal && yearVal !== 0) return "";
  const str = String(yearVal).trim().toLowerCase();
  if (!str) return "";
  if (str === "1" || str.includes("first")  || str.includes("1st")) return "First Year";
  if (str === "2" || str.includes("second") || str.includes("2nd")) return "Second Year";
  if (str === "3" || str.includes("third")  || str.includes("3rd")) return "Third Year";
  // Any other non-empty but unrecognised value (e.g. "2024") → mark as incomplete
  return "__UNKNOWN__";
}

function formatYearDisplay(yearVal) {
  const norm = normalizeYear(yearVal);
  if (norm && norm !== "__UNKNOWN__") return norm;
  return yearVal ? String(yearVal) : "N/A";
}

function normalizeBranch(branchVal) {
  if (!branchVal) return "";
  const str = String(branchVal).trim().toLowerCase();
  if (!str) return "";
  if (str.includes("computer") || str === "ct" || str === "co" || str === "cm") return "Computer Technology";
  if (str.includes("information") || str === "it" || str === "if") return "Information Technology";
  return "__UNKNOWN__";
}

function formatBranchDisplay(branchVal) {
  const norm = normalizeBranch(branchVal);
  if (norm && norm !== "__UNKNOWN__") return norm;
  return branchVal ? String(branchVal) : "N/A";
}

function normalizeSemester(semVal) {
  if (!semVal) return "";
  const str = String(semVal).trim().toLowerCase();
  if (str === "1" || str.includes("sem 1") || str.includes("semester 1") || str.includes("first"))   return "First Semester";
  if (str === "2" || str.includes("sem 2") || str.includes("semester 2") || str.includes("second"))  return "Second Semester";
  if (str === "3" || str.includes("sem 3") || str.includes("semester 3") || str.includes("third"))   return "Third Semester";
  if (str === "4" || str.includes("sem 4") || str.includes("semester 4") || str.includes("fourth"))  return "Fourth Semester";
  if (str === "5" || str.includes("sem 5") || str.includes("semester 5") || str.includes("fifth"))   return "Fifth Semester";
  if (str === "6" || str.includes("sem 6") || str.includes("semester 6") || str.includes("sixth"))   return "Sixth Semester";
  return "";
}

const semesterOptionsByYear = {
  "First Year":  [{ value: "First Semester",  label: "First Semester"  }, { value: "Second Semester", label: "Second Semester" }],
  "Second Year": [{ value: "Third Semester",  label: "Third Semester"  }, { value: "Fourth Semester", label: "Fourth Semester" }],
  "Third Year":  [{ value: "Fifth Semester",  label: "Fifth Semester"  }, { value: "Sixth Semester",  label: "Sixth Semester"  }],
};

// ─── Shared style helpers ─────────────────────────────────────────────────────

const selectStyle = {
  width: "100%",
  height: "38px",
  padding: "0 10px",
  borderRadius: "8px",
  fontSize: "0.82rem",
  background: "var(--bg)",
  border: "1px solid var(--bd)",
  color: "var(--tx)",
  outline: "none",
};

const labelStyle = {
  fontSize: "0.78rem",
  color: "var(--tx2)",
  fontWeight: 600,
  display: "block",
  marginBottom: "6px",
};

// ─── Classify a student into the hierarchy ───────────────────────────────────

/**
 * Returns { normYear, normBranch, isIncomplete }
 * isIncomplete = true when year OR branch is missing / unrecognised
 */
function classifyStudent(s) {
  const normYear   = normalizeYear(s.rawYear || s.year);
  const normBranch = normalizeBranch(s.rawBranch || s.branch);

  const yearOk   = normYear   !== "" && normYear   !== "__UNKNOWN__";
  const branchOk = normBranch !== "" && normBranch !== "__UNKNOWN__";

  return {
    normYear:   yearOk   ? normYear   : null,
    normBranch: branchOk ? normBranch : null,
    isIncomplete: !yearOk || !branchOk,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Standard card for Year / Branch selection */
function SelectionCard({ label, sublabel, badge, onClick, isActive, warn }) {
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
        background: warn
          ? "rgba(251,191,36,0.06)"
          : isActive ? "rgba(139,92,246,0.12)" : "var(--bg2)",
        border: `1px solid ${warn ? "rgba(251,191,36,0.3)" : isActive ? "var(--pur)" : "var(--bd)"}`,
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        gap: "12px",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = warn
          ? "0 6px 24px rgba(251,191,36,0.12)"
          : "0 6px 24px rgba(139,92,246,0.12)";
        if (!isActive && !warn) {
          e.currentTarget.style.background = "rgba(139,92,246,0.07)";
          e.currentTarget.style.borderColor = "var(--bd2)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        if (!isActive && !warn) {
          e.currentTarget.style.background = "var(--bg2)";
          e.currentTarget.style.borderColor = "var(--bd)";
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: warn
              ? "rgba(251,191,36,0.15)"
              : isActive ? "var(--pur)" : "rgba(139,92,246,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {warn ? (
            <AlertCircle size={20} style={{ color: "#fbbf24" }} />
          ) : badge ? (
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: isActive ? "#fff" : "var(--pur)", fontFamily: "monospace" }}>
              {badge}
            </span>
          ) : (
            <Users size={20} style={{ color: isActive ? "#fff" : "var(--pur)" }} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: warn ? "#fbbf24" : "var(--tx)", marginBottom: "4px" }}>
            {label}
          </div>
          {sublabel && (
            <div style={{ fontSize: "0.8rem", color: warn ? "rgba(251,191,36,0.7)" : "var(--tx3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {sublabel}
            </div>
          )}
        </div>
      </div>
      <ChevronRight size={20} style={{ color: warn ? "#fbbf24" : isActive ? "var(--pur)" : "var(--tx3)", flexShrink: 0, marginLeft: "8px" }} />
    </button>
  );
}

/** Breadcrumb + Back button */
function Breadcrumb({ selectedYear, selectedBranch, isIncomplete, onBackToYear, onBackToBranch }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
      <button
        onClick={selectedBranch || isIncomplete ? onBackToBranch : onBackToYear}
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
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.08)"; e.currentTarget.style.color = "var(--tx)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--tx2)"; }}
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--tx3)" }}>
        {isIncomplete ? (
          <span style={{ color: "#fbbf24", fontWeight: 700 }}>Incomplete Info</span>
        ) : (
          <>
            <span
              style={{ color: selectedBranch ? "var(--tx3)" : "var(--pur)", cursor: selectedBranch ? "pointer" : "default", fontWeight: selectedBranch ? 500 : 700 }}
              onClick={selectedBranch ? onBackToBranch : undefined}
            >
              {selectedYear || "Year"}
            </span>
            {selectedBranch && (
              <>
                <ChevronRight size={13} />
                <span style={{ color: "var(--pur)", fontWeight: 700 }}>{selectedBranch}</span>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Students({ onViewProfile, navbarSearchQuery = "" }) {
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // view: "year" | "branch" | "students" | "incomplete"
  const [view,           setView]           = useState("year");
  const [selectedYear,   setSelectedYear]   = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Filters (only in "students" / "incomplete" view)
  const [search,   setSearch]   = useState("");
  const [semester, setSemester] = useState("All");

  useEffect(() => {
    if (navbarSearchQuery) setSearch(navbarSearchQuery);
  }, [navbarSearchQuery]);

  // ── Fetch all students once ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();

        if (result.success && Array.isArray(result.students)) {
          const formatted = result.students.map((s) => ({
            id:        s.id,
            name:      s.name      || "N/A",
            rollNo:    s.roll_no   || "N/A",
            year:      formatYearDisplay(s.year),
            rawYear:   s.year,
            semester:  s.semester  || "N/A",
            branch:    formatBranchDisplay(s.branch),
            rawBranch: s.branch,
            email:     s.email     || "N/A",
            subjects:  s.subjects  || [],
            subject:   s.subject   || (Array.isArray(s.subjects) && s.subjects.length > 0 ? s.subjects.join(", ") : "N/A"),
            language:  s.language,
            languages: s.languages,
            status:    "Active",
          }));
          setStudents(formatted);
        } else {
          throw new Error(result.message || "Unexpected API response");
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // ── Navigation helpers ───────────────────────────────────────────────────────

  const resetFilters = () => { setSearch(""); setSemester("All"); };

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    setSelectedBranch(null);
    resetFilters();
    setView("branch");
  };

  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    resetFilters();
    setView("students");
  };

  const handleShowIncomplete = () => {
    setSelectedYear(null);
    setSelectedBranch(null);
    resetFilters();
    setView("incomplete");
  };

  const handleBackToYear = () => {
    setSelectedYear(null);
    setSelectedBranch(null);
    setView("year");
  };

  const handleBackToBranch = () => {
    setSelectedBranch(null);
    resetFilters();
    setView("branch");
  };

  const clearFilters = () => resetFilters();

  // ── Derived / classified data ─────────────────────────────────────────────────

  /**
   * Partition students into:
   *   complete   – have a recognised year AND branch
   *   incomplete – missing or unrecognised year OR branch
   */
  const { complete, incomplete } = (() => {
    const c = [], i = [];
    students.forEach(s => {
      const { isIncomplete } = classifyStudent(s);
      (isIncomplete ? i : c).push(s);
    });
    return { complete: c, incomplete: i };
  })();

  // Students in a given year (complete only)
  const yearStudents = (year) =>
    complete.filter(s => classifyStudent(s).normYear === year);

  // Students in a given year+branch (complete only)
  const branchStudents = (year, branch) =>
    complete.filter(s => {
      const { normYear, normBranch } = classifyStudent(s);
      return normYear === year && normBranch === branch;
    });

  // The set currently being viewed in the table
  const currentBase = (() => {
    if (view === "incomplete") return incomplete;
    if (view === "students" && selectedYear && selectedBranch)
      return branchStudents(selectedYear, selectedBranch);
    return [];
  })();

  const availableSemesters =
    selectedYear && semesterOptionsByYear[selectedYear]
      ? semesterOptionsByYear[selectedYear]
      : [];

  const filteredStudents = currentBase.filter(s => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (s.name   && s.name   !== "N/A" && s.name.toLowerCase().includes(term)) ||
      (s.rollNo && s.rollNo !== "N/A" && s.rollNo.toLowerCase().includes(term));

    const matchesSemester = semester === "All" || normalizeSemester(s.semester) === semester;

    return matchesSearch && matchesSemester;
  });

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <TeacherLayout
      title="Students"
      description="Browse students by academic year and branch."
    >
      {/* ── Fetch error banner ── */}
      {fetchError && (
        <div style={{
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
        }}>
          <AlertCircle size={15} />
          Failed to load students: {fetchError}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 1 — YEAR SELECTION
      ════════════════════════════════════════════════════ */}
      {view === "year" && (
        <div>
          {/* Total registered count */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--tx3)", margin: 0 }}>
              Select an academic year to view its branches and students.
            </p>
            {!loading && (
              <span style={{ fontSize: "0.82rem", color: "var(--tx2)", fontWeight: 600 }}>
                Total registered:{" "}
                <span style={{ color: "var(--pur)", fontWeight: 700 }}>{students.length}</span>
              </span>
            )}
          </div>

          {/* Year cards — 3-col responsive grid */}
          <div className="students-year-grid" style={{ marginBottom: "16px" }}>
            {YEARS.map((yr) => {
              const count = loading ? null : yearStudents(yr.value).length;
              return (
                <SelectionCard
                  key={yr.value}
                  label={yr.label}
                  sublabel={count !== null ? `${count} student${count !== 1 ? "s" : ""} registered` : "Loading…"}
                  badge={yr.short}
                  onClick={() => handleSelectYear(yr.value)}
                />
              );
            })}
          </div>

          {/* Incomplete info card — shown when there are affected students */}
          {!loading && incomplete.length > 0 && (
            <div className="students-branch-grid">
              <SelectionCard
                label="Incomplete Info"
                sublabel={`${incomplete.length} student${incomplete.length !== 1 ? "s" : ""} missing year or branch`}
                onClick={handleShowIncomplete}
                warn
              />
            </div>
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
            isIncomplete={false}
            onBackToYear={handleBackToYear}
            onBackToBranch={handleBackToBranch}
          />

          <p style={{ fontSize: "0.85rem", color: "var(--tx3)", margin: "16px 0 20px" }}>
            Select a branch under <strong style={{ color: "var(--pur)" }}>{selectedYear}</strong>.
          </p>

          {/* Branch cards — 2-col responsive grid */}
          <div className="students-branch-grid">
            {BRANCHES.map((br) => {
              const count = loading ? null : branchStudents(selectedYear, br.value).length;
              return (
                <SelectionCard
                  key={br.value}
                  label={br.label}
                  sublabel={count !== null ? `${count} student${count !== 1 ? "s" : ""} in ${selectedYear}` : "Loading…"}
                  badge={br.code}
                  onClick={() => handleSelectBranch(br.value)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 3 — STUDENT TABLE (year+branch OR incomplete)
      ════════════════════════════════════════════════════ */}
      {(view === "students" || view === "incomplete") && (
        <div>
          {/* Breadcrumb */}
          <Breadcrumb
            selectedYear={selectedYear}
            selectedBranch={selectedBranch}
            isIncomplete={view === "incomplete"}
            onBackToYear={handleBackToYear}
            onBackToBranch={view === "incomplete" ? handleBackToYear : handleBackToBranch}
          />

          {/* Context badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: view === "incomplete" ? "rgba(251,191,36,0.1)" : "rgba(139,92,246,0.12)",
              border: `1px solid ${view === "incomplete" ? "rgba(251,191,36,0.4)" : "var(--pur)"}`,
              borderRadius: "10px",
              padding: "8px 16px",
              margin: "14px 0 20px",
            }}
          >
            {view === "incomplete" ? (
              <>
                <AlertCircle size={15} style={{ color: "#fbbf24" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fbbf24" }}>
                  Incomplete Info
                </span>
                <span style={{ fontSize: "0.78rem", color: "rgba(251,191,36,0.7)", marginLeft: "4px" }}>
                  — missing year or branch
                </span>
              </>
            ) : (
              <>
                <BookOpen size={15} style={{ color: "var(--pur)" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pur)" }}>
                  {selectedYear}
                </span>
                <ChevronRight size={13} style={{ color: "var(--tx3)" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--tx)" }}>
                  {selectedBranch}
                </span>
              </>
            )}
          </div>

          {/* Filters */}
          <div
            className="cyber-card mb-4"
            style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="row g-3 align-items-end">

              {/* Search */}
              <div className={view === "students" ? "col-12 col-md-6 col-lg-7" : "col-12 col-sm-8 col-md-9 col-lg-10"}>
                <label style={labelStyle}>Search Name / Roll No</label>
                <div style={{
                  display: "flex", alignItems: "center", background: "var(--bg)",
                  border: "1px solid var(--bd)", borderRadius: "8px",
                  padding: "0 12px", height: "38px", gap: "8px",
                }}>
                  <Search size={14} style={{ color: "var(--tx3)", flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ background: "none", border: "none", outline: "none", color: "var(--tx)", fontSize: "0.82rem", width: "100%" }}
                  />
                </div>
              </div>

              {/* Semester (only meaningful for known-year students) */}
              {view === "students" && (
                <div className="col-12 col-sm-8 col-md-4 col-lg-3">
                  <label style={labelStyle}>Semester</label>
                  <select value={semester} onChange={e => setSemester(e.target.value)} className="code-topbar select" style={selectStyle}>
                    <option value="All">All Semesters</option>
                    {availableSemesters.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Clear */}
              <div className={`${view === "students" ? "col-12 col-sm-4 col-md-2 col-lg-2" : "col-12 col-sm-4 col-md-3 col-lg-2"} d-flex flex-column justify-content-end`}>
                <label style={{ ...labelStyle, visibility: "hidden", userSelect: "none" }}>&nbsp;</label>
                <button
                  onClick={clearFilters}
                  className="boc d-flex align-items-center justify-content-center gap-1 w-100"
                  style={{ height: "38px", borderRadius: "8px", fontSize: "0.78rem", padding: "0 10px", whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.2s ease" }}
                  title="Reset filters"
                >
                  <X size={13} style={{ flexShrink: 0 }} />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>

          {/* Count line */}
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <span style={{ fontSize: "0.85rem", color: "var(--tx2)", fontWeight: 600 }}>
              Students:{" "}
              <span style={{ color: "var(--pur)" }}>{filteredStudents.length}</span>
              {filteredStudents.length !== currentBase.length && (
                <span style={{ color: "var(--tx3)", fontWeight: 400, fontSize: "0.78rem", marginLeft: "6px" }}>
                  (filtered from {currentBase.length})
                </span>
              )}
            </span>
          </div>

          {/* Table */}
          <StudentTable students={filteredStudents} onViewProfile={onViewProfile} />
        </div>
      )}
    </TeacherLayout>
  );
}

export default Students;
