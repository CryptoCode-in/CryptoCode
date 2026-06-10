import { useState } from "react";
import { User, Mail, Hash, Calendar, BookOpen, School, Phone, Edit, ShieldCheck, UserCheck, GraduationCap } from "lucide-react";

function ProfileCard({ currentUser }) {
  const [name, setName] = useState(currentUser?.name || "Rahul Sharma");
  const [email, setEmail] = useState(currentUser?.email || "rahul.sharma@gpnasik.edu.in");
  const [rollNo, setRollNo] = useState(currentUser?.rollNo || "220501");
  const [year, setYear] = useState(currentUser?.year || "Third Year (TY)");
  const [branch, setBranch] = useState(currentUser?.branch || "Computer Technology (CM)");
  const [college, setCollege] = useState(currentUser?.college || "Government Polytechnic Nashik");
  const [mobileNo, setMobileNo] = useState(currentUser?.mobileNo || "+91 98765 43210");
  const [isEditing, setIsEditing] = useState(false);

  const initial = name ? name[0].toUpperCase() : "U";

  const handleSave = () => {
    setIsEditing(false);
  };

  const personalFields = [
    { id: "name", label: "Full Name", value: name, setter: setName, icon: User, type: "text" },
    { id: "email", label: "College Email", value: email, setter: setEmail, icon: Mail, type: "email" },
    { id: "mobileNo", label: "Mobile Number", value: mobileNo, setter: setMobileNo, icon: Phone, type: "tel" },
  ];

  const academicFields = [
    { id: "rollNo", label: "Roll Number", value: rollNo, setter: setRollNo, icon: Hash, type: "text" },
    { id: "year", label: "Academic Year", value: year, setter: setYear, icon: Calendar, type: "text" },
    { id: "branch", label: "Branch / Stream", value: branch, setter: setBranch, icon: BookOpen, type: "text" },
    { id: "college", label: "College / Institute", value: college, setter: setCollege, icon: School, type: "text" },
  ];

  return (
    <div id="profile-section" style={{ marginBottom: "32px" }}>
      <div className="mb-3">
        <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
          Student Profile
        </h4>
        <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: 0 }}>
          Manage your personal information and academic credentials.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Side: Avatar & Status Panel */}
        <div className="col-12 col-lg-4">
          <div
            style={{
              background: "var(--sf)",
              border: "1px solid var(--bd)",
              borderRadius: "18px",
              padding: "32px 24px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Professional Avatar Circle */}
            <div
              style={{
                position: "relative",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))",
                border: "2px dashed var(--pur)",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "var(--grad)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: "#fff",
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2)",
                }}
              >
                {initial}
              </div>
              {/* Active Indicator Pulse */}
              <span
                style={{
                  position: "absolute",
                  bottom: "6px",
                  right: "6px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#34d399",
                  border: "3px solid var(--sf)",
                  boxShadow: "0 0 10px #34d399",
                }}
              ></span>
            </div>

            <h5 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 6px 0" }}>
              {name}
            </h5>
            
            <div
              className="d-inline-flex align-items-center gap-1.5 px-3 py-1 mb-4"
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                borderRadius: "100px",
                background: "rgba(52,211,153,.1)",
                color: "#34d399",
                border: "1px solid rgba(52,211,153,.2)",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", display: "inline-block" }}></span>
              ACTIVE STUDENT
            </div>

            <div style={{ width: "100%", borderTop: "1px solid var(--bd)", paddingTop: "20px", marginTop: "auto" }}>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.78rem" }}>
                <span style={{ color: "var(--tx3)" }}>Student UID</span>
                <span style={{ color: "var(--tx2)", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>CC-TY-{rollNo}</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.78rem" }}>
                <span style={{ color: "var(--tx3)" }}>Current Level</span>
                <span style={{ color: "var(--pur)", fontWeight: 700 }}>Level 4 (Elite)</span>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: "0.78rem" }}>
                <span style={{ color: "var(--tx3)" }}>Role Access</span>
                <span style={{ color: "var(--tx2)", fontWeight: 600 }}>Student Workspace</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Credentials Panel */}
        <div className="col-12 col-lg-8">
          <div
            style={{
              background: "var(--sf)",
              border: "1px solid var(--bd)",
              borderRadius: "18px",
              padding: "28px",
              height: "100%",
            }}
          >
            {/* Section 1: Personal Info */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3" style={{ borderBottom: "1px solid var(--bd)", paddingBottom: "8px" }}>
                <UserCheck size={16} style={{ color: "var(--pur)" }} />
                <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
                  Personal Information
                </h5>
              </div>

              <div className="row g-3">
                {personalFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div className="col-12 col-md-6" key={field.id}>
                      <div
                        style={{
                          background: "var(--bg3)",
                          border: "1px solid var(--bd)",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          height: "100%",
                        }}
                      >
                        <div style={{ color: "var(--tx3)", flexShrink: 0 }}>
                          <Icon size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.72rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 600, marginBottom: "2px" }}>
                            {field.label}
                          </div>
                          {isEditing ? (
                            <input
                              type={field.type}
                              className="oinp"
                              style={{ margin: 0, padding: "4px 8px", fontSize: "0.85rem", width: "100%", background: "var(--bg)", borderRadius: "6px" }}
                              value={field.value}
                              onChange={(e) => field.setter(e.target.value)}
                            />
                          ) : (
                            <div style={{ color: "var(--tx)", fontWeight: 600, fontSize: "0.85rem" }}>
                              {field.value}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Academic Info */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3" style={{ borderBottom: "1px solid var(--bd)", paddingBottom: "8px" }}>
                <GraduationCap size={16} style={{ color: "var(--pur)" }} />
                <h5 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
                  Academic Credentials
                </h5>
              </div>

              <div className="row g-3">
                {academicFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div className="col-12 col-md-6" key={field.id}>
                      <div
                        style={{
                          background: "var(--bg3)",
                          border: "1px solid var(--bd)",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          height: "100%",
                        }}
                      >
                        <div style={{ color: "var(--tx3)", flexShrink: 0 }}>
                          <Icon size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.72rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 600, marginBottom: "2px" }}>
                            {field.label}
                          </div>
                          {isEditing ? (
                            <input
                              type={field.type}
                              className="oinp"
                              style={{ margin: 0, padding: "4px 8px", fontSize: "0.85rem", width: "100%", background: "var(--bg)", borderRadius: "6px" }}
                              value={field.value}
                              onChange={(e) => field.setter(e.target.value)}
                            />
                          ) : (
                            <div style={{ color: "var(--tx)", fontWeight: 600, fontSize: "0.85rem" }}>
                              {field.value}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex gap-2 justify-content-end mt-4">
              {isEditing ? (
                <button className="bgrd btn px-4 py-2" onClick={handleSave} style={{ fontSize: "0.85rem" }}>
                  Save Credentials
                </button>
              ) : (
                <button className="boc btn px-4 py-2" onClick={() => setIsEditing(true)} style={{ fontSize: "0.85rem", gap: "6px" }}>
                  <Edit size={14} />
                  <span>Modify Credentials</span>
                </button>
              )}
              <button className="boc btn px-4 py-2" style={{ fontSize: "0.85rem", gap: "6px", borderColor: "rgba(255,255,255,0.08)" }}>
                <ShieldCheck size={14} />
                <span>Security Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
