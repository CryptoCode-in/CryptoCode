import { useState, useEffect } from "react";
import {
  User,
  Mail,
  BookOpen,
  School,
  Edit,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Layers,
  Award,
  CheckCircle2,
} from "lucide-react";
import TeacherLayout from "../../components/teacher/TeacherLayout";

function Profile({ currentUser, onProfileUpdate, onNavigateSettings }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initial teacher profile state initialized from currentUser or localStorage
  const [profileData, setProfileData] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cryptocode_user") || "{}");
      return {
        id: currentUser?.id || stored?.id || "",
        userId: currentUser?.user_id || currentUser?.id || stored?.user_id || stored?.id || "",
        name: currentUser?.name || stored?.name || "",
        email: currentUser?.email || stored?.email || "",
        department: currentUser?.department || stored?.department || "",
        subjects: currentUser?.subjects || stored?.subjects || [],
        college: currentUser?.college || stored?.college || "",
        rollNo: currentUser?.rollNo || currentUser?.roll_no || stored?.roll_no || "",
        role: currentUser?.role || stored?.role || "teacher",
      };
    } catch {
      return {
        id: "",
        userId: "",
        name: "",
        email: "",
        department: "",
        subjects: [],
        college: "",
        rollNo: "",
        role: "teacher",
      };
    }
  });

  // Backup of profile data when editing starts (for cancel)
  const [originalData, setOriginalData] = useState(profileData);

  // Sync with prop changes and fetch latest database record for real teacher values
  useEffect(() => {
    let isMounted = true;

    const fetchLatestProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("cryptocode_user") || "{}");
        const activeEmail = currentUser?.email || storedUser?.email;
        const activeId = currentUser?.id || currentUser?.user_id || storedUser?.id || storedUser?.user_id;

        if (!activeEmail && !activeId) return;

        setLoading(true);
        const response = await fetch("http://localhost:5000/profiles");
        if (!response.ok) return;

        const allProfiles = await response.json();
        if (Array.isArray(allProfiles) && isMounted) {
          const match = allProfiles.find(
            (p) =>
              (activeId && (p.user_id === activeId || String(p.id) === String(activeId))) ||
              (activeEmail && p.email?.toLowerCase() === activeEmail?.toLowerCase())
          );

          if (match) {
            console.log("FETCHED REAL TEACHER PROFILE FROM DATABASE:", match);
            const freshData = {
              id: match.id,
              userId: match.user_id || match.id,
              name: match.name || "",
              email: match.email || "",
              department: match.department || "",
              subjects: Array.isArray(match.subjects)
                ? match.subjects
                : match.subjects
                ? [match.subjects]
                : [],
              college: match.college || "",
              rollNo: match.roll_no || "",
              role: match.role || "teacher",
            };

            setProfileData(freshData);
            setOriginalData(freshData);

            // Update localStorage cache with fresh DB credentials
            const updatedUser = {
              ...storedUser,
              id: match.user_id || match.id,
              name: match.name,
              email: match.email,
              role: match.role,
              department: match.department,
              subjects: match.subjects,
              college: match.college,
              roll_no: match.roll_no,
            };
            localStorage.setItem("cryptocode_user", JSON.stringify(updatedUser));

            if (onProfileUpdate) {
              onProfileUpdate(updatedUser);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest teacher profile from database:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLatestProfile();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const updateField = (key, val) => {
    setProfileData((prev) => ({ ...prev, [key]: val }));
  };

  const handleEditClick = () => {
    setOriginalData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      const stored = JSON.parse(localStorage.getItem("cryptocode_user") || "{}");
      const targetUserId = profileData.userId || stored?.id || stored?.user_id;

      if (!targetUserId) {
        console.error("Teacher ID not found for profile update");
        return;
      }

      // Convert subjects string back to array if modified as string in input
      const normalizedSubjects = Array.isArray(profileData.subjects)
        ? profileData.subjects
        : typeof profileData.subjects === "string"
        ? profileData.subjects
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const response = await fetch("http://localhost:5000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: targetUserId,
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          department: profileData.department,
          subjects: normalizedSubjects,
          college: profileData.college,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Teacher profile update failed:", data);
        return;
      }

      const updated = {
        ...stored,
        name: profileData.name,
        email: profileData.email,
        department: profileData.department,
        subjects: normalizedSubjects,
        college: profileData.college,
      };

      localStorage.setItem("cryptocode_user", JSON.stringify(updated));
      setProfileData((prev) => ({
        ...prev,
        subjects: normalizedSubjects,
      }));
      setOriginalData((prev) => ({
        ...prev,
        name: profileData.name,
        email: profileData.email,
        department: profileData.department,
        subjects: normalizedSubjects,
        college: profileData.college,
      }));

      setIsEditing(false);
      setSaveSuccess(true);

      if (onProfileUpdate) {
        onProfileUpdate(updated);
      }

      setTimeout(() => setSaveSuccess(false), 3000);
      console.log("Teacher profile updated successfully:", data);
    } catch (error) {
      console.error("Error updating teacher profile:", error);
    }
  };

  const initial = profileData.name && profileData.name.trim().length > 0
    ? profileData.name.trim()[0].toUpperCase()
    : "T";

  // Derive Teacher UID using real database ID or rollNo
  const teacherIdNumber = profileData.rollNo
    ? String(profileData.rollNo).trim()
    : profileData.id
    ? String(profileData.id).padStart(2, "0")
    : "01";

  const teacherUid = `CC-TE-${teacherIdNumber}`;

  // Format subjects array for display
  const formattedSubjects = Array.isArray(profileData.subjects) && profileData.subjects.length > 0
    ? profileData.subjects.join(", ")
    : typeof profileData.subjects === "string" && profileData.subjects.trim().length > 0
    ? profileData.subjects
    : "";

  // 1. Personal Fields (Full Name, College Email)
  const personalFields = [
    {
      id: "name",
      label: "Full Name",
      value: profileData.name,
      setter: (v) => updateField("name", v),
      icon: User,
      type: "text",
    },
    {
      id: "email",
      label: "College Email",
      value: profileData.email,
      setter: (v) => updateField("email", v),
      icon: Mail,
      type: "email",
    },
  ];

  // 2. Professional Fields (Designation, Department, Subjects Handled, College / Institute)
  const professionalFields = [
    {
      id: "designation",
      label: "Designation",
      value: "Teacher",
      setter: null, // Fixed role designation
      icon: Award,
      type: "text",
      readOnly: true,
    },
    {
      id: "department",
      label: "Department",
      value: profileData.department,
      setter: (v) => updateField("department", v),
      icon: Layers,
      type: "text",
    },
    {
      id: "subjects",
      label: "Subjects Handled",
      value: formattedSubjects,
      setter: (v) => updateField("subjects", v),
      icon: BookOpen,
      type: "text",
      placeholder: "e.g. C Programming, Java Programming",
    },
    {
      id: "college",
      label: "College / Institute",
      value: profileData.college,
      setter: (v) => updateField("college", v),
      icon: School,
      type: "text",
      placeholder: "e.g. Government Polytechnic, Nashik",
    },
  ];

  return (
    <TeacherLayout
      title="Teacher Profile"
      description="Manage your personal information and professional credentials."
    >
      <div
        id="profile-section"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* Scoped animation for subtle breathing status dot matching Student Profile */}
        <style>{`
          @keyframes activeDotGlow {
            0% {
              opacity: 1;
              box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4), 0 0 5px 1px rgba(52, 211, 153, 0.5);
            }
            100% {
              opacity: 0.65;
              box-shadow: 0 0 0 0 rgba(52, 211, 153, 0), 0 0 1px 0 rgba(52, 211, 153, 0.2);
            }
          }
          .active-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #34d399;
            flex-shrink: 0;
            display: inline-block;
            animation: activeDotGlow 2.1s ease-in-out infinite alternate;
          }
        `}</style>

        {/* Success Alert */}
        {saveSuccess && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: "10px",
              padding: "12px 16px",
              color: "#34d399",
              fontSize: "0.85rem",
            }}
            className="d-flex align-items-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>Profile credentials saved successfully!</span>
          </div>
        )}

        {/* 1. Profile Summary Card (Full-width matching Student Profile) */}
        <div className="cyber-card p-4" style={{ width: "100%" }}>
          <div className="d-flex align-items-center gap-4 flex-wrap flex-sm-nowrap">
            {/* Avatar Circle - Vertically Centered */}
            <div style={{ position: "relative", width: "84px", height: "84px", flexShrink: 0 }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "var(--grad)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.3rem",
                  fontWeight: 700,
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
                }}
              >
                {initial}
              </div>
              {/* Active Indicator Pulse */}
              <span
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: "#34d399",
                  border: "2.5px solid var(--sf)",
                  boxShadow: "0 0 8px #34d399",
                }}
              />
            </div>

            {/* Right of Avatar - Information Column */}
            <div className="d-flex flex-column justify-content-center" style={{ minWidth: 0, gap: "6px" }}>
              {/* Line 1: Teacher Name + ACTIVE TEACHER badge with proper horizontal spacing */}
              <div className="d-flex align-items-center flex-wrap" style={{ gap: "16px", marginBottom: "2px" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--tx)", margin: 0, lineHeight: 1.2 }}>
                  {profileData.name || "Teacher"}
                </h3>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    background: "rgba(52, 211, 153, 0.08)",
                    color: "#34d399",
                    border: "1px solid rgba(52, 211, 153, 0.25)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                >
                  <span className="active-status-dot" />
                  <span>ACTIVE TEACHER</span>
                </div>
              </div>

              {/* Line 2: Teacher UID */}
              <div style={{ fontSize: "0.85rem", color: "var(--tx3)" }}>
                Teacher UID:{" "}
                <strong style={{ color: "var(--tx2)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                  {teacherUid}
                </strong>
              </div>

              {/* Line 3: Role Access */}
              <div style={{ fontSize: "0.85rem", color: "var(--tx3)" }}>
                Role Access:{" "}
                <strong style={{ color: "var(--tx2)", fontWeight: 600 }}>
                  Teacher Workspace
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Personal Information Card (Full-width) */}
        <div className="cyber-card p-4" style={{ width: "100%" }}>
          <div
            className="d-flex align-items-center gap-2 mb-3"
            style={{ borderBottom: "1px solid var(--bd)", paddingBottom: "10px" }}
          >
            <UserCheck size={18} style={{ color: "var(--pur)" }} />
            <h5 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
              Personal Information
            </h5>
          </div>

          <div className="row g-3">
            {personalFields.map((field) => {
              const Icon = field.icon;
              const displayValue = field.value && String(field.value).trim().length > 0
                ? field.value
                : "Not Provided";
              return (
                <div className="col-12 col-md-6" key={field.id}>
                  <div
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--bd)",
                      borderRadius: "14px",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      height: "100%",
                    }}
                  >
                    <div style={{ color: "var(--pur)", opacity: 0.9, flexShrink: 0 }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--tx3)",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          marginBottom: "3px",
                        }}
                      >
                        {field.label}
                      </div>
                      {isEditing && !field.readOnly ? (
                        <input
                          type={field.type}
                          className="oinp"
                          style={{
                            margin: 0,
                            padding: "6px 10px",
                            fontSize: "0.88rem",
                            width: "100%",
                            background: "var(--bg)",
                            borderRadius: "8px",
                            color: "var(--tx)",
                            border: "1px solid var(--bd)",
                          }}
                          value={field.value}
                          onChange={(e) => field.setter && field.setter(e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <div
                          style={{
                            color: displayValue !== "Not Provided" ? "var(--tx)" : "var(--tx3)",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {displayValue}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Professional Information Card (Full-width) */}
        <div className="cyber-card p-4" style={{ width: "100%" }}>
          <div
            className="d-flex align-items-center gap-2 mb-3"
            style={{ borderBottom: "1px solid var(--bd)", paddingBottom: "10px" }}
          >
            <GraduationCap size={18} style={{ color: "var(--pur)" }} />
            <h5 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
              Professional Information
            </h5>
          </div>

          <div className="row g-3">
            {professionalFields.map((field) => {
              const Icon = field.icon;
              const displayValue = field.value && String(field.value).trim().length > 0
                ? field.value
                : "Not Provided";
              return (
                <div className="col-12 col-md-6" key={field.id}>
                  <div
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--bd)",
                      borderRadius: "14px",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      height: "100%",
                    }}
                  >
                    <div style={{ color: "var(--pur)", opacity: 0.9, flexShrink: 0 }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--tx3)",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          marginBottom: "3px",
                        }}
                      >
                        {field.label}
                      </div>
                      {isEditing && !field.readOnly ? (
                        <input
                          type={field.type}
                          className="oinp"
                          style={{
                            margin: 0,
                            padding: "6px 10px",
                            fontSize: "0.88rem",
                            width: "100%",
                            background: "var(--bg)",
                            borderRadius: "8px",
                            color: "var(--tx)",
                            border: "1px solid var(--bd)",
                          }}
                          value={field.value}
                          onChange={(e) => field.setter && field.setter(e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <div
                          style={{
                            color: displayValue !== "Not Provided" ? "var(--tx)" : "var(--tx3)",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {displayValue}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons matching Student Profile */}
          <div className="d-flex gap-2 justify-content-end mt-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="boc btn px-4 py-2"
                  onClick={handleCancel}
                  style={{ fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bgrd btn px-4 py-2"
                  onClick={handleSave}
                  style={{ fontSize: "0.85rem" }}
                >
                  Save Credentials
                </button>
              </>
            ) : (
              <button
                type="button"
                className="boc btn px-4 py-2"
                onClick={handleEditClick}
                style={{
                  fontSize: "0.85rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Edit size={14} />
                <span>Modify Credentials</span>
              </button>
            )}

            <button
              type="button"
              className="boc btn px-4 py-2"
              onClick={() => {
                if (onNavigateSettings) {
                  onNavigateSettings();
                }
              }}
              style={{
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <ShieldCheck size={14} />
              <span>Security Settings</span>
            </button>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

export default Profile;
