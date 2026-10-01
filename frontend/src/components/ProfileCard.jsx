import { useState, useEffect } from "react";
import { 
  User, Mail, Hash, Calendar, BookOpen, 
  School, Edit, ShieldCheck, UserCheck, 
  GraduationCap, Layers 
} from "lucide-react";

function ProfileCard({ currentUser, onNavigateSettings }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    rollNo: currentUser?.rollNo || currentUser?.roll_no || "",
    year: currentUser?.year || "",
    branch: currentUser?.branch || "",
    college: currentUser?.college || "",
    semester: currentUser?.semester || "",
    mobileNo: currentUser?.mobileNo || currentUser?.mobile || "",
  });

  // Sync with prop changes and fetch latest database record to guarantee real user values
  useEffect(() => {
    if (currentUser) {
      setProfileData((prev) => ({
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        rollNo: currentUser.rollNo || currentUser.roll_no || prev.rollNo,
        year: currentUser.year || prev.year,
        branch: currentUser.branch || prev.branch,
        college: currentUser.college || prev.college,
        semester: currentUser.semester || prev.semester,
        mobileNo: currentUser.mobileNo || currentUser.mobile || prev.mobileNo,
      }));
    }

    const fetchLatestProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("cryptocode_user") || "{}");
        const activeEmail = currentUser?.email || storedUser?.email;
        const activeId = currentUser?.id || storedUser?.id;

        if (!activeEmail && !activeId) return;

        setLoading(true);
        const response = await fetch("http://localhost:5000/profiles");
        if (!response.ok) return;

        const allProfiles = await response.json();
        if (Array.isArray(allProfiles)) {
          const match = allProfiles.find(
            (p) =>
              (activeId && (p.user_id === activeId || String(p.id) === String(activeId))) ||
              (activeEmail && p.email?.toLowerCase() === activeEmail?.toLowerCase())
          );

          if (match) {
            console.log("FETCHED REAL STUDENT PROFILE FROM DATABASE:", match);
            setProfileData({
              name: match.name || "",
              email: match.email || "",
              rollNo: match.roll_no || "",
              year: match.year || "",
              branch: match.branch || "",
              college: match.college || "",
              semester: match.semester || "",
              mobileNo: match.mobile || match.mobile_no || "",
            });

            // Update localStorage cache with fresh DB credentials
            const updatedUser = {
              ...storedUser,
              id: match.user_id || match.id,
              name: match.name,
              email: match.email,
              role: match.role,
              rollNo: match.roll_no,
              year: match.year,
              semester: match.semester,
              branch: match.branch,
              college: match.college,
            };
            localStorage.setItem("cryptocode_user", JSON.stringify(updatedUser));
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest profile from database:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProfile();
  }, [currentUser]);

  const updateField = (key, val) => {
    setProfileData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    setIsEditing(false);
    try {
      const stored = JSON.parse(localStorage.getItem("cryptocode_user") || "{}");
      const updated = {
        ...stored,
        name: profileData.name,
        email: profileData.email,
        rollNo: profileData.rollNo,
        year: profileData.year,
        branch: profileData.branch,
        college: profileData.college,
        semester: profileData.semester,
      };
      localStorage.setItem("cryptocode_user", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving updated profile locally:", e);
    }
  };

  const initial = profileData.name ? profileData.name.trim()[0].toUpperCase() : "S";

  // Dynamic Student UID derivation according to academic year
  const getYearCode = (yearStr) => {
    if (!yearStr) return "ST";
    const normalized = String(yearStr).trim().toLowerCase();
    if (normalized.includes("first") || normalized === "1" || normalized === "1st" || normalized === "fy") {
      return "FY";
    }
    if (normalized.includes("second") || normalized === "2" || normalized === "2nd" || normalized === "sy") {
      return "SY";
    }
    if (normalized.includes("third") || normalized === "3" || normalized === "3rd" || normalized === "ty") {
      return "TY";
    }
    return "ST";
  };

  const yearCode = getYearCode(profileData.year);
  const rollNumber = profileData.rollNo ? String(profileData.rollNo).trim() : "";
  const studentUid = rollNumber ? `CC-${yearCode}-${rollNumber}` : `CC-${yearCode}`;

  // Personal fields (Mobile Number removed as requested)
  const personalFields = [
    { 
      id: "name", 
      label: "Full Name", 
      value: profileData.name, 
      setter: (v) => updateField("name", v), 
      icon: User, 
      type: "text" 
    },
    { 
      id: "email", 
      label: "College Email", 
      value: profileData.email, 
      setter: (v) => updateField("email", v), 
      icon: Mail, 
      type: "email" 
    },
  ];

  const academicFields = [
    { 
      id: "rollNo", 
      label: "Roll Number", 
      value: profileData.rollNo, 
      setter: (v) => updateField("rollNo", v), 
      icon: Hash, 
      type: "text" 
    },
    { 
      id: "year", 
      label: "Academic Year", 
      value: profileData.year, 
      setter: (v) => updateField("year", v), 
      icon: Calendar, 
      type: "text" 
    },
    { 
      id: "branch", 
      label: "Branch / Stream", 
      value: profileData.branch, 
      setter: (v) => updateField("branch", v), 
      icon: BookOpen, 
      type: "text" 
    },
    { 
      id: "semester", 
      label: "Semester", 
      value: profileData.semester, 
      setter: (v) => updateField("semester", v), 
      icon: Layers, 
      type: "text" 
    },
    { 
      id: "college", 
      label: "College / Institute", 
      value: profileData.college, 
      setter: (v) => updateField("college", v), 
      icon: School, 
      type: "text" 
    },
  ];

  return (
    <div 
      id="profile-section" 
      style={{ 
        width: "100%", 
        display: "flex", 
        flexDirection: "column", 
        gap: "24px", 
        marginBottom: "32px" 
      }}
    >
      {/* Scoped animation for subtle breathing status dot */}
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

      {/* Title Header */}
      <div>
        <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
          Student Profile
        </h4>
        <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: "4px 0 0 0" }}>
          Manage your personal information and academic credentials.
        </p>
      </div>

      {/* 1. Profile Summary Card (Full-width) */}
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
                boxShadow: "0 8px 24px rgba(139,92,246,0.25)",
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
            {/* Line 1: Student Name + ACTIVE STUDENT badge with proper horizontal spacing */}
            <div className="d-flex align-items-center flex-wrap" style={{ gap: "16px", marginBottom: "2px" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--tx)", margin: 0, lineHeight: 1.2 }}>
                {profileData.name || "Student"}
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
                <span>ACTIVE STUDENT</span>
              </div>
            </div>

            {/* Line 2: Student UID */}
            <div style={{ fontSize: "0.85rem", color: "var(--tx3)" }}>
              Student UID:{" "}
              <strong style={{ color: "var(--tx2)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                {studentUid}
              </strong>
            </div>

            {/* Line 3: Role Access */}
            <div style={{ fontSize: "0.85rem", color: "var(--tx3)" }}>
              Role Access:{" "}
              <strong style={{ color: "var(--tx2)", fontWeight: 600 }}>
                Student Workspace
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
            const displayValue = field.value && field.value.trim().length > 0 ? field.value : "Not Provided";
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
                    {isEditing ? (
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
                        onChange={(e) => field.setter(e.target.value)}
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

      {/* 3. Academic Credentials Card (Full-width) */}
      <div className="cyber-card p-4" style={{ width: "100%" }}>
        <div 
          className="d-flex align-items-center gap-2 mb-3" 
          style={{ borderBottom: "1px solid var(--bd)", paddingBottom: "10px" }}
        >
          <GraduationCap size={18} style={{ color: "var(--pur)" }} />
          <h5 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
            Academic Credentials
          </h5>
        </div>

        <div className="row g-3">
          {academicFields.map((field) => {
            const Icon = field.icon;
            const displayValue = field.value && field.value.trim().length > 0 ? field.value : "Not Provided";
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
                    {isEditing ? (
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
                        onChange={(e) => field.setter(e.target.value)}
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

        {/* Existing Profile Action Buttons */}
        <div className="d-flex gap-2 justify-content-end mt-4">
          {isEditing ? (
            <button 
              className="bgrd btn px-4 py-2" 
              onClick={handleSave} 
              style={{ fontSize: "0.85rem" }}
            >
              Save Credentials
            </button>
          ) : (
            <button 
              className="boc btn px-4 py-2" 
              onClick={() => setIsEditing(true)} 
              style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Edit size={14} />
              <span>Modify Credentials</span>
            </button>
          )}

          <button 
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
              borderColor: "rgba(255,255,255,0.08)" 
            }}
          >
            <ShieldCheck size={14} />
            <span>Security Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
