import { useState, useEffect } from "react";
import { 
  Folder, FolderOpen, FileCode, Trash2, Edit, 
  ExternalLink, Search, ChevronRight, ChevronDown, Calendar, Filter
} from "lucide-react";

function CodeHistory({ onOpenFile }) {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Folder expansion state
  const [expandedFolders, setExpandedFolders] = useState({
    c: true,
    cpp: true,
    java: true,
    python: true
  });

  // Rename modal state
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [newName, setNewName] = useState("");
  const [renameError, setRenameError] = useState("");

  // Load files from localStorage
 useEffect(() => {
  const fetchSubmissions = async () => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("cryptocode_user")
      );

      if (!currentUser?.id) {
        setFiles([]);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/submissions?user_id=${currentUser.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch submissions:", data);
        setFiles([]);
        return;
      }

      const formattedFiles = data.submissions.map((submission) => ({
        name: `submission-${submission.id}`,
        lang: submission.language,
        code: submission.source_code,
        savedAt: submission.submitted_at,
      }));

      setFiles(formattedFiles);
    } catch (error) {
      console.error("Fetch submissions error:", error);
      setFiles([]);
    }
  };

  fetchSubmissions();
}, []);

  const saveFilesToStorage = (updatedFiles) => {
    setFiles(updatedFiles);
    localStorage.setItem("cryptocode_saved_files", JSON.stringify(updatedFiles));
  };

  // Toggle folder open/closed
  const toggleFolder = (folderKey) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  // Delete handler
  const handleDelete = (name, e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = files.filter(f => f.name !== name);
      saveFilesToStorage(updated);
    }
  };

  // Open Rename Modal
  const openRenameModal = (file, e) => {
    e.stopPropagation();
    setRenameTarget(file);
    setNewName(file.name);
    setRenameError("");
    setIsRenameOpen(true);
  };

  // Submit Rename
  const handleRename = () => {
    if (!newName.trim()) {
      setRenameError("File name cannot be empty");
      return;
    }
    
    const normalizedName = newName.trim();
    
    // Ensure we don't duplicate filename
    const exists = files.some(f => f.name.toLowerCase() === normalizedName.toLowerCase() && f.name !== renameTarget.name);
    if (exists) {
      setRenameError("A file with this name already exists");
      return;
    }

    const updated = files.map(f => {
      if (f.name === renameTarget.name) {
        return { ...f, name: normalizedName };
      }
      return f;
    });

    saveFilesToStorage(updated);
    setIsRenameOpen(false);
    setRenameTarget(null);
  };

  // Helper: Format Date
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  };

  const foldersInfo = {
    c: { title: "C", key: "c" },
    cpp: { title: "C++", key: "cpp" },
    java: { title: "Java", key: "java" },
    python: { title: "Python", key: "python" }
  };

  // Filtering files
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || file.lang === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Automatically expand folders that have matches when searching
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setExpandedFolders({
        c: true,
        cpp: true,
        java: true,
        python: true
      });
    }
  }, [searchQuery]);

  return (
    <div id="code-history-section" style={{ marginBottom: "32px", maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
      {/* Header & Description */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--tx)", margin: 0 }}>
            Code History
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--tx3)", margin: "4px 0 0 0" }}>
            Explore, organize, and open your saved code programs.
          </p>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div 
        className="d-flex flex-column flex-md-row gap-3 mb-4 p-3"
        style={{
          background: "var(--sf)",
          border: "1px solid var(--bd)",
          borderRadius: "16px"
        }}
      >
        {/* Search Input */}
        <div className="position-relative flex-grow-1">
          <Search 
            size={16} 
            style={{ 
              position: "absolute", 
              left: "12px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "var(--tx3)" 
            }} 
          />
          <input
            type="text"
            placeholder="Search saved files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "var(--bg3)",
              border: "1px solid var(--bd)",
              borderRadius: "10px",
              padding: "10px 14px 10px 38px",
              color: "var(--tx)",
              fontSize: "0.875rem",
              outline: "none"
            }}
          />
        </div>

        {/* Filters */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="d-flex align-items-center gap-1.5" style={{ fontSize: "0.78rem", color: "var(--tx3)", marginRight: "4px" }}>
            <Filter size={13} />
            Filter:
          </span>
          {["all", "c", "cpp", "java", "python"].map((l) => (
            <button
              key={l}
              onClick={() => setActiveFilter(l)}
              style={{
                background: activeFilter === l ? "var(--pur)" : "var(--bg3)",
                border: `1px solid ${activeFilter === l ? "var(--pur)" : "var(--bd)"}`,
                color: activeFilter === l ? "#fff" : "var(--tx2)",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {l === "all" ? "All Languages" : l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* File Explorer Tree Structure */}
      {files.length === 0 ? (
        <div 
          className="text-center p-5"
          style={{
            background: "var(--sf)",
            border: "1px solid var(--bd)",
            borderRadius: "18px",
            color: "var(--tx3)"
          }}
        >
          <Folder size={48} className="mb-3" style={{ color: "var(--pur)", opacity: 0.7, margin: "0 auto" }} />
          <h5 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 6px 0" }}>
            No saved files yet.
          </h5>
          <p style={{ fontSize: "0.82rem", color: "var(--tx3)", margin: 0 }}>
            Start coding and save your first program.
          </p>
        </div>
      ) : (
        <div 
          style={{
            background: "var(--sf)",
            border: "1px solid var(--bd)",
            borderRadius: "18px",
            overflow: "hidden"
          }}
        >
          {/* Folder loop */}
          {Object.entries(foldersInfo).map(([key, folder]) => {
            // Get files inside this folder
            const filesInFolder = filteredFiles.filter(f => f.lang === key);
            
            // If a language filter is active and doesn't match this folder, hide folder
            if (activeFilter !== "all" && activeFilter !== key) return null;

            const isExpanded = expandedFolders[key];
            
            return (
              <div key={key} style={{ borderBottom: "1px solid var(--bd)" }}>
                {/* Folder Row Header */}
                <div
                  onClick={() => toggleFolder(key)}
                  className="d-flex align-items-center justify-content-between p-3"
                  style={{
                    cursor: "pointer",
                    background: isExpanded ? "rgba(255, 255, 255, 0.01)" : "transparent",
                    userSelect: "none",
                    transition: "background 0.2s ease"
                  }}
                >
                  <div className="d-flex align-items-center gap-2.5">
                    <div style={{ color: "var(--tx3)" }}>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                    <div style={{ color: "var(--pur)" }}>
                      {isExpanded ? <FolderOpen size={18} fill="rgba(139, 92, 246, 0.1)" /> : <Folder size={18} fill="rgba(139, 92, 246, 0.05)" />}
                    </div>
                    <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.9rem" }}>
                      {folder.title} Folder
                    </span>
                    <span 
                      style={{ 
                        fontSize: "0.7rem", 
                        background: "var(--bg3)", 
                        color: "var(--tx3)", 
                        padding: "2px 7px", 
                        borderRadius: "6px",
                        border: "1px solid var(--bd)"
                      }}
                    >
                      {filesInFolder.length} {filesInFolder.length === 1 ? "file" : "files"}
                    </span>
                  </div>
                </div>

                {/* Folder Contents */}
                {isExpanded && (
                  <div style={{ background: "var(--bg3)" }}>
                    {filesInFolder.length === 0 ? (
                      <div className="p-3 text-center" style={{ fontSize: "0.8rem", color: "var(--tx3)", fontStyle: "italic" }}>
                        No matching {folder.title} files found.
                      </div>
                    ) : (
                      <div>
                        {filesInFolder.map((file) => (
                          <div
                            key={file.name}
                            onClick={() => onOpenFile(file)}
                            className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between px-4 py-3 file-item-row"
                            style={{
                              borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
                              cursor: "pointer",
                              transition: "background 0.2s ease"
                            }}
                          >
                            {/* File Details (Left) */}
                            <div className="d-flex align-items-center gap-3">
                              <FileCode size={16} style={{ color: "var(--pur)" }} />
                              <div>
                                <div style={{ fontWeight: 500, color: "var(--tx)", fontSize: "0.85rem" }}>
                                  {file.name}
                                </div>
                                <div className="d-flex align-items-center gap-3 mt-1" style={{ fontSize: "0.75rem", color: "var(--tx3)" }}>
                                  <span className="d-flex align-items-center gap-1">
                                    <Calendar size={11} />
                                    Last Modified: {formatDate(file.savedAt)}
                                  </span>
                                  <span 
                                    style={{ 
                                      textTransform: "uppercase", 
                                      fontSize: "0.65rem", 
                                      fontWeight: 700, 
                                      background: "rgba(139, 92, 246, 0.08)", 
                                      color: "var(--pur)",
                                      padding: "1px 6px",
                                      borderRadius: "4px",
                                      border: "1px solid rgba(139, 92, 246, 0.15)"
                                    }}
                                  >
                                    {file.lang}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons (Right) */}
                            <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => onOpenFile(file)}
                                className="btn btn-sm d-flex align-items-center gap-1"
                                title="Open in Editor"
                                style={{
                                  background: "rgba(139, 92, 246, 0.08)",
                                  border: "1px solid rgba(139, 92, 246, 0.15)",
                                  color: "var(--pur)",
                                  fontSize: "0.75rem",
                                  padding: "5px 10px",
                                  borderRadius: "8px",
                                  cursor: "pointer"
                                }}
                              >
                                <ExternalLink size={12} />
                                <span>Open</span>
                              </button>
                              <button
                                onClick={(e) => openRenameModal(file, e)}
                                className="btn btn-sm d-flex align-items-center gap-1"
                                title="Rename File"
                                style={{
                                  background: "var(--sf)",
                                  border: "1px solid var(--bd)",
                                  color: "var(--tx2)",
                                  fontSize: "0.75rem",
                                  padding: "5px 10px",
                                  borderRadius: "8px",
                                  cursor: "pointer"
                                }}
                              >
                                <Edit size={12} />
                                <span>Rename</span>
                              </button>
                              <button
                                onClick={(e) => handleDelete(file.name, e)}
                                className="btn btn-sm d-flex align-items-center justify-content-center text-danger"
                                title="Delete File"
                                style={{
                                  background: "rgba(239, 68, 68, 0.06)",
                                  border: "1px solid rgba(239, 68, 68, 0.15)",
                                  width: "30px",
                                  height: "30px",
                                  padding: 0,
                                  borderRadius: "8px",
                                  cursor: "pointer"
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rename Modal Dialog */}
      {isRenameOpen && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
            padding: "20px"
          }}
        >
          <div
            style={{
              background: "var(--sf)",
              border: "1px solid var(--bd)",
              borderRadius: "18px",
              width: "100%",
              maxWidth: "420px",
              padding: "24px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
            }}
          >
            <h5 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--tx)", margin: "0 0 8px 0" }}>
              Rename File
            </h5>
            <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: "0 0 16px 0" }}>
              Change the name of your saved file.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--tx2)", display: "block", marginBottom: "6px" }}>
                New File Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setRenameError("");
                }}
                className="w-100"
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--bd)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  color: "var(--tx)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
                autoFocus
              />
              {renameError && (
                <div style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "6px", fontWeight: 500 }}>
                  {renameError}
                </div>
              )}
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2">
              <button
                onClick={() => {
                  setIsRenameOpen(false);
                  setRenameTarget(null);
                }}
                style={{
                  background: "transparent",
                  border: "1px solid var(--bd)",
                  color: "var(--tx2)",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                style={{
                  background: "var(--pur)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeHistory;
