import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  Search,
  RefreshCw,
  Menu,
  X,
  ShieldCheck,
  Award,
  Layers,
  CheckCircle2,
  Server,
  Key
} from "lucide-react";
import logob from "../assets/images/logob.png";
import logow from "../assets/images/logow.png";

function AdminDashboard({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [rankings, setRankings] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Search states
  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");

  const getAdminToken = () => {
    return localStorage.getItem("cryptocode_admin_token") || "";
  };

  const getAuthHeaders = () => {
    const token = getAdminToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Fetch real ranking data from backend
  const fetchRankings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/admin/rankings", {
        headers: getAuthHeaders(),
      });
      if (res.status === 403) {
        handleLogoutClick();
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setRankings(data);
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Failed to load rankings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real students from backend
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/students", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error("Failed to load admin students:", err);
    }
  };

  // Fetch real teachers from backend
  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/teachers", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.teachers)) {
        setTeachers(data.teachers);
      }
    } catch (err) {
      console.error("Failed to load admin teachers:", err);
    }
  };

  // Fetch subjects from backend
  const fetchSubjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/subjects", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      }
    } catch (err) {
      console.error("Failed to load admin subjects:", err);
    }
  };

  useEffect(() => {
    fetchRankings();
    fetchStudents();
    fetchTeachers();
    fetchSubjects();
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("cryptocode_admin_token");
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("cryptocode_user");
      navigate("/");
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Highest submission count for relative progress bar calculation
  const highestCount = rankings.length > 0 ? Math.max(...rankings.map((r) => r.submissionCount)) : 0;
  const totalSubmissions = rankings.reduce((acc, curr) => acc + (curr.submissionCount || 0), 0);

  // Filtered lists
  const filteredStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.roll_no && s.roll_no.toLowerCase().includes(q)) ||
      (s.branch && s.branch.toLowerCase().includes(q))
    );
  });

  const filteredTeachers = teachers.filter((t) => {
    const q = teacherSearch.toLowerCase();
    const subjectsStr = Array.isArray(t.subjects) ? t.subjects.join(" ").toLowerCase() : "";
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.department && t.department.toLowerCase().includes(q)) ||
      subjectsStr.includes(q)
    );
  });

  const filteredSubjects = subjects.filter((sb) => {
    const q = subjectSearch.toLowerCase();
    return (
      sb.name.toLowerCase().includes(q) ||
      sb.code.toLowerCase().includes(q) ||
      sb.category.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--tx)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* TOPBAR */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(13, 13, 20, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--bd)",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="boc d-lg-none"
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              color: "var(--tx)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={logob} alt="CryptoCode" style={{ height: "36px", width: "auto" }} />
            <img src={logow} alt="CryptoCode Text" style={{ height: "24px", width: "auto" }} />
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#c084fc",
                background: "rgba(192, 132, 252, 0.12)",
                border: "1px solid rgba(192, 132, 252, 0.3)",
                padding: "2px 8px",
                borderRadius: "6px",
                letterSpacing: "0.08em",
                marginLeft: "6px",
              }}
            >
              ADMIN
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              borderRadius: "10px",
              background: "var(--sf)",
              border: "1px solid var(--bd)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
              }}
            />
            <span style={{ fontSize: "0.82rem", color: "var(--tx2)", fontWeight: 600 }}>
              ccAdmin
            </span>
          </div>

          <button
            onClick={handleLogoutClick}
            className="boc"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#f87171",
              borderColor: "rgba(239, 68, 68, 0.3)",
              cursor: "pointer",
            }}
            title="Admin Logout"
          >
            <LogOut size={15} />
            <span className="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: "240px",
            flexShrink: 0,
            background: "var(--sf)",
            borderRight: "1px solid var(--bd)",
            padding: "20px 12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "sticky",
            top: "64px",
            height: "calc(100vh - 64px)",
            zIndex: 40,
            transition: "transform 0.3s ease",
          }}
          className={`admin-sidebar ${mobileMenuOpen ? "open" : ""}`}
        >
          <div>
            <div
              style={{
                fontSize: "0.68rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--tx3)",
                padding: "0 14px 14px",
                fontWeight: 700,
              }}
            >
              Admin Menu
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      fontSize: "0.88rem",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#ffffff" : "var(--tx2)",
                      background: isActive ? "var(--grad)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: isActive ? "0 4px 18px rgba(139, 92, 246, 0.35)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div style={{ padding: "10px 0", borderTop: "1px solid var(--bd)" }}>
              <button
                onClick={handleLogoutClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  color: "#f87171",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--tx3)",
                textAlign: "center",
                paddingTop: "10px",
                borderTop: "1px solid var(--bd)",
              }}
            >
              CryptoCode v2.0 • Admin Console
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main
          style={{
            flex: 1,
            padding: "28px 24px",
            maxWidth: "1350px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* ================= SECTION 1: DASHBOARD HOME ================= */}
          {activeSection === "dashboard" && (
            <div>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <h1 style={{ fontSize: "1.65rem", fontWeight: 700, margin: "0 0 4px" }}>
                    Admin Dashboard
                  </h1>
                  <p style={{ fontSize: "0.86rem", color: "var(--tx2)", margin: 0 }}>
                    Real-time platform insights and live student submission rankings.
                  </p>
                </div>

                <button
                  onClick={fetchRankings}
                  disabled={loading}
                  className="boc"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw
                    size={14}
                    style={{
                      transform: loading ? "rotate(180deg)" : "none",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <span>Refresh Rankings</span>
                </button>
              </div>

              {/* Quick Platform Metrics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom: "28px",
                }}
              >
                <div
                  className="cyber-card"
                  style={{
                    padding: "18px 20px",
                    borderRadius: "14px",
                    background: "var(--sf)",
                    border: "1px solid var(--bd)",
                  }}
                >
                  <div style={{ fontSize: "0.78rem", color: "var(--tx3)", fontWeight: 600, marginBottom: "6px" }}>
                    Total Registered Students
                  </div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "var(--tx)" }}>
                    {rankings.length || students.length || 0}
                  </div>
                </div>

                <div
                  className="cyber-card"
                  style={{
                    padding: "18px 20px",
                    borderRadius: "14px",
                    background: "var(--sf)",
                    border: "1px solid var(--bd)",
                  }}
                >
                  <div style={{ fontSize: "0.78rem", color: "var(--tx3)", fontWeight: 600, marginBottom: "6px" }}>
                    Total Code Submissions
                  </div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "var(--pur)" }}>
                    {totalSubmissions}
                  </div>
                </div>

                <div
                  className="cyber-card"
                  style={{
                    padding: "18px 20px",
                    borderRadius: "14px",
                    background: "var(--sf)",
                    border: "1px solid var(--bd)",
                  }}
                >
                  <div style={{ fontSize: "0.78rem", color: "var(--tx3)", fontWeight: 600, marginBottom: "6px" }}>
                    Top Performer
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fbbf24", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {rankings.length > 0 && highestCount > 0 ? `🥇 ${rankings[0].studentName}` : "No submissions yet"}
                  </div>
                </div>

                <div
                  className="cyber-card"
                  style={{
                    padding: "18px 20px",
                    borderRadius: "14px",
                    background: "var(--sf)",
                    border: "1px solid var(--bd)",
                  }}
                >
                  <div style={{ fontSize: "0.78rem", color: "var(--tx3)", fontWeight: 600, marginBottom: "6px" }}>
                    Registered Teachers
                  </div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 700, color: "#38bdf8" }}>
                    {teachers.length || 0}
                  </div>
                </div>
              </div>

              {/* Student Progress Ranking Card */}
              <div
                className="cyber-card"
                style={{
                  background: "var(--sf)",
                  border: "1px solid var(--bd)",
                  borderRadius: "18px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "20px",
                    borderBottom: "1px solid var(--bd)",
                    paddingBottom: "16px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        margin: "0 0 4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Award size={20} style={{ color: "#fbbf24" }} />
                      Student Progress Ranking
                    </h2>
                    <p style={{ fontSize: "0.82rem", color: "var(--tx3)", margin: 0 }}>
                      Live ranking based directly on total verified code submissions in the database.
                    </p>
                  </div>

                  <span style={{ fontSize: "0.75rem", color: "var(--tx3)" }}>
                    Updated {lastRefreshed.toLocaleTimeString()}
                  </span>
                </div>

                {loading && rankings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "var(--tx3)" }}>
                    Loading real ranking data from database...
                  </div>
                ) : rankings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "var(--tx3)" }}>
                    No student submissions found in the database.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {rankings.map((student) => {
                      const percentage =
                        highestCount > 0
                          ? Math.max(3, Math.round((student.submissionCount / highestCount) * 100))
                          : 0;

                      const getRankBadge = (rank) => {
                        if (rank === 1) return <span style={{ fontSize: "1.25rem" }}>🥇</span>;
                        if (rank === 2) return <span style={{ fontSize: "1.25rem" }}>🥈</span>;
                        if (rank === 3) return <span style={{ fontSize: "1.25rem" }}>🥉</span>;
                        return (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "26px",
                              height: "26px",
                              borderRadius: "8px",
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid var(--bd)",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              color: "var(--tx3)",
                            }}
                          >
                            #{rank}
                          </span>
                        );
                      };

                      return (
                        <div
                          key={student.studentId || student.rank}
                          style={{
                            padding: "14px 18px",
                            borderRadius: "14px",
                            background:
                              student.rank === 1
                                ? "linear-gradient(135deg, rgba(234, 179, 8, 0.08), rgba(139, 92, 246, 0.05))"
                                : student.rank === 2
                                ? "linear-gradient(135deg, rgba(148, 163, 184, 0.08), rgba(139, 92, 246, 0.05))"
                                : student.rank === 3
                                ? "linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(139, 92, 246, 0.05))"
                                : "rgba(10, 10, 18, 0.5)",
                            border:
                              student.rank === 1
                                ? "1px solid rgba(234, 179, 8, 0.35)"
                                : student.rank === 2
                                ? "1px solid rgba(148, 163, 184, 0.25)"
                                : student.rank === 3
                                ? "1px solid rgba(217, 119, 6, 0.25)"
                                : "1px solid var(--bd)",
                            transition: "all 0.2s",
                          }}
                        >
                          {/* Student Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "10px",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              {getRankBadge(student.rank)}
                              <span
                                style={{
                                  fontSize: "0.98rem",
                                  fontWeight: 700,
                                  color: student.rank === 1 ? "#fef08a" : "var(--tx)",
                                }}
                              >
                                {student.studentName}
                              </span>
                              {student.rollNo && student.rollNo !== "N/A" && (
                                <span
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.75rem",
                                    color: "var(--tx3)",
                                  }}
                                >
                                  ({student.rollNo})
                                </span>
                              )}
                            </div>

                            <span
                              style={{
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: student.submissionCount > 0 ? "var(--tx)" : "var(--tx3)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {student.submissionCount} {student.submissionCount === 1 ? "submission" : "submissions"}
                            </span>
                          </div>

                          {/* Progress Bar Container */}
                          <div
                            style={{
                              width: "100%",
                              height: "10px",
                              background: "rgba(255, 255, 255, 0.06)",
                              borderRadius: "100px",
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: student.submissionCount > 0 ? `${percentage}%` : "0%",
                                height: "100%",
                                background:
                                  student.rank === 1
                                    ? "linear-gradient(90deg, #f59e0b, #eab308)"
                                    : student.rank === 2
                                    ? "linear-gradient(90deg, #94a3b8, #cbd5e1)"
                                    : student.rank === 3
                                    ? "linear-gradient(90deg, #d97706, #f97316)"
                                    : "var(--grad)",
                                borderRadius: "100px",
                                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                boxShadow:
                                  student.submissionCount > 0
                                    ? "0 0 10px rgba(139, 92, 246, 0.5)"
                                    : "none",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= SECTION 2: STUDENTS ================= */}
          {activeSection === "students" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h1 style={{ fontSize: "1.65rem", fontWeight: 700, margin: "0 0 4px" }}>
                    Registered Students
                  </h1>
                  <p style={{ fontSize: "0.86rem", color: "var(--tx2)", margin: 0 }}>
                    Directory of registered students fetched from the CryptoCode database.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--sf)",
                    border: "1px solid var(--bd)",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    width: "280px",
                  }}
                >
                  <Search size={15} style={{ color: "var(--tx3)" }} />
                  <input
                    type="text"
                    placeholder="Search by name, roll no, branch..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    style={{
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: "var(--tx)",
                      fontSize: "0.85rem",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              {/* Table */}
              <div
                className="cyber-card"
                style={{
                  background: "var(--sf)",
                  border: "1px solid var(--bd)",
                  borderRadius: "18px",
                  overflow: "hidden",
                }}
              >
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid var(--bd)" }}>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Roll No</th>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Student Name</th>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Email</th>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Branch / Dept</th>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Submissions</th>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ padding: "32px", textAlign: "center", color: "var(--tx3)" }}>
                            No students found.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((st) => (
                          <tr key={st.id} style={{ borderBottom: "1px solid var(--bd)" }}>
                            <td style={{ padding: "14px 18px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "var(--tx2)" }}>
                              {st.roll_no || "N/A"}
                            </td>
                            <td style={{ padding: "14px 18px", fontWeight: 600, color: "var(--tx)" }}>
                              {st.name || "N/A"}
                            </td>
                            <td style={{ padding: "14px 18px", fontSize: "0.85rem", color: "var(--tx2)" }}>
                              {st.email || "N/A"}
                            </td>
                            <td style={{ padding: "14px 18px", fontSize: "0.85rem", color: "var(--tx2)" }}>
                              {st.branch || st.department || "General"}
                            </td>
                            <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--pur)", fontFamily: "'JetBrains Mono', monospace" }}>
                              {st.submissionCount || 0}
                            </td>
                            <td style={{ padding: "14px 18px" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  fontSize: "0.74rem",
                                  fontWeight: 600,
                                  background: "rgba(34, 197, 94, 0.12)",
                                  color: "#4ade80",
                                  border: "1px solid rgba(34, 197, 94, 0.25)",
                                }}
                              >
                                <CheckCircle2 size={12} />
                                Active
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 3: TEACHERS ================= */}
          {activeSection === "teachers" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h1 style={{ fontSize: "1.65rem", fontWeight: 700, margin: "0 0 4px" }}>
                    Faculty & Teachers
                  </h1>
                  <p style={{ fontSize: "0.86rem", color: "var(--tx2)", margin: 0 }}>
                    Overview of instructor accounts and their assigned subjects.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--sf)",
                    border: "1px solid var(--bd)",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    width: "280px",
                  }}
                >
                  <Search size={15} style={{ color: "var(--tx3)" }} />
                  <input
                    type="text"
                    placeholder="Search teachers or subjects..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    style={{
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: "var(--tx)",
                      fontSize: "0.85rem",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              {/* Table */}
              <div
                className="cyber-card"
                style={{
                  background: "var(--sf)",
                  border: "1px solid var(--bd)",
                  borderRadius: "18px",
                  overflow: "hidden",
                }}
              >
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid var(--bd)" }}>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Teacher Name</th>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Email / Username</th>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Department</th>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Assigned Subjects</th>
                        <th style={{ padding: "14px 18px", fontSize: "0.75rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: "32px", textAlign: "center", color: "var(--tx3)" }}>
                            No teachers found.
                          </td>
                        </tr>
                      ) : (
                        filteredTeachers.map((tc) => (
                          <tr key={tc.id} style={{ borderBottom: "1px solid var(--bd)" }}>
                            <td style={{ padding: "14px 18px", fontWeight: 600, color: "var(--tx)" }}>
                              {tc.name}
                            </td>
                            <td style={{ padding: "14px 18px", fontSize: "0.85rem", color: "var(--tx2)" }}>
                              {tc.email}
                            </td>
                            <td style={{ padding: "14px 18px", fontSize: "0.85rem", color: "var(--tx2)" }}>
                              {tc.department}
                            </td>
                            <td style={{ padding: "14px 18px" }}>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {tc.subjects.map((sub, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      fontSize: "0.72rem",
                                      background: "rgba(139, 92, 246, 0.12)",
                                      color: "#c084fc",
                                      border: "1px solid rgba(139, 92, 246, 0.25)",
                                      borderRadius: "6px",
                                      padding: "2px 8px",
                                    }}
                                  >
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td style={{ padding: "14px 18px" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  fontSize: "0.74rem",
                                  fontWeight: 600,
                                  background: "rgba(34, 197, 94, 0.12)",
                                  color: "#4ade80",
                                  border: "1px solid rgba(34, 197, 94, 0.25)",
                                }}
                              >
                                <CheckCircle2 size={12} />
                                {tc.status || "Active"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 4: SUBJECTS ================= */}
          {activeSection === "subjects" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h1 style={{ fontSize: "1.65rem", fontWeight: 700, margin: "0 0 4px" }}>
                    Subjects Curriculum
                  </h1>
                  <p style={{ fontSize: "0.86rem", color: "var(--tx2)", margin: 0 }}>
                    Active programming tracks and coursework in the CryptoCode platform.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--sf)",
                    border: "1px solid var(--bd)",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    width: "260px",
                  }}
                >
                  <Search size={15} style={{ color: "var(--tx3)" }} />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    style={{
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: "var(--tx)",
                      fontSize: "0.85rem",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              {/* Grid of Subject Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "18px",
                }}
              >
                {filteredSubjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="cyber-card"
                    style={{
                      background: "var(--sf)",
                      border: "1px solid var(--bd)",
                      borderRadius: "16px",
                      padding: "22px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--pur)",
                            background: "rgba(139, 92, 246, 0.12)",
                            border: "1px solid rgba(139, 92, 246, 0.25)",
                            borderRadius: "6px",
                            padding: "2px 8px",
                          }}
                        >
                          {sub.code}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--tx3)" }}>
                          {sub.category}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 8px" }}>
                        {sub.name}
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--tx2)", margin: 0 }}>
                        Target Language: <strong>{sub.language}</strong>
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "16px",
                        marginTop: "16px",
                        borderTop: "1px solid var(--bd)",
                        fontSize: "0.8rem",
                        color: "var(--tx3)",
                      }}
                    >
                      <span>{sub.students} Enrolled Students</span>
                      <span>{sub.teachers} Teachers</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 5: SETTINGS ================= */}
          {activeSection === "settings" && (
            <div style={{ maxWidth: "700px" }}>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "1.65rem", fontWeight: 700, margin: "0 0 4px" }}>
                  Admin Settings
                </h1>
                <p style={{ fontSize: "0.86rem", color: "var(--tx2)", margin: 0 }}>
                  Overview of current administrative account and system status.
                </p>
              </div>

              <div
                className="cyber-card"
                style={{
                  background: "var(--sf)",
                  border: "1px solid var(--bd)",
                  borderRadius: "18px",
                  padding: "26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "var(--grad)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                      Administrator Account
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--tx3)", margin: "2px 0 0" }}>
                      Authenticated through secure environment credentials
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    paddingTop: "14px",
                    borderTop: "1px solid var(--bd)",
                  }}
                >
                  <div style={{ background: "rgba(10, 10, 18, 0.6)", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--bd)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                      Admin Username
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--tx)", marginTop: "4px", fontFamily: "'JetBrains Mono', monospace" }}>
                      ccAdmin
                    </div>
                  </div>

                  <div style={{ background: "rgba(10, 10, 18, 0.6)", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--bd)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                      Role Authority
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--pur)", marginTop: "4px" }}>
                      ADMIN
                    </div>
                  </div>

                  <div style={{ background: "rgba(10, 10, 18, 0.6)", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--bd)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                      Backend Connection
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#4ade80", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Server size={14} /> Connected
                    </div>
                  </div>

                  <div style={{ background: "rgba(10, 10, 18, 0.6)", padding: "12px 16px", borderRadius: "10px", border: "1px solid var(--bd)" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                      Access Control
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--tx)", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Key size={14} /> Strict RBAC
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: "14px",
                    borderTop: "1px solid var(--bd)",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={handleLogoutClick}
                    className="boc"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#f87171",
                      borderColor: "rgba(239, 68, 68, 0.3)",
                      cursor: "pointer",
                    }}
                  >
                    <LogOut size={15} />
                    <span>Log Out from Admin</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .admin-sidebar {
            position: fixed !important;
            top: 64px !important;
            bottom: 0 !important;
            left: 0 !important;
            transform: translateX(-100%);
            box-shadow: 10px 0 30px rgba(0,0,0,0.7);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
