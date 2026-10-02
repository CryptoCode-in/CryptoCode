import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import StudentTable from "../../components/teacher/StudentTable";
import TeacherLayout from "../../components/teacher/TeacherLayout";

// Semester options dependent on selected Year
const semesterOptionsByYear = {
  "First Year": [
    { value: "First Semester", label: "First Semester" },
    { value: "Second Semester", label: "Second Semester" },
  ],
  "Second Year": [
    { value: "Third Semester", label: "Third Semester" },
    { value: "Fourth Semester", label: "Fourth Semester" },
  ],
  "Third Year": [
    { value: "Fifth Semester", label: "Fifth Semester" },
    { value: "Sixth Semester", label: "Sixth Semester" },
  ],
};

function normalizeYear(yearVal) {
  if (!yearVal) return "";
  const str = String(yearVal).trim().toLowerCase();
  if (str === "1" || str.includes("first") || str.includes("1st")) return "First Year";
  if (str === "2" || str.includes("second") || str.includes("2nd")) return "Second Year";
  if (str === "3" || str.includes("third") || str.includes("3rd")) return "Third Year";
  return "";
}

function formatYearDisplay(yearVal) {
  const norm = normalizeYear(yearVal);
  if (norm) return norm;
  return yearVal ? String(yearVal) : "N/A";
}

function normalizeSemester(semVal) {
  if (!semVal) return "";
  const str = String(semVal).trim().toLowerCase();
  if (str === "1" || str.includes("sem 1") || str.includes("semester 1") || str.includes("first")) return "First Semester";
  if (str === "2" || str.includes("sem 2") || str.includes("semester 2") || str.includes("second")) return "Second Semester";
  if (str === "3" || str.includes("sem 3") || str.includes("semester 3") || str.includes("third")) return "Third Semester";
  if (str === "4" || str.includes("sem 4") || str.includes("semester 4") || str.includes("fourth")) return "Fourth Semester";
  if (str === "5" || str.includes("sem 5") || str.includes("semester 5") || str.includes("fifth")) return "Fifth Semester";
  if (str === "6" || str.includes("sem 6") || str.includes("semester 6") || str.includes("sixth")) return "Sixth Semester";
  return "";
}

function normalizeBranch(branchVal) {
  if (!branchVal) return "";
  const str = String(branchVal).trim().toLowerCase();
  if (str.includes("computer") || str === "ct" || str === "co") return "Computer Technology";
  if (str.includes("information") || str === "it") return "Information Technology";
  return "";
}

function formatBranchDisplay(branchVal) {
  const norm = normalizeBranch(branchVal);
  if (norm) return norm;
  return branchVal ? String(branchVal) : "N/A";
}

function matchesStudentLanguage(student, selectedLanguage) {
  if (!selectedLanguage || selectedLanguage === "All") return true;

  const target = selectedLanguage.toLowerCase(); // 'c', 'c++', 'java', 'python'

  const matchesSubjectString = (subj) => {
    if (!subj) return false;
    const str = String(subj).trim().toLowerCase();
    if (target === "c++") {
      return str.includes("c++") || str.includes("cpp");
    }
    if (target === "c") {
      if (str.includes("c++") || str.includes("cpp")) return false;
      return (
        str === "c" ||
        str.includes("c programming") ||
        str.includes("c-programming") ||
        str.includes("c lang") ||
        str.includes("core c") ||
        str.includes("cs-101") ||
        str.includes("data structures") ||
        /\bc\b/.test(str)
      );
    }
    if (target === "java") {
      return str.includes("java") && !str.includes("javascript");
    }
    if (target === "python") {
      return str.includes("python");
    }
    return str.includes(target);
  };

  // 1. Direct language field on student
  if (student.language && matchesSubjectString(student.language)) return true;
  if (Array.isArray(student.languages) && student.languages.some(matchesSubjectString)) return true;

  // 2. Explicit subjects array or string
  if (Array.isArray(student.subjects) && student.subjects.length > 0) {
    if (student.subjects.some(matchesSubjectString)) return true;
  }
  if (student.subject && student.subject !== "N/A" && matchesSubjectString(student.subject)) {
    return true;
  }

  // If explicit subjects exist and none matched, return false
  const hasExplicitSubjects =
    (Array.isArray(student.subjects) && student.subjects.length > 0) ||
    (student.subject && student.subject !== "N/A");

  if (hasExplicitSubjects) {
    return false;
  }

  // 3. Curriculum-based mapping based on Year & Semester (for students without explicit subjects list)
  const normYear = normalizeYear(student.year);
  const normSem = normalizeSemester(student.semester);

  if (normYear === "First Year") {
    return target === "c";
  }

  if (normYear === "Second Year") {
    if (normSem === "Third Semester") {
      return target === "c++" || target === "c";
    }
    if (normSem === "Fourth Semester") {
      return target === "java";
    }
    return target === "c++" || target === "java" || target === "c";
  }

  if (normYear === "Third Year") {
    if (normSem === "Fifth Semester") {
      return target === "java" || target === "python";
    }
    if (normSem === "Sixth Semester") {
      return target === "python";
    }
    return target === "java" || target === "python";
  }

  return false;
}

