import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import StudentTable from "../../components/teacher/StudentTable";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import { mockTeacherData } from "../../utils/mockTeacherData";

function Students({ onViewProfile }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [year, setYear] = useState("All");
  const [branch, setBranch] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    setStudents(mockTeacherData.getStudents());
  }, []);

  const clearFilters = () => {
    setSearch("");
    setSubject("All");
    setYear("All");
    setBranch("All");
    setStatus("All");
  };

  // Filtering Logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase());
    
    const matchesSubject = subject === "All" || s.subject === subject;
    const matchesYear = year === "All" || s.year === year;
    const matchesBranch = branch === "All" || s.branch === branch;
    const matchesStatus = status === "All" || s.status === status;

    return matchesSearch && matchesSubject && matchesYear && matchesBranch && matchesStatus;
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
        <div className="row g-3">
          {/* Search */}
          <div className="col-12 col-md-4 col-lg-3">
            <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Search Name / Roll No
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--bg)",
                border: "1px solid var(--bd)",
                borderRadius: "8px",
                padding: "8px 12px",
                gap: "8px"
              }}
            >
              <Search size={14} style={{ color: "var(--tx3)" }} />
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
                  width: "100%"
                }}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="col-12 col-sm-6 col-md-2 col-lg-2">
            <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="code-topbar select"
              style={{ width: "100%", padding: "8px 10px", borderRadius: "8px" }}
            >
              <option value="All">All Subjects</option>
              <option value="Java Programming">Java Programming</option>
              <option value="Python Programming">Python Programming</option>
            </select>
          </div>

          {/* Year */}
          <div className="col-12 col-sm-6 col-md-2 col-lg-2">
            <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="code-topbar select"
              style={{ width: "100%", padding: "8px 10px", borderRadius: "8px" }}
            >
              <option value="All">All Years</option>
              <option value="2nd Year">Second Year</option>
              <option value="3rd Year">Third Year</option>
            </select>
          </div>

          {/* Branch */}
          <div className="col-12 col-sm-6 col-md-2 col-lg-2">
            <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="code-topbar select"
              style={{ width: "100%", padding: "8px 10px", borderRadius: "8px" }}
            >
              <option value="All">All Branches</option>
              <option value="Computer">Computer</option>
              <option value="IT">IT</option>
            </select>
          </div>

          {/* Status */}
          <div className="col-12 col-sm-6 col-md-2 col-lg-2">
            <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="code-topbar select"
              style={{ width: "100%", padding: "8px 10px", borderRadius: "8px" }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Button */}
          <div className="col-12 col-lg-1 d-flex align-items-end">
            <button
              onClick={clearFilters}
              className="boc d-flex align-items-center justify-content-center gap-1 py-2 w-100"
              style={{ borderRadius: "8px", fontSize: "0.78rem" }}
            >
              <X size={12} />
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
