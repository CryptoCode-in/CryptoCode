import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, BookOpen, Terminal, CheckCircle2, History, AlertTriangle } from "lucide-react";
import { mockTeacherData } from "../../utils/mockTeacherData";
import TeacherLayout from "../../components/teacher/TeacherLayout";

function Practicals({ onViewSubmissions }) {
  const [practicals, setPracticals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batch: "Second Year - Batch A",
    deadline: "",
    languages: []
  });

  const languageOptions = ["Java", "Python", "C", "C++"];

  useEffect(() => {
    setPracticals(mockTeacherData.getPracticals());
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      batch: "Second Year - Batch A",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16), // 7 days from now
      languages: ["Java"]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prac) => {
    setEditingId(prac.id);
    setFormData({
      title: prac.title,
      description: prac.description,
      batch: prac.batch,
      deadline: prac.deadline,
      languages: prac.languages
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this practical assignment?")) {
      const next = mockTeacherData.deletePractical(id);
      setPracticals(next);
      mockTeacherData.addActivity(`Deleted practical: ${practicals.find(p => p.id === id)?.title}`, "reminder");
    }
  };

  const handleLanguageToggle = (lang) => {
    setFormData(prev => {
      const languages = prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.languages.length === 0) {
      alert("Please select at least one allowed language.");
      return;
    }

    if (editingId) {
      mockTeacherData.updatePractical(editingId, formData);
      mockTeacherData.addActivity(`Updated practical: ${formData.title}`, "submission");
    } else {
      mockTeacherData.createPractical(formData);
      mockTeacherData.addActivity(`Created new practical: ${formData.title}`, "submission");
    }

    setPracticals(mockTeacherData.getPracticals());
    setIsModalOpen(false);
  };

  const formatDeadline = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <TeacherLayout
      title="Coding Practicals"
      description="Create and distribute lab practical codes, define sandbox environments, and set deadlines."
      actions={
        <button
          onClick={openCreateModal}
          className="bgrd d-flex align-items-center gap-2 px-4 py-2"
          style={{ fontSize: "0.85rem", borderRadius: "10px" }}
        >
          <Plus size={16} />
          <span>Create Practical</span>
        </button>
      }
    >

      {/* Grid List */}
      <div className="row g-4">
        {practicals.map((prac) => (
          <div className="col-12 col-md-6" key={prac.id}>
            <div
              className="cyber-card"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                  <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", padding: "8px", borderRadius: "8px", color: "var(--pur)" }}>
                    <Terminal size={18} />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => openEditModal(prac)}
                      className="boc"
                      style={{ padding: "6px", borderRadius: "6px" }}
                      title="Edit Practical"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(prac.id)}
                      className="boc"
                      style={{ padding: "6px", borderRadius: "6px", borderColor: "rgba(239,68,68,0.2)" }}
                      title="Delete Practical"
                    >
                      <Trash2 size={13} style={{ color: "#f87171" }} />
                    </button>
                  </div>
                </div>

                <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  {prac.title}
                </h4>
                
                <p style={{ fontSize: "0.82rem", color: "var(--tx2)", marginBottom: "16px", lineHeight: "1.5", minHeight: "45px" }}>
                  {prac.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--bd)", paddingTop: "14px", marginBottom: "16px" }}>
                  <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.78rem" }}>
                    <BookOpen size={13} style={{ color: "var(--tx3)" }} />
                    <span style={{ color: "var(--tx3)", width: "70px" }}>Batch:</span>
                    <strong style={{ color: "var(--tx2)" }}>{prac.batch}</strong>
                  </div>

                  <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.78rem" }}>
                    <Calendar size={13} style={{ color: "var(--tx3)" }} />
                    <span style={{ color: "var(--tx3)", width: "70px" }}>Deadline:</span>
                    <strong style={{ color: "#fbbf24" }}>{formatDeadline(prac.deadline)}</strong>
                  </div>

                  <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.78rem" }}>
                    <Terminal size={13} style={{ color: "var(--tx3)" }} />
                    <span style={{ color: "var(--tx3)", width: "70px" }}>Languages:</span>
                    <div className="d-flex gap-1.5">
                      {prac.languages.map((l) => (
                        <span key={l} style={{ fontSize: "0.68rem", background: "rgba(139,92,246,0.12)", color: "var(--pur)", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.02)" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--tx3)" }}>
                  Submissions: <strong style={{ color: "var(--tx2)" }}>{prac.submissionsCount}</strong>
                </span>
                <button
                  onClick={() => onViewSubmissions && onViewSubmissions(prac.title)}
                  className="boc px-3 py-1.5"
                  style={{ fontSize: "0.75rem", borderRadius: "8px" }}
                >
                  View Submissions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal overlays */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(10,10,15,0.8)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
        >
          <div
            className="cyber-card"
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "32px",
              position: "relative"
            }}
          >
            <h4 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>
              {editingId ? "Edit Practical Assignment" : "Create Practical Assignment"}
            </h4>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                {/* Title */}
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Practical Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Binary Search Tree Operations"
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

                {/* Description */}
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Description & Instructions
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Explain the problem constraints and coding directions..."
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--bd)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: "var(--tx)",
                      fontSize: "0.85rem",
                      width: "100%",
                      outline: "none",
                      resize: "none"
                    }}
                  />
                </div>

                {/* Batch and Deadline row */}
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Target Batch
                    </label>
                    <select
                      value={formData.batch}
                      onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                      className="code-topbar select"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px" }}
                    >
                      <option value="Second Year - All Batches">Second Year - All Batches</option>
                      <option value="Second Year - Batch A">Second Year - Batch A</option>
                      <option value="Second Year - Batch B">Second Year - Batch B</option>
                      <option value="Third Year - Batch A">Third Year - Batch A</option>
                    </select>
                  </div>

                  <div className="col-12 col-sm-6">
                    <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      style={{
                        background: "var(--bg)",
                        border: "1px solid var(--bd)",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        color: "var(--tx)",
                        fontSize: "0.85rem",
                        width: "100%",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                {/* Allowed Languages */}
                <div>
                  <label style={{ fontSize: "0.78rem", color: "var(--tx2)", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                    Allowed Programming Languages
                  </label>
                  <div className="d-flex gap-4">
                    {languageOptions.map((lang) => (
                      <label key={lang} className="d-flex align-items-center gap-2" style={{ cursor: "pointer", fontSize: "0.85rem" }}>
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(lang)}
                          onChange={() => handleLanguageToggle(lang)}
                          style={{
                            accentColor: "var(--pur)",
                            width: "15px",
                            height: "15px"
                          }}
                        />
                        <span style={{ color: "var(--tx2)" }}>{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="d-flex align-items-center justify-content-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="boc px-4 py-2"
                  style={{ fontSize: "0.85rem", borderRadius: "10px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bgrd px-4 py-2"
                  style={{ fontSize: "0.85rem", borderRadius: "10px" }}
                >
                  {editingId ? "Save Changes" : "Create Practical"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}

export default Practicals;