function Students({ onViewProfile, navbarSearchQuery = "" }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const [year, setYear] = useState("All");
  const [semester, setSemester] = useState("All");
  const [branch, setBranch] = useState("All");

  // Keep search in sync if navbar search is used
  useEffect(() => {
    if (navbarSearchQuery) {
      setSearch(navbarSearchQuery);
    }
  }, [navbarSearchQuery]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/students");
        const result = await response.json();

        console.log("API RESULT:", result);
        console.log("STUDENTS FROM API:", result.students);

        if (result.success && Array.isArray(result.students)) {
          const formattedStudents = result.students.map((student) => ({
            id: student.id,
            name: student.name || "N/A",
            rollNo: student.roll_no || "N/A",
            year: formatYearDisplay(student.year),
            rawYear: student.year,
            semester: student.semester || "N/A",
            branch: formatBranchDisplay(student.branch),
            rawBranch: student.branch,
            email: student.email || "N/A",
            subjects: student.subjects || [],
            subject:
              student.subject ||
              (Array.isArray(student.subjects) && student.subjects.length > 0
                ? student.subjects.join(", ")
                : "N/A"),
            language: student.language,
            languages: student.languages,
            progress: student.progress ?? 0,
            avgScore: student.avgScore ?? 0,
            lastActive: student.lastActive || "Active",
            status: "Active",
          }));

          console.log("FORMATTED STUDENTS:", formattedStudents);
          setStudents(formattedStudents);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleYearChange = (newYear) => {
    setYear(newYear);
    // Reset semester whenever year is changed
    setSemester("All");
  };

  const clearFilters = () => {
    setSearch("");
    setLanguage("All");
    setYear("All");
    setSemester("All");
    setBranch("All");
  };

  // Available semester options based on the currently selected year
  const availableSemesterOptions =
    year !== "All" && semesterOptionsByYear[year]
      ? semesterOptionsByYear[year]
      : [];

  // Combined Filtering Logic
  const filteredStudents = students.filter((s) => {
    // 1. Search Name / Roll No
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (s.name && s.name !== "N/A" && s.name.toLowerCase().includes(term)) ||
      (s.rollNo && s.rollNo !== "N/A" && s.rollNo.toLowerCase().includes(term));

    // 2. Language
    const matchesLanguage = matchesStudentLanguage(s, language);

    // 3. Year
    const matchesYear = year === "All" || normalizeYear(s.rawYear || s.year) === year;

    // 4. Semester
    const matchesSemester =
      semester === "All" || normalizeSemester(s.semester) === semester;

    // 5. Branch
    const matchesBranch =
      branch === "All" || normalizeBranch(s.rawBranch || s.branch) === branch;

    return (
      matchesSearch &&
      matchesLanguage &&
      matchesYear &&
      matchesSemester &&
      matchesBranch
    );
  });

  return (
    <TeacherLayout
      title="Students List"
      description="Manage your students, view profiles, and monitor execution progress."
    >
      {/* Filters Area */}
      <div
        className="cyber-card mb-4"
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div className="row g-3 align-items-end">
          {/* 1. Search Name / Roll No */}
          <div className="col-12 col-md-4 col-lg-3">
            <label
              style={{
                fontSize: "0.78rem",
                color: "var(--tx2)",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Search Name / Roll No
            </label>
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
              }}
            >
              <Search size={14} style={{ color: "var(--tx3)", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search..."
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

          {/* 2. Language */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-2">
            <label
              style={{
                fontSize: "0.78rem",
                color: "var(--tx2)",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="code-topbar select"
              style={{
                width: "100%",
                height: "38px",
                padding: "0 10px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                background: "var(--bg)",
                border: "1px solid var(--bd)",
                color: "var(--tx)",
                outline: "none",
              }}
            >
              <option value="All">All Languages</option>
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
            </select>
          </div>

          {/* 3. Year */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-2">
            <label
              style={{
                fontSize: "0.78rem",
                color: "var(--tx2)",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Year
            </label>
            <select
              value={year}
              onChange={(e) => handleYearChange(e.target.value)}
              className="code-topbar select"
              style={{
                width: "100%",
                height: "38px",
                padding: "0 10px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                background: "var(--bg)",
                border: "1px solid var(--bd)",
                color: "var(--tx)",
                outline: "none",
              }}
            >
              <option value="All">All Years</option>
              <option value="First Year">First Year</option>
              <option value="Second Year">Second Year</option>
              <option value="Third Year">Third Year</option>
            </select>
          </div>

          {/* 4. Semester */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-2">
            <label
              style={{
                fontSize: "0.78rem",
                color: "var(--tx2)",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              disabled={year === "All"}
              className="code-topbar select"
              style={{
                width: "100%",
                height: "38px",
                padding: "0 10px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                background: "var(--bg)",
                border: "1px solid var(--bd)",
                color: year === "All" ? "var(--tx3)" : "var(--tx)",
                outline: "none",
                cursor: year === "All" ? "not-allowed" : "pointer",
                opacity: year === "All" ? 0.6 : 1,
              }}
            >
              <option value="All">All Semesters</option>
              {availableSemesterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Branch */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-2">
            <label
              style={{
                fontSize: "0.78rem",
                color: "var(--tx2)",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="code-topbar select"
              style={{
                width: "100%",
                height: "38px",
                padding: "0 10px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                background: "var(--bg)",
                border: "1px solid var(--bd)",
                color: "var(--tx)",
                outline: "none",
              }}
            >
              <option value="All">All Branches</option>
              <option value="Computer Technology">Computer Technology</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          {/* 6. Clear Button */}
          <div
            className="col-12 col-sm-6 col-md-4 col-lg-1 d-flex flex-column justify-content-end"
            style={{ minWidth: "80px" }}
          >
            <label
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                display: "block",
                marginBottom: "6px",
                visibility: "hidden",
                userSelect: "none",
              }}
            >
              &nbsp;
            </label>
            <button
              onClick={clearFilters}
              className="boc d-flex align-items-center justify-content-center gap-1 w-100"
              style={{
                height: "38px",
                borderRadius: "8px",
                fontSize: "0.78rem",
                padding: "0 10px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title="Reset all filters"
            >
              <X size={13} style={{ flexShrink: 0 }} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Table */}
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <span style={{ fontSize: "0.85rem", color: "var(--tx2)", fontWeight: 600 }}>
          Total Students: <span style={{ color: "var(--pur)" }}>{filteredStudents.length}</span>
        </span>
      </div>

      <StudentTable students={filteredStudents} onViewProfile={onViewProfile} />
    </TeacherLayout>
  );
}

export default Students;
