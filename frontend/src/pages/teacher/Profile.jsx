import { useState, useEffect } from "react";
import { User, Mail, Phone, BookOpen, School, Calendar, Edit2, CheckCircle2 } from "lucide-react";
import { mockTeacherData } from "../../utils/mockTeacherData";
import TeacherLayout from "../../components/teacher/TeacherLayout";

function Profile({ onProfileUpdate }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    college: "",
    email: "",
    phone: ""
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const prof = mockTeacherData.getProfile();
    setProfile(prof);
    setFormData({
      name: prof.name,
      department: prof.department,
      college: prof.college,
      email: prof.email,
      phone: prof.phone
    });
  }, []);

  if (!profile) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--tx2)" }}>
        Loading profile details...
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = mockTeacherData.updateProfile(formData);
    setProfile(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    if (onProfileUpdate) {
      onProfileUpdate(updated);
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const userInitial = profile.name ? profile.name[0].toUpperCase() : "T";

  return (
    <TeacherLayout
      title="My Profile"
      description="View and manage your academic profile information."
    >

      {saveSuccess && (
        <div 
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "10px",
            padding: "12px 16px",
            color: "#34d399",
            fontSize: "0.85rem"
          }}
          className="d-flex align-items-center gap-2 mb-4"
        >
          <CheckCircle2 size={16} />
          <span>Profile details saved successfully!</span>
        </div>
      )}

      {/* Profile Details Panel */}
      <div className="cyber-card" style={{ padding: "32px" }}>
        
        {/* Header Photo/Initial Section */}
        <div className="d-flex align-items-center flex-wrap gap-4 mb-5" style={{ borderBottom: "1px solid var(--bd)", paddingBottom: "24px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "18px",
              background: "var(--grad)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#fff",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
              flexShrink: 0
            }}
          >
            {userInitial}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: 0 }}>
              {profile.name}
            </h4>
            <span style={{ fontSize: "0.8rem", color: "var(--tx3)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: "6px", display: "inline-block", marginTop: "4px", fontWeight: 600 }}>
              Teacher Credentials
            </span>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bgrd d-flex align-items-center gap-2 px-4 py-2"
              style={{ fontSize: "0.85rem", borderRadius: "10px" }}
            >
              <Edit2 size={14} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* View/Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className="row g-4 mb-4">
              <div className="col-12 col-sm-6">
                <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--bd)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "var(--tx)",
                    fontSize: "0.85rem",
                    width: "100%",
                    outline: "none"
                  }}
                />
              </div>

              <div className="col-12 col-sm-6">
                <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>Department</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--bd)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "var(--tx)",
                    fontSize: "0.85rem",
                    width: "100%",
                    outline: "none"
                  }}
                />
              </div>

              <div className="col-12 col-sm-6">
                <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>College</label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => handleInputChange("college", e.target.value)}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--bd)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "var(--tx)",
                    fontSize: "0.85rem",
                    width: "100%",
                    outline: "none"
                  }}
                />
              </div>

              <div className="col-12 col-sm-6">
                <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>Email ID</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--bd)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "var(--tx)",
                    fontSize: "0.85rem",
                    width: "100%",
                    outline: "none"
                  }}
                />
              </div>

              <div className="col-12 col-sm-6">
                <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--bd)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "var(--tx)",
                    fontSize: "0.85rem",
                    width: "100%",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <button
                type="submit"
                className="bgrd px-4 py-2"
                style={{ fontSize: "0.85rem", borderRadius: "10px" }}
              >
                Save Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: profile.name,
                    department: profile.department,
                    college: profile.college,
                    email: profile.email,
                    phone: profile.phone
                  });
                  setIsEditing(false);
                }}
                className="boc px-4 py-2"
                style={{ fontSize: "0.85rem", borderRadius: "10px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
              <BookOpen size={18} style={{ color: "var(--tx3)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--tx3)", fontWeight: 600 }}>Department</div>
                <div style={{ fontSize: "0.9rem", color: "var(--tx)", fontWeight: 600 }}>{profile.department}</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
              <School size={18} style={{ color: "var(--tx3)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--tx3)", fontWeight: 600 }}>College</div>
                <div style={{ fontSize: "0.9rem", color: "var(--tx)", fontWeight: 600 }}>{profile.college}</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
              <Mail size={18} style={{ color: "var(--tx3)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--tx3)", fontWeight: 600 }}>Email Address</div>
                <div style={{ fontSize: "0.9rem", color: "var(--tx)", fontWeight: 600 }}>{profile.email}</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
              <Phone size={18} style={{ color: "var(--tx3)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--tx3)", fontWeight: 600 }}>Phone Number</div>
                <div style={{ fontSize: "0.9rem", color: "var(--tx)", fontWeight: 600 }}>{profile.phone}</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
              <Calendar size={18} style={{ color: "var(--tx3)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--tx3)", fontWeight: 600 }}>Joined On</div>
                <div style={{ fontSize: "0.9rem", color: "var(--tx)", fontWeight: 600 }}>{profile.joinedOn}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </TeacherLayout>
  );
}

export default Profile;
