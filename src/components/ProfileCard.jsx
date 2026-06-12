import { useState } from "react";
import { User, Mail, School, Book, Edit, ShieldCheck } from "lucide-react";

function ProfileCard({ currentUser }) {
  const [name, setName] = useState(currentUser?.name || "Rahul Sharma");
  const [email, setEmail] = useState(currentUser?.email || "rahul.sharma@gpnasik.edu.in");
  const [institute, setInstitute] = useState("Government Polytechnic Nashik");
  const [course, setCourse] = useState("Computer Technology (CM)");
  const [isEditing, setIsEditing] = useState(false);

  const initial = name ? name[0].toUpperCase() : "U";

  const handleSave = () => {
    setIsEditing(false);
    // Ready for future API hook: e.g. updateProfile({ name, email, institute, course })
  };

  return (
    <div id="profile-section" style={{ marginBottom: "32px" }}>
      <div className="mb-3">
        <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
          My Profile
        </h4>
        <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: 0 }}>
          Manage your personal details and academic credentials.
        </p>
      </div>

      <div
        style={{
          background: "var(--sf)",
          border: "1px solid var(--bd)",
          borderRadius: "18px",
          padding: "32px",
        }}
      >
        <div className="row g-4 align-items-center">
          {/* Avatar Area */}
          <div className="col-12 col-md-4 text-center" style={{ borderRight: "1px solid var(--bd)", paddingRight: "24px" }}>
            <div
              className="mx-auto mb-3"
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "24px",
                background: "var(--grad)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#fff",
                boxShadow: "0 12px 32px rgba(139,92,246,.25)",
              }}
            >
              {initial}
            </div>
            <h5 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 4px 0" }}>{name}</h5>
            <span
              className="bst son"
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "100px",
                background: "rgba(52,211,153,.1)",
                color: "#34d399",
                border: "1px solid rgba(52,211,153,.2)",
              }}
            >
              Active Student
            </span>
          </div>

          {/* Details Area */}
          <div className="col-12 col-md-8">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Full Name */}
              <div className="d-flex align-items-center gap-3">
                <div style={{ color: "var(--tx3)", width: "24px" }}><User size={18} /></div>
                <div style={{ flex: 1 }}>
                  <label className="olbl" style={{ fontSize: "0.75rem", margin: 0 }}>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="oinp"
                      style={{ margin: 0, padding: "8px 12px" }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <div style={{ color: "var(--tx)", fontWeight: 600 }}>{name}</div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="d-flex align-items-center gap-3">
                <div style={{ color: "var(--tx3)", width: "24px" }}><Mail size={18} /></div>
                <div style={{ flex: 1 }}>
                  <label className="olbl" style={{ fontSize: "0.75rem", margin: 0 }}>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="oinp"
                      style={{ margin: 0, padding: "8px 12px" }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <div style={{ color: "var(--tx2)" }}>{email}</div>
                  )}
                </div>
              </div>

              {/* Institute */}
              <div className="d-flex align-items-center gap-3">
                <div style={{ color: "var(--tx3)", width: "24px" }}><School size={18} /></div>
                <div style={{ flex: 1 }}>
                  <label className="olbl" style={{ fontSize: "0.75rem", margin: 0 }}>Institute Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="oinp"
                      style={{ margin: 0, padding: "8px 12px" }}
                      value={institute}
                      onChange={(e) => setInstitute(e.target.value)}
                    />
                  ) : (
                    <div style={{ color: "var(--tx2)" }}>{institute}</div>
                  )}
                </div>
              </div>

              {/* Course */}
              <div className="d-flex align-items-center gap-3">
                <div style={{ color: "var(--tx3)", width: "24px" }}><Book size={18} /></div>
                <div style={{ flex: 1 }}>
                  <label className="olbl" style={{ fontSize: "0.75rem", margin: 0 }}>Academic Course</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="oinp"
                      style={{ margin: 0, padding: "8px 12px" }}
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                    />
                  ) : (
                    <div style={{ color: "var(--tx2)" }}>{course}</div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 mt-3">
                {isEditing ? (
                  <button className="bgrd btn px-4 py-2" onClick={handleSave} style={{ fontSize: "0.85rem" }}>
                    Save Profile
                  </button>
                ) : (
                  <button className="boc btn px-4 py-2" onClick={() => setIsEditing(true)} style={{ fontSize: "0.85rem", gap: "6px" }}>
                    <Edit size={14} />
                    <span>Edit Profile</span>
                  </button>
                )}
                <button className="boc btn px-4 py-2" style={{ fontSize: "0.85rem", gap: "6px" }}>
                  <ShieldCheck size={14} />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
