import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  Activity,
  Terminal,
} from "lucide-react";
import { API_URL } from "../../utils/api";

// Components
import Sidebar from "../../components/teacher/Sidebar";
import DashboardNavbar from "../../components/DashboardNavbar";
import StatCard from "../../components/teacher/StatCard";
import TeacherLayout from "../../components/teacher/TeacherLayout";

// Sub-pages
import Students from "./Students";
import StudentProfile from "./StudentProfile";
import SubmissionDetails from "./SubmissionDetails";
import Submissions from "./Submissions";
import Analytics from "./Analytics";
import Profile from "./Profile";
import Settings from "./Settings";

// Utils
import { mockTeacherData } from "../../utils/mockTeacherData";

function TeacherDashboard({ currentUser, onLogout }) {
  console.log("TEACHER CURRENT USER:", currentUser);

  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected student
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  // Selected submission
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  // Selected student for student-centric submissions view
  const [selectedStudentForSubmissions, setSelectedStudentForSubmissions] = useState(null);

  // Practical filter
  const [practicalFilter, setPracticalFilter] = useState("");

  // Teacher profile
  const [profile, setProfile] = useState(() => ({
    ...mockTeacherData.getProfile(),
    ...currentUser,
  }));

  // Dashboard statistics (null = loading)
  const [stats, setStats] = useState({
    totalStudents: null,
    subjects: null,
    submissions: null,
    activeStudents: null,
  });
  const [statsError, setStatsError] = useState(null);

  // Fetch real dashboard counts from existing backend APIs
  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        // 1. Fetch total students (role=student) and active student count
        const studentsRes = await fetch(`${API_URL}/students`);
        const studentsData = await studentsRes.json();

        // 2. Fetch all submissions for total count and active students
        const subsRes = await fetch(`${API_URL}/submissions`);
        const subsData = await subsRes.json();

        if (cancelled) return;

        // Total students
        const totalStudents = (studentsData.success && Array.isArray(studentsData.students))
          ? studentsData.students.length
          : 0;

        // Assigned subjects: use the authenticated teacher's subjects from their profile
        const teacherSubjects = Array.isArray(currentUser?.subjects) ? currentUser.subjects : [];
        const subjects = teacherSubjects.length;

        // Total submissions
        const allSubs = (subsData.success && Array.isArray(subsData.submissions))
          ? subsData.submissions
          : [];
        const totalSubmissions = allSubs.length;

        // Active students: distinct students who submitted within the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const activeStudentIds = new Set();
        allSubs.forEach((sub) => {
          if (sub.submitted_at && sub.student_id) {
            const submittedAt = new Date(sub.submitted_at);
            if (!isNaN(submittedAt.getTime()) && submittedAt >= sevenDaysAgo) {
              activeStudentIds.add(sub.student_id);
            }
          }
        });
        const activeStudents = activeStudentIds.size;

        setStats({
          totalStudents,
          subjects,
          submissions: totalSubmissions,
          activeStudents,
        });
        setStatsError(null);
      } catch (err) {
        if (!cancelled) {
          console.error("Dashboard stats fetch error:", err);
          setStatsError("Failed to load dashboard statistics.");
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []); // run once on mount

  // Update teacher profile
  const handleProfileUpdateInHeader = (updated) => {
    setProfile(updated);
  };

  // =========================================================
  // VIEW STUDENT PROFILE
  // =========================================================
 const handleViewStudentProfile = (studentId) => {
  console.log("VIEW STUDENT PROFILE ID:", studentId);

  if (!studentId) {
    console.error("ERROR: Student ID is missing");
    return;
  }

  setSelectedStudentId(studentId);
  setActiveSection("student-profile");
};

  // =========================================================
  // VIEW SUBMISSION DETAILS
  // =========================================================
  const handleViewSubmissionDetails = (subId) => {
    setSelectedSubmissionId(subId);
    setActiveSection("submission-details");
  };


  // =========================================================
  // ANIMATION
  // =========================================================
  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--tx)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* =====================================================
          TOP NAVBAR
      ====================================================== */}
      <DashboardNavbar
        currentUser={{
          ...currentUser,
          name: profile.name,
        }}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        onSearch={
          activeSection === "submissions" ||
          activeSection === "students"
            ? setSearchQuery
            : null
        }
        searchValue={searchQuery}
      />

      {/* =====================================================
          MAIN BODY
      ====================================================== */}
      <div
        style={{
          display: "flex",
          flex: 1,
          position: "relative",
        }}
      >
        {/* =====================================================
            SIDEBAR
        ====================================================== */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={(sec) => {
            setSearchQuery("");
            setPracticalFilter("");
            setActiveSection(sec);
          }}
          onLogout={onLogout}
        />

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <main
          className="dashboard-main-canvas"
          style={{
            flex: 1,
            overflowX: "hidden",
            position: "relative",
            background: "var(--bg)",
            minHeight: "calc(100vh - 66px)",
          }}
        >
          <AnimatePresence mode="wait">

            {/* =================================================
                1. DASHBOARD
            ================================================== */}
            {activeSection === "dashboard" && (
              <TeacherLayout key="dashboard">

                {/* Welcome Banner */}
                <div
                  className="cyber-glass-panel mb-4"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "24px",
                    border:
                      "1px solid rgba(139, 92, 246, 0.25)",
                    background:
                      "linear-gradient(135deg, rgba(15, 10, 25, 0.65) 0%, rgba(20, 15, 30, 0.5) 100%)",
                    minHeight: "220px",
                    padding: "36px 48px",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "28px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      background:
                        "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />

                  <div className="teacher-hero-grid">

                    {/* Left */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        className="d-inline-flex align-items-center gap-2 px-3 py-1"
                        style={{
                          background:
                            "rgba(139,92,246,0.08)",
                          border:
                            "1px solid rgba(139,92,246,0.2)",
                          borderRadius: "100px",
                          fontSize: "0.75rem",
                          color: "var(--pur)",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: "24px",
                        }}
                      >
                        <Activity size={12} />
                        <span>Teacher Portal</span>
                      </div>

                      <h2
                        style={{
                          fontSize:
                            "clamp(1.75rem, 3.5vw, 2.25rem)",
                          fontWeight: 800,
                          color: "var(--tx)",
                          marginBottom: "18px",
                          lineHeight: 1.2,
                        }}
                      >
                        Welcome Back,{" "}
                        <span
                          style={{
                            background:
                              "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: 800,
                          }}
                        >
                          {profile.name}
                        </span>{" "}
                        👋
                      </h2>

                      <p
                        style={{
                          color: "var(--tx2)",
                          fontSize: "0.92rem",
                          fontWeight: 500,
                          margin: 0,
                          maxWidth: "550px",
                          lineHeight: 1.5,
                        }}
                      >
                        Manage your students, monitor submissions
                        and track coding progress.
                      </p>
                    </div>

                    {/* Right Artwork */}
                    <div className="teacher-hero-artwork-wrapper">
                      <div className="teacher-hero-artwork">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 200 160"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="130"
                            cy="80"
                            r="40"
                            fill="var(--pur)"
                            opacity="0.12"
                            filter="blur(12px)"
                          />

                          <text
                            x="25"
                            y="45"
                            fill="var(--pur)"
                            opacity="0.25"
                            fontSize="12"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            &lt;/&gt;
                          </text>

                          <text
                            x="155"
                            y="40"
                            fill="#a78bfa"
                            opacity="0.2"
                            fontSize="14"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {"{"}
                          </text>

                          <text
                            x="175"
                            y="110"
                            fill="var(--pur)"
                            opacity="0.15"
                            fontSize="14"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {"}"}
                          </text>

                          <text
                            x="35"
                            y="120"
                            fill="#a78bfa"
                            opacity="0.1"
                            fontSize="10"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            101
                          </text>

                          <line
                            x1="20"
                            y1="140"
                            x2="180"
                            y2="140"
                            stroke="var(--bd)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />

                          <path
                            d="M 110 128 L 150 128 L 156 135 L 104 135 Z"
                            fill="var(--bg3)"
                            stroke="var(--bd)"
                            strokeWidth="1.2"
                          />

                          <path
                            d="M 126 100 L 153 103 L 150 128 L 126 128 Z"
                            fill="rgba(139,92,246,0.12)"
                            stroke="var(--pur)"
                            strokeWidth="1.2"
                          />

                          <circle
                            cx="80"
                            cy="70"
                            r="12"
                            fill="var(--sf)"
                            stroke="var(--bd)"
                            strokeWidth="1.2"
                          />

                          <path
                            d="M 75 69 Q 80 71 85 69"
                            fill="none"
                            stroke="var(--tx)"
                            strokeWidth="1"
                          />

                          <circle
                            cx="76"
                            cy="69"
                            r="2.2"
                            fill="none"
                            stroke="var(--tx)"
                            strokeWidth="0.8"
                          />

                          <circle
                            cx="84"
                            cy="69"
                            r="2.2"
                            fill="none"
                            stroke="var(--tx)"
                            strokeWidth="0.8"
                          />

                          <path
                            d="M 68 67 Q 80 54 92 67 Q 85 61 68 67 Z"
                            fill="var(--pur)"
                            opacity="0.8"
                          />

                          <path
                            d="M 55 140 C 55 110, 70 95, 88 95 C 97 95, 106 103, 109 113 L 99 120 C 96 113, 90 110, 85 110 C 76 110, 71 117, 71 140 Z"
                            fill="var(--sf)"
                            stroke="var(--bd)"
                            strokeWidth="1.2"
                          />

                          <path
                            d="M 91 106 C 99 106, 112 115, 118 123 L 112 127"
                            fill="none"
                            stroke="var(--tx2)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="teacher-stats-grid" style={{ marginTop: "28px" }}>

                  {statsError && (
                    <div
                      style={{
                        gridColumn: "1 / -1",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#fca5a5",
                        fontSize: "0.82rem",
                        marginBottom: "4px",
                      }}
                    >
                      ⚠️ {statsError}
                    </div>
                  )}

                  <StatCard
                    label="Total Students"
                    value={stats.totalStudents !== null ? stats.totalStudents : "—"}
                    icon={Users}
                    color="#8b5cf6"
                    bg="rgba(139,92,246,0.08)"
                    border="rgba(139,92,246,0.2)"
                    subtext="View all students →"
                    onClick={() =>
                      setActiveSection("students")
                    }
                  />

                  <StatCard
                    label="Assigned Subjects"
                    value={stats.subjects !== null ? stats.subjects : "—"}
                    icon={BookOpen}
                    color="#3b82f6"
                    bg="rgba(59,130,246,0.08)"
                    border="rgba(59,130,246,0.2)"
                    subtext="View subjects →"
                  />

                  <StatCard
                    label="Total Submissions"
                    value={stats.submissions !== null ? stats.submissions : "—"}
                    icon={Terminal}
                    color="#10b981"
                    bg="rgba(16,185,129,0.08)"
                    border="rgba(16,185,129,0.2)"
                    subtext="View submissions →"
                    onClick={() =>
                      setActiveSection("submissions")
                    }
                  />

                  <StatCard
                    label="Active Students"
                    value={stats.activeStudents !== null ? stats.activeStudents : "—"}
                    icon={Activity}
                    color="#fbbf24"
                    bg="rgba(245,158,11,0.08)"
                    border="rgba(245,158,11,0.2)"
                    subtext="Last 7 days"
                  />
                </div>


              </TeacherLayout>
            )}

            {/* =================================================
                2. STUDENTS
            ================================================== */}
            {activeSection === "students" && (
              <Students
                onViewProfile={handleViewStudentProfile}
                navbarSearchQuery={searchQuery}
              />
            )}

            {/* =================================================
                3. STUDENT PROFILE
            ================================================== */}
        {activeSection === "student-profile" && selectedStudentId && (
  <StudentProfile
    studentId={selectedStudentId}
    onBack={() => {
      setSelectedStudentId(null);
      setActiveSection("students");
    }}
    onViewSubmission={handleViewSubmissionDetails}
  />
)}

            {/* =================================================
                4. SUBMISSIONS (STUDENT-CENTRIC)
            ================================================== */}
            {activeSection === "submissions" && (
              <Submissions
                onViewSubmissionDetails={handleViewSubmissionDetails}
                navbarSearchQuery={searchQuery}
                currentUser={currentUser}
                selectedStudentId={selectedStudentForSubmissions}
                onSelectStudent={setSelectedStudentForSubmissions}
              />
            )}

            {/* =================================================
                5. SUBMISSION DETAILS
            ================================================== */}
            {activeSection === "submission-details" && (
              <SubmissionDetails
                submissionId={selectedSubmissionId}
                onBack={() => {
                  if (selectedStudentId) {
                    setActiveSection("student-profile");
                  } else {
                    setActiveSection("submissions");
                  }
                }}
              />
            )}

            {/* =================================================
                6. ANALYTICS
            ================================================== */}
            {activeSection === "analytics" && (
              <Analytics currentUser={currentUser} />
            )}

            {/* =================================================
                8. PROFILE
            ================================================== */}
            {activeSection === "profile" && (
              <Profile
                currentUser={currentUser}
                onProfileUpdate={
                  handleProfileUpdateInHeader
                }
                onNavigateSettings={() => setActiveSection("settings")}
              />
            )}

            {/* =================================================
                9. SETTINGS
            ================================================== */}
            {activeSection === "settings" && (
              <Settings currentUser={currentUser} onLogout={onLogout} />
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default TeacherDashboard;