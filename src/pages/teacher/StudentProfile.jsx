import { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Calendar, BookOpen, Clock, Activity, CheckCircle2, ShieldAlert, Award, FileCode } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { mockTeacherData } from "../../utils/mockTeacherData";
import SubmissionCard from "../../components/teacher/SubmissionCard";
import TeacherLayout from "../../components/teacher/TeacherLayout";

function StudentProfile({ studentRoll, onBack, onViewSubmission }) {
  const [student, setStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (studentRoll) {
      setStudent(mockTeacherData.getStudentByRoll(studentRoll));
      setSubmissions(mockTeacherData.getSubmissionsByStudent(studentRoll));
      setAnalytics(mockTeacherData.getAnalytics());
    }
  }, [studentRoll]);

  if (!student) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--tx2)" }}>
        Loading student profile...
      </div>
    );
  }

  // Fallbacks for charts
  const trendData = analytics?.weeklyTrend || [];
  const langData = analytics?.languageUsage || [];
  const statusData = analytics?.submissionStatus || [];

  const userInitial = student.name ? student.name[0].toUpperCase() : "S";

  return (
    <TeacherLayout
      title="Student Profile"
      description="Detailed performance summary and submission logs."
      actions={
        <button
          onClick={onBack}
          className="boc d-inline-flex align-items-center gap-2 px-3 py-2"
          style={{ borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}
        >
          <ArrowLeft size={14} />
          <span>Back to Students</span>
        </button>
      }
    >
      {/* Main Grid */}
      <div className="row g-4">
        {/* Left Side: Profile Details & Submission History */}
        <div className="col-12 col-lg-5">
          <div className="d-flex flex-column gap-4">
            
            {/* Profile Card */}
            <div className="cyber-card" style={{ padding: "28px" }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "14px",
                    background: "var(--grad)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#fff",
                    boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)"
                  }}
                >
                  {userInitial}
                </div>
                <div>
                  <h4 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                    {student.name}
                  </h4>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      background: "rgba(139,92,246,0.12)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      color: "var(--pur)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      marginTop: "4px",
                      display: "inline-block"
                    }}
                  >
                    {student.rollNo}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid var(--bd)", paddingTop: "20px" }}>
                <div className="d-flex align-items-center gap-2">
                  <BookOpen size={16} style={{ color: "var(--tx3)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--tx2)", width: "100px" }}>Branch</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--tx)", fontWeight: 600 }}>{student.branch} Engineering</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Award size={16} style={{ color: "var(--tx3)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--tx2)", width: "100px" }}>Year</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--tx)", fontWeight: 600 }}>{student.year}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FileCode size={16} style={{ color: "var(--tx3)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--tx2)", width: "100px" }}>Subject</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--tx)", fontWeight: 600 }}>{student.subject}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Mail size={16} style={{ color: "var(--tx3)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--tx2)", width: "100px" }}>Email</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--tx)", fontWeight: 600, wordBreak: "break-all" }}>{student.email}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Calendar size={16} style={{ color: "var(--tx3)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--tx2)", width: "100px" }}>Joined On</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--tx)", fontWeight: 600 }}>{student.joinedOn}</span>
                </div>
              </div>
            </div>

            {/* Submission History Title */}
            <div>
              <div className="mb-2">
                <h5 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                  Submission History
                </h5>
              </div>
              <SubmissionCard submissions={submissions} onViewDetails={onViewSubmission} showStudentInfo={false} />
            </div>

          </div>
        </div>

        {/* Right Side: Performance Summary & Charts */}
        <div className="col-12 col-lg-7">
          <div className="d-flex flex-column gap-4">
            
            {/* Performance Summary Panel */}
            <div className="cyber-card" style={{ padding: "28px" }}>
              <h5 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>
                Performance Summary
              </h5>
              
              <div className="row g-3 mb-4">
                <div className="col-6 col-sm-3">
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>{student.problemsSolved}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--tx3)", fontWeight: 600, marginTop: "2px" }}>Problems Solved</div>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>{student.assignmentsCompleted}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--tx3)", fontWeight: 600, marginTop: "2px" }}>Assignments</div>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--pur)" }}>{student.avgScore}%</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--tx3)", fontWeight: 600, marginTop: "2px" }}>Average Score</div>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#10b981" }}>{student.acceptanceRate}%</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--tx3)", fontWeight: 600, marginTop: "2px" }}>Acceptance Rate</div>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.8rem", color: "var(--tx2)" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }}></span>
                <span>Last Active: <strong>{student.lastActive}</strong></span>
              </div>
            </div>

            {/* Charts section */}
            <div className="cyber-card" style={{ padding: "28px" }}>
              <h5 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>
                Analytics Overview
              </h5>

              <div className="row g-3">
                {/* Submission Trend Chart */}
                <div className="col-12 mb-4">
                  <label style={{ fontSize: "0.82rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "12px" }}>
                    Submission Trend (This Week)
                  </label>
                  <div style={{ width: "100%", height: "180px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="gradTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--pur)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--pur)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="var(--tx3)" fontSize={10} tickLine={false} />
                        <YAxis stroke="var(--tx3)" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--bd)", borderRadius: "8px", color: "var(--tx)" }} />
                        <Area type="monotone" dataKey="submissions" stroke="var(--pur)" strokeWidth={2} fillOpacity={1} fill="url(#gradTrend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Donut Charts grid */}
                <div className="col-12 col-sm-6">
                  <label style={{ fontSize: "0.82rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "12px" }}>
                    Language Usage
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: "120px", height: "120px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={langData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={50}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {langData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {langData.map((entry, idx) => (
                        <div key={idx} className="d-flex align-items-center gap-2" style={{ fontSize: "0.75rem" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: entry.color }}></span>
                          <span style={{ color: "var(--tx2)" }}>{entry.name}:</span>
                          <strong style={{ color: "var(--tx)" }}>{entry.value}%</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label style={{ fontSize: "0.82rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "12px" }}>
                    Submission Status
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: "120px", height: "120px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={50}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {statusData.slice(0, 3).map((entry, idx) => (
                        <div key={idx} className="d-flex align-items-center gap-2" style={{ fontSize: "0.75rem" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: entry.color }}></span>
                          <span style={{ color: "var(--tx2)" }}>{entry.name}:</span>
                          <strong style={{ color: "var(--tx)" }}>{entry.value}%</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

export default StudentProfile;
