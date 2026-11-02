import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Award,
  GraduationCap,
  Mail,
} from "lucide-react";
import { API_URL, getAuthHeaders } from "../../utils/api";
import SubmissionCard from "../../components/teacher/SubmissionCard";
import TeacherLayout from "../../components/teacher/TeacherLayout";

// Map a raw DB submission to the shape SubmissionCard expects
function mapSubmission(sub) {
  const rawStatus = (sub.status || "Saved").trim();
  const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

  const formattedDate = sub.submitted_at
    ? new Date(sub.submitted_at).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const isAccepted =
    status === "Accepted" ||
    status === "Saved" ||
    status === "Passed" ||
    status === "Success";

  return {
    id: sub.id,
    studentName: sub.profiles?.name || "Student",
    studentRoll: sub.profiles?.roll_no || "",
    practicalTitle: sub.filename || "Lab Submission",
    language: sub.language ? sub.language.toUpperCase() : "CODE",
    status: "Saved",
    rawStatus: status,
    score: sub.score !== undefined && sub.score !== null ? sub.score : (isAccepted ? 100 : 0),
    submittedOn: formattedDate,
  };
}

function StudentProfile({ studentId: propStudentId, onBack, onViewSubmission }) {
  const { studentId: paramStudentId } = useParams();
  const studentId = propStudentId || paramStudentId;
  const [student, setStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudentData = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      setError("Student ID was not received.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStudent(null);
      setSubmissions([]);

      const headers = getAuthHeaders();

      // Fetch student profile and submissions in parallel with authenticating headers
      const [profileRes, subsRes] = await Promise.all([
        fetch(`${API_URL}/students/${studentId}`, { headers }),
        fetch(`${API_URL}/submissions?student_id=${studentId}`, { headers }),
      ]);

      // Handle specific HTTP status codes
      if (!profileRes.ok) {
        const profileData = await profileRes.json().catch(() => ({}));
        if (profileRes.status === 401) {
          throw new Error("Session expired or authentication required. Please log in again.");
        } else if (profileRes.status === 403) {
          throw new Error(profileData.message || "Access denied. You cannot view students from another college.");
        } else if (profileRes.status === 404) {
          throw new Error("Student not found.");
        } else {
          throw new Error(profileData.message || "Unable to load student information.");
        }
      }

      const profileData = await profileRes.json();
      if (!profileData.success || !profileData.student) {
        throw new Error(profileData.message || "Failed to load student profile.");
      }

      // Submissions data - latest 5 code submissions
      let latestSubs = [];
      if (subsRes.ok) {
        const subsData = await subsRes.json().catch(() => ({}));
        if (subsData.success && Array.isArray(subsData.submissions)) {
          latestSubs = subsData.submissions
            .slice()
            .sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0))
            .slice(0, 5)
            .map(mapSubmission);
        }
      }

      setStudent(profileData.student);
      setSubmissions(latestSubs);
    } catch (err) {
      console.error("Failed to fetch student profile:", err);
      setError(err.message || "Unable to load student information.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  // Loading state
  if (loading) {
    return (
      <TeacherLayout
        title="Student Profile"
        description="Loading student information..."
      >
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            color: "var(--tx2)",
            fontSize: "0.95rem",
          }}
        >
          Loading student profile…
        </div>
      </TeacherLayout>
    );
  }

  // Error state
  if (error || !student) {
    return (
      <TeacherLayout
        title="Student Profile"
        description="Unable to load student information."
        actions={
          <button
            onClick={onBack}
            className="boc d-inline-flex align-items-center gap-2 px-3 py-2"
            style={{ borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
          >
            <ArrowLeft size={14} />
            <span>Back to Students</span>
          </button>
        }
      >
        <div
          className="cyber-card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            color: "var(--tx2)",
            borderRadius: "16px",
            background: "var(--sf)",
            border: "1px solid var(--bd)",
          }}
        >
          <p style={{ marginBottom: "20px", fontSize: "0.95rem", color: "var(--tx)" }}>
            {error || "Student profile not found."}
          </p>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <button
              onClick={fetchStudentData}
              className="boc px-3 py-2"
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                background: "var(--pur)",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              Retry
            </button>
            <button
              onClick={onBack}
              className="boc px-3 py-2"
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              Back to Students
            </button>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  const userInitial = student.name ? student.name.trim()[0].toUpperCase() : "S";

  // Academic & Personal Details (Branch, Year, Semester, College, Email)
  const studentDetails = [
    { icon: BookOpen, label: "Branch", value: student.branch },
    { icon: Award, label: "Year", value: student.year },
    { icon: Award, label: "Semester", value: student.semester },
    { icon: GraduationCap, label: "College", value: student.college },
    { icon: Mail, label: "Email", value: student.email },
  ];

  return (
    <TeacherLayout
      title="Student Profile"
      description="Student information and recent submission history."
      actions={
        <button
          onClick={onBack}
          className="boc d-inline-flex align-items-center gap-2 px-3 py-2"
          style={{
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Students</span>
        </button>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {/* =========================================================
            1. COMPLETE STUDENT PROFILE CARD (Full Width)
        ========================================================== */}
        <div
          className="cyber-card"
          style={{
            padding: "28px 32px",
            borderRadius: "16px",
            background: "var(--sf)",
            border: "1px solid var(--bd)",
            width: "100%",
          }}
        >
          {/* Card Header: Avatar, Name, Roll No */}
          <div
            className="d-flex align-items-center justify-content-between flex-wrap gap-3 pb-4"
            style={{ borderBottom: "1px solid var(--bd)" }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "var(--grad)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "#fff",
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.35)",
                  flexShrink: 0,
                }}
              >
                {userInitial}
              </div>

              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h3
                    style={{
                      fontSize: "1.45rem",
                      fontWeight: 700,
                      color: "#fff",
                      margin: 0,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {student.name || "N/A"}
                  </h3>

                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      background: "rgba(139, 92, 246, 0.12)",
                      border: "1px solid rgba(139, 92, 246, 0.25)",
                      color: "var(--pur)",
                      padding: "2px 10px",
                      borderRadius: "6px",
                      fontWeight: 600,
                    }}
                  >
                    {student.rollNo || "N/A"}
                  </span>
                </div>

                <p
                  style={{
                    color: "var(--tx3)",
                    fontSize: "0.85rem",
                    margin: "4px 0 0",
                  }}
                >
                  Student Profile &amp; Academic Information
                </p>
              </div>
            </div>
          </div>

          {/* Card Body: Complete Academic and Personal Details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "20px 24px",
              paddingTop: "24px",
            }}
          >
            {studentDetails.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "rgba(139, 92, 246, 0.08)",
                    border: "1px solid rgba(139, 92, 246, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} style={{ color: "var(--pur)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--tx3)",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      marginBottom: "3px",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--tx)",
                      fontWeight: 600,
                      wordBreak: "break-all",
                    }}
                  >
                    {value || "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            2. LAST 5 SUBMISSIONS SECTION
        ========================================================== */}
        <div style={{ width: "100%" }}>
          <div
            className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2"
          >
            <div>
              <h4
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Last 5 Submissions
              </h4>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--tx3)",
                  margin: "2px 0 0",
                }}
              >
                Displaying the student's latest 5 code submissions
              </p>
            </div>

            {submissions.length > 0 && (
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  background: "rgba(139, 92, 246, 0.1)",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  color: "var(--pur)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <SubmissionCard
            submissions={submissions}
            onViewDetails={onViewSubmission}
            showStudentInfo={false}
            simplified={false}
          />
        </div>
      </div>
    </TeacherLayout>
  );
}

export default StudentProfile;
