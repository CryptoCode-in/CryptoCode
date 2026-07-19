import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BookOpen, Clock, Activity, Terminal, AlertTriangle, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Components
import Sidebar from "../../components/teacher/Sidebar";
import DashboardNavbar from "../../components/DashboardNavbar";
import StatCard from "../../components/teacher/StatCard";
import ActivityCard from "../../components/teacher/ActivityCard";
import ChartCard from "../../components/teacher/ChartCard";
import SubmissionCard from "../../components/teacher/SubmissionCard";
import TeacherLayout from "../../components/teacher/TeacherLayout";

// Sub-pages
import Students from "./Students";
import StudentProfile from "./StudentProfile";
import SubmissionDetails from "./SubmissionDetails";
import Analytics from "./Analytics";
import Profile from "./Profile";
import Settings from "./Settings";
import Practicals from "./Practicals";

// Utils
import { mockTeacherData } from "../../utils/mockTeacherData";

function TeacherDashboard({ currentUser, onLogout, isDark, onToggleTheme }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drill-down states
  const [selectedStudentRoll, setSelectedStudentRoll] = useState(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [practicalFilter, setPracticalFilter] = useState(""); // Filter submissions by practical title
  
  // Profile state for header syncing
  const [profile, setProfile] = useState(() => mockTeacherData.getProfile());

  // Statistics summaries
  const [stats, setStats] = useState({
    totalStudents: 180,
    subjects: 2,
    submissions: 1842,
    activeStudents: 152
  });

  const [activities, setActivities] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);

  useEffect(() => {
    // Force dark theme as CryptoCode default if not active
    const root = document.getElementById("htmlRoot") || document.documentElement;
    if (!root.classList.contains("light") && !isDark) {
      // In case theme was toggled light, respect it, otherwise default dark
    }

    setActivities(mockTeacherData.getActivities());
    setWeeklyTrend(mockTeacherData.getAnalytics().weeklyTrend);
    setAllSubmissions(mockTeacherData.getSubmissions());
  }, [activeSection]);

  const handleProfileUpdateInHeader = (updated) => {
    setProfile(updated);
  };

  const handleViewStudentProfile = (rollNo) => {
    setSelectedStudentRoll(rollNo);
    setActiveSection("student-profile");
  };

  const handleViewSubmissionDetails = (subId) => {
    setSelectedSubmissionId(subId);
    setActiveSection("submission-details");
  };

  const handleViewSubmissionsForPractical = (practicalTitle) => {
    setPracticalFilter(practicalTitle);
    setActiveSection("submissions");
  };

  // Filter global submissions list based on query and practical filters
  const filteredSubmissions = allSubmissions.filter((sub) => {
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.practicalTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPractical = !practicalFilter || sub.practicalTitle === practicalFilter;
    
    return matchesSearch && matchesPractical;
  });

  // Motion layout presets
  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
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
      {/* Top sticky Navbar */}
      <DashboardNavbar
        currentUser={{ ...currentUser, name: profile.name }}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        onSearch={activeSection === "submissions" || activeSection === "students" ? setSearchQuery : null}
        searchValue={searchQuery}
      />

      {/* Main content body */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Left Sidebar navigation */}
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={(sec) => {
            setSearchQuery("");
            setPracticalFilter("");
            setActiveSection(sec);
          }} 
          onLogout={onLogout} 
        />

        {/* Content canvas */}
        <main 
          className="dashboard-main-canvas" 
          style={{ 
            flex: 1, 
            overflowX: "hidden", 
            position: "relative",
            background: "var(--bg)",
            minHeight: "calc(100vh - 66px)"
          }}
        >
          <AnimatePresence mode="wait">
            
            {/* View 1: Main Dashboard Overview */}
            {activeSection === "dashboard" && (
              <TeacherLayout key="dashboard">
                {/* Redesigned Welcome Banner */}
                <div 
                  className="cyber-glass-panel mb-4"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "24px",
                    border: "1px solid rgba(139, 92, 246, 0.25)",
                    background: "linear-gradient(135deg, rgba(15, 10, 25, 0.65) 0%, rgba(20, 15, 30, 0.5) 100%)",
                    minHeight: "220px",
                    padding: "36px 48px",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {/* Background subtle radial glow */}
                  <div 
                    style={{
                      position: "absolute",
                      top: 0, right: 0, bottom: 0, left: 0,
                      background: "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)",
                      pointerEvents: "none",
                      zIndex: 1
                    }}
                  />

                  {/* 2-Column Grid */}
                  <div className="teacher-hero-grid">
                    {/* Left Column (60% width) */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                      <div
                        className="d-inline-flex align-items-center gap-2 px-3 py-1"
                        style={{
                          background: "rgba(139,92,246,0.08)",
                          border: "1px solid rgba(139,92,246,0.2)",
                          borderRadius: "100px",
                          fontSize: "0.75rem",
                          color: "var(--pur)",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: "24px"
                        }}
                      >
                        <Activity size={12} />
                        <span>Teacher Portal</span>
                      </div>

                      <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", fontWeight: 800, color: "var(--tx)", marginBottom: "18px", lineHeight: 1.2 }}>
                        Welcome Back, <span style={{ background: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>{profile.name}</span> 👋
                      </h2>
                      
                      <p style={{ color: "var(--tx2)", fontSize: "0.92rem", fontWeight: 500, margin: 0, maxWidth: "550px", lineHeight: 1.5 }}>
                        Manage your students, monitor submissions and track coding progress.
                      </p>
                    </div>

                    {/* Right Column (40% width) */}
                    <div className="teacher-hero-artwork-wrapper">
                      <div className="teacher-hero-artwork">
                        <svg width="100%" height="100%" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Ambient glow background inside SVG */}
                          <circle cx="130" cy="80" r="40" fill="var(--pur)" opacity="0.12" filter="blur(12px)" />
                          
                          {/* Floating code braces */}
                          <text x="25" y="45" fill="var(--pur)" opacity="0.25" fontSize="12" fontFamily="monospace" fontWeight="bold">&lt;/&gt;</text>
                          <text x="155" y="40" fill="#a78bfa" opacity="0.2" fontSize="14" fontFamily="monospace" fontWeight="bold">{"{"}</text>
                          <text x="175" y="110" fill="var(--pur)" opacity="0.15" fontSize="14" fontFamily="monospace" fontWeight="bold">{"}"}</text>
                          <text x="35" y="120" fill="#a78bfa" opacity="0.1" fontSize="10" fontFamily="monospace" fontWeight="bold">101</text>

                          {/* Desk Surface Line */}
                          <line x1="20" y1="140" x2="180" y2="140" stroke="var(--bd)" strokeWidth="1.5" strokeLinecap="round" />

                          {/* Laptop */}
                          {/* Base */}
                          <path d="M 110 128 L 150 128 L 156 135 L 104 135 Z" fill="var(--bg3)" stroke="var(--bd)" strokeWidth="1.2" />
                          {/* Screen */}
                          <path d="M 126 100 L 153 103 L 150 128 L 126 128 Z" fill="rgba(139,92,246,0.12)" stroke="var(--pur)" strokeWidth="1.2" />
                          <path d="M 126 100 L 153 103 L 150 128 L 126 128 Z" fill="var(--pur)" opacity="0.08" filter="blur(2px)" />

                          {/* Teacher Figure */}
                          {/* Head */}
                          <circle cx="80" cy="70" r="12" fill="var(--sf)" stroke="var(--bd)" strokeWidth="1.2" />
                          {/* Glasses */}
                          <path d="M 75 69 Q 80 71 85 69" fill="none" stroke="var(--tx)" strokeWidth="1" />
                          <circle cx="76" cy="69" r="2.2" fill="none" stroke="var(--tx)" strokeWidth="0.8" />
                          <circle cx="84" cy="69" r="2.2" fill="none" stroke="var(--tx)" strokeWidth="0.8" />
                          {/* Hair */}
                          <path d="M 68 67 Q 80 54 92 67 Q 85 61 68 67 Z" fill="var(--pur)" opacity="0.8" />
                          
                          {/* Torso */}
                          <path d="M 55 140 C 55 110, 70 95, 88 95 C 97 95, 106 103, 109 113 L 99 120 C 96 113, 90 110, 85 110 C 76 110, 71 117, 71 140 Z" fill="var(--sf)" stroke="var(--bd)" strokeWidth="1.2" />
                          {/* Arm typing */}
                          <path d="M 91 106 C 99 106, 112 115, 118 123 L 112 127" fill="none" stroke="var(--tx2)" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Card Grid */}
                <div className="teacher-stats-grid">
                  <StatCard
                    label="Total Students"
                    value={stats.totalStudents}
                    icon={Users}
                    color="#8b5cf6"
                    bg="rgba(139,92,246,0.08)"
                    border="rgba(139,92,246,0.2)"
                    subtext="View all students →"
                    onClick={() => setActiveSection("students")}
                  />
                  <StatCard
                    label="Assigned Subjects"
                    value={stats.subjects}
                    icon={BookOpen}
                    color="#3b82f6"
                    bg="rgba(59,130,246,0.08)"
                    border="rgba(59,130,246,0.2)"
                    subtext="View subjects →"
                  />
                  <StatCard
                    label="Total Submissions"
                    value={stats.submissions}
                    icon={Terminal}
                    color="#10b981"
                    bg="rgba(16,185,129,0.08)"
                    border="rgba(16,185,129,0.2)"
                    subtext="View submissions →"
                    onClick={() => setActiveSection("submissions")}
                  />
                  <StatCard
                    label="Active Students"
                    value={stats.activeStudents}
                    icon={Activity}
                    color="#fbbf24"
                    bg="rgba(245,158,11,0.08)"
                    border="rgba(245,158,11,0.2)"
                    subtext="View active →"
                  />
                </div>

                {/* Lower Row: Activity & Trends Grid */}
                <div className="teacher-trends-grid">
                  {/* Recent Activity */}
                  <ActivityCard activities={activities} />

                  {/* Submission Trend */}
                  <ChartCard title="Submissions Overview" subtitle="Frequency of weekly code executions">
                    <div style={{ width: "100%", height: "220px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyTrend}>
                          <defs>
                            <linearGradient id="gradOverview" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--pur)" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="var(--pur)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="var(--tx3)" fontSize={10} tickLine={false} />
                          <YAxis stroke="var(--tx3)" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--bd)", borderRadius: "8px", color: "var(--tx)" }} />
                          <Area type="monotone" dataKey="submissions" stroke="var(--pur)" strokeWidth={2.5} fillOpacity={1} fill="url(#gradOverview)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>

              </TeacherLayout>
            )}

            {/* View 2: Students List */}
            {activeSection === "students" && (
              <Students onViewProfile={handleViewStudentProfile} />
            )}

            {/* View 3: Student profile details */}
            {activeSection === "student-profile" && (
              <StudentProfile
                studentRoll={selectedStudentRoll}
                onBack={() => setActiveSection("students")}
                onViewSubmission={handleViewSubmissionDetails}
              />
            )}

            {/* View 4: Submissions Log */}
            {activeSection === "submissions" && (
              <TeacherLayout
                key="submissions"
                title="Code Submissions"
                description={practicalFilter ? `Viewing submissions for: ${practicalFilter}` : "Review compiling history, scores, and runtime logs."}
                actions={
                  practicalFilter && (
                    <button
                      onClick={() => setPracticalFilter("")}
                      className="boc px-3 py-1.5"
                      style={{ fontSize: "0.78rem", borderRadius: "8px" }}
                    >
                      Clear Practical Filter
                    </button>
                  )
                }
              >
                <SubmissionCard submissions={filteredSubmissions} onViewDetails={handleViewSubmissionDetails} showStudentInfo={true} />
              </TeacherLayout>
            )}

            {/* View 5: Submission details / code editor */}
            {activeSection === "submission-details" && (
              <SubmissionDetails
                submissionId={selectedSubmissionId}
                onBack={() => {
                  // Return back to student profile if we came from it, otherwise submissions page
                  if (selectedStudentRoll && allSubmissions.find(s => s.id === selectedSubmissionId)?.studentRoll === selectedStudentRoll) {
                    setActiveSection("student-profile");
                  } else {
                    setActiveSection("submissions");
                  }
                }}
              />
            )}

            {/* View 6: Practicals panel */}
            {activeSection === "practicals" && (
              <Practicals onViewSubmissions={handleViewSubmissionsForPractical} />
            )}

            {/* View 7: Full Analytics */}
            {activeSection === "analytics" && (
              <Analytics />
            )}

            {/* View 8: Profile page */}
            {activeSection === "profile" && (
              <Profile onProfileUpdate={handleProfileUpdateInHeader} />
            )}

            {/* View 9: Settings panel */}
            {activeSection === "settings" && (
              <Settings isDark={isDark} onToggleTheme={onToggleTheme} />
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default TeacherDashboard;
