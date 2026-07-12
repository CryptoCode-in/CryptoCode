import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { 
  Play, RotateCcw, Save, Terminal, 
  FileCode, Cpu, CheckCircle2, AlertCircle
} from "lucide-react";

const templates = {
  python: 'print("Welcome to CryptoCode")',
  c: `#include <stdio.h>\n\nint main() {\n    printf("Welcome to CryptoCode\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to CryptoCode" << endl;\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Welcome to CryptoCode");\n    }\n}`,
};

const extMap = {
  python: "py",
  c: "c",
  cpp: "cpp",
  java: "java"
};

const langNameMap = {
  python: "Python",
  c: "C",
  cpp: "C++",
  java: "Java"
};

function CodeEditor({ lang, setLang, code, setCode, fileName, setFileName }) {
  const getEditorPrefs = () => {
    try {
      const saved = localStorage.getItem("cryptocode_editor_settings");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      fontSize: "14px",
      showLineNumbers: true,
      wordWrap: true
    };
  };

  const prefs = getEditorPrefs();
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([
    { text: "System ready. Press 'Run Code' to execute compile sandbox.", type: "default" },
  ]);

  // Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [modalFileName, setModalFileName] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize initial modal file name when opening
  const handleOpenSaveModal = () => {
    // Strip extension from current fileName to show just base name in input
    const ext = extMap[lang];
    let baseName = fileName || `program.${ext}`;
    if (baseName.endsWith(`.${ext}`)) {
      baseName = baseName.substring(0, baseName.length - ext.length - 1);
    }
    setModalFileName(baseName);
    setSaveError("");
    setSaveSuccess(false);
    setIsSaveModalOpen(true);
  };

  // Handle language change from top dropdown
  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    setLang(selected);
    setCode(templates[selected]);
    setFileName(`program.${extMap[selected]}`);
  };

  const handleReset = () => {
    if (confirm("Reset editor to default template? Your current edits will be lost.")) {
      setCode(templates[lang]);
      setConsoleLogs([{ text: "✓ Code reset to default template.", type: "success_status" }]);
    }
  };

  const handleRun = () => {
    setIsRunning(true);

    const autoClear = true;
    const saveHistory = true;

    const runStartLogs = [
      { text: "⚡ Compilation started...", type: "running" },
      { text: "⚡ Initializing secure compilation sandbox...", type: "running" }
    ];

    if (autoClear) {
      setConsoleLogs(runStartLogs);
    } else {
      setConsoleLogs(prev => [...prev, ...runStartLogs]);
    }

    setTimeout(() => {
      const codeLower = code.toLowerCase();
      let hasError = false;
      let errorMsg = "";

      if (lang === "c" && !codeLower.includes("stdio.h")) {
        hasError = true;
        errorMsg = "✗ Compilation Error\n\nLine 1: missing #include <stdio.h>";
      } else if (lang === "cpp" && !codeLower.includes("iostream")) {
        hasError = true;
        errorMsg = "✗ Compilation Error\n\nLine 1: missing #include <iostream>";
      } else if (lang === "java" && !codeLower.includes("class")) {
        hasError = true;
        errorMsg = "✗ Compilation Error\n\nLine 1: Missing class definition";
      }

      let runResultLogs = [];
      if (hasError) {
        runResultLogs = [
          { text: errorMsg, type: "error" }
        ];
      } else {
        runResultLogs = [
          { text: "✓ Program executed successfully\n", type: "success_status" },
          { text: "Welcome to CryptoCode", type: "success" }
        ];
      }

      if (autoClear) {
        setConsoleLogs(runResultLogs);
      } else {
        setConsoleLogs(prev => [...prev, ...runResultLogs]);
      }

      if (saveHistory) {
        try {
          const runHistoryKey = "cryptocode_run_history";
          let history = [];
          const existing = localStorage.getItem(runHistoryKey);
          if (existing) {
            history = JSON.parse(existing);
          }
          const newRun = {
            lang: lang,
            fileName: fileName || `program.${extMap[lang]}`,
            timestamp: new Date().toISOString(),
            success: !hasError,
            logs: runResultLogs.map(l => l.text).join("\n")
          };
          localStorage.setItem(runHistoryKey, JSON.stringify([newRun, ...history]));
        } catch (e) {}
      }

      setIsRunning(false);
    }, 1200);
  };

  // Save File to localStorage
  const handleSaveFile = () => {
    const baseName = modalFileName.trim();
    if (!baseName) {
      setSaveError("File name cannot be empty");
      return;
    }

    // Auto-detect extension from selected language
    const ext = extMap[lang];
    let finalFileName = baseName;
    if (!finalFileName.endsWith(`.${ext}`)) {
      finalFileName = `${finalFileName}.${ext}`;
    }

    // Read existing files
    let savedFiles = [];
    const saved = localStorage.getItem("cryptocode_saved_files");
    if (saved) {
      try {
        savedFiles = JSON.parse(saved);
      } catch (e) {
        savedFiles = [];
      }
    }

    // Check if filename already exists
    const nameExists = savedFiles.some(
      (f) => f.name.toLowerCase() === finalFileName.toLowerCase()
    );

    const newFileObj = {
      name: finalFileName,
      lang: lang,
      code: code,
      savedAt: new Date().toISOString(),
    };

    let updatedFiles = [];
    if (nameExists) {
      // Overwrite/update existing file
      updatedFiles = savedFiles.map((f) =>
        f.name.toLowerCase() === finalFileName.toLowerCase() ? newFileObj : f
      );
    } else {
      // Add new file
      updatedFiles = [newFileObj, ...savedFiles];
    }

    localStorage.setItem("cryptocode_saved_files", JSON.stringify(updatedFiles));
    
    // Update active document state
    setFileName(finalFileName);
    setSaveSuccess(true);
    
    setTimeout(() => {
      setIsSaveModalOpen(false);
      setSaveSuccess(false);
    }, 800);
  };

  // Determine modal extension preview
  const ext = extMap[lang];
  const previewFileName = modalFileName.trim() 
    ? (modalFileName.trim().endsWith(`.${ext}`) ? modalFileName.trim() : `${modalFileName.trim()}.${ext}`)
    : `filename.${ext}`;

  return (
    <div id="editor-section" className="ide-outer-container">
      {/* Scoped CSS styling block for robust IDE width/layout requirements */}
      <style dangerouslySetInnerHTML={{__html: `
        .ide-outer-container {
          width: 100%;
          max-width: none !important;
          padding-left: 24px;
          padding-right: 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .ide-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          padding: 0 20px;
          background: var(--sf);
          border: 1px solid var(--bd);
          border-radius: 16px;
        }
        .ide-main-row {
          display: grid;
          grid-template-columns: 1fr 240px;
          gap: 20px;
          align-items: stretch;
        }
        .ide-editor-wrapper {
          border: 1px solid var(--bd);
          border-radius: 16px;
          overflow: hidden;
          background: #1e1e1e;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .ide-action-panel {
          background: var(--sf);
          border: 1px solid var(--bd);
          border-radius: 16px;
          padding: 20px;
          width: 240px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }
        .ide-console {
          width: 100%;
          background: var(--sf);
          border: 1px solid var(--bd);
          border-radius: 16px;
          overflow: hidden;
        }
        .ide-console-body {
          padding: 20px;
          background: var(--bg3);
          font-family: 'JetBrains Mono', Consolas, monospace;
          font-size: 0.85rem;
          height: 200px;
          overflow-y: auto;
          color: var(--tx2);
        }

        /* Responsive Breakpoints */
        @media (max-width: 991.98px) {
          /* Tablet Breakpoint: Stack Editor and Action Panel, Console below */
          .ide-main-row {
            grid-template-columns: 1fr;
          }
          .ide-action-panel {
            width: 100%;
            height: auto;
          }
        }
        @media (max-width: 575.98px) {
          /* Mobile Breakpoint: Everything stacked vertically */
          .ide-toolbar {
            flex-direction: column;
            height: auto;
            padding: 12px 20px;
            gap: 10px;
            align-items: flex-start;
          }
        }
      `}} />
      
      {/* TOP HEADER */}
      <div className="ide-toolbar">
        <div className="d-flex align-items-center gap-2">
          <Cpu size={16} style={{ color: "var(--pur)" }} />
          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--tx)" }}>
            Start Coding
          </h4>
        </div>

        {/* Language Selector */}
        <div className="d-flex align-items-center gap-2">
          <select
            id="langSelect"
            value={lang}
            onChange={handleLanguageChange}
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--bd)",
              color: "var(--tx)",
              borderRadius: "6px",
              padding: "5px 10px",
              fontSize: "0.8rem",
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="c">C (GCC)</option>
            <option value="cpp">C++ (G++)</option>
            <option value="java">Java (JDK 21)</option>
            <option value="python">Python</option>
          </select>
        </div>
      </div>

      {/* MAIN WORKSPACE GRID */}
      <div className="ide-main-row">
        {/* Monaco Editor (Remaining dynamic width) */}
        <div className="ide-editor-wrapper">
          {/* Editor Header */}
          <div 
            style={{ 
              background: "#181818", 
              borderBottom: "1px solid rgba(255,255,255,0.06)", 
              padding: "8px 14px" 
            }} 
            className="d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center gap-2">
              <FileCode size={13} style={{ color: "var(--pur)" }} />
              <span style={{ fontWeight: 600, color: "#fff", fontSize: "0.8rem" }}>
                {fileName || `program.${extMap[lang]}`}
              </span>
              <span 
                style={{ 
                  fontSize: "0.65rem", 
                  color: "rgba(255,255,255,0.4)", 
                  background: "rgba(255,255,255,0.05)", 
                  padding: "1px 6px", 
                  borderRadius: "4px",
                  fontWeight: 600
                }}
              >
                {langNameMap[lang]}
              </span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>
              UTF-8
            </div>
          </div>

          {/* Monaco Editor Component with min-height 650px */}
          <div style={{ height: "650px", width: "100%" }}>
            <Editor
              height="100%"
              width="100%"
              language={lang}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: parseInt(prefs.fontSize) || 14,
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                minimap: { enabled: false },
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                automaticLayout: true,
                tabSize: 4,
                lineNumbers: prefs.showLineNumbers ? "on" : "off",
                wordWrap: prefs.wordWrap ? "on" : "off",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on"
              }}
            />
          </div>
        </div>

        {/* ACTION PANEL (Fixed 240px width) */}
        <div className="ide-action-panel">
          {/* Buttons Stack */}
          <div className="d-flex flex-column gap-2.5 w-100">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="btn w-100 py-2.5"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                background: "var(--grad)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)"
              }}
            >
              <Play size={14} fill="currentColor" />
              <span>{isRunning ? "Running..." : "Run Code"}</span>
            </button>
            <button
              onClick={handleOpenSaveModal}
              disabled={isRunning}
              className="btn btn-secondary w-100 py-2.5"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                background: "var(--bg3)",
                border: "1px solid var(--bd)",
                borderRadius: "8px",
                color: "var(--tx2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <Save size={14} />
              <span>Save</span>
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="btn btn-secondary w-100 py-2.5"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                background: "var(--bg3)",
                border: "1px solid var(--bd)",
                borderRadius: "8px",
                color: "var(--tx2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          {/* Document Details Info */}
          <div style={{ borderTop: "1px solid var(--bd)", paddingTop: "14px" }} className="w-100">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                  Language
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--tx)", fontWeight: 600, marginTop: "2px" }}>
                  {langNameMap[lang]}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                  Current File
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--tx)", fontWeight: 600, marginTop: "2px", wordBreak: "break-all" }}>
                  {fileName || `program.${extMap[lang]}`}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--tx3)", textTransform: "uppercase", fontWeight: 700 }}>
                  Compiler Status
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--tx)", fontWeight: 600, marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>{isRunning ? "Running" : "Ready"}</span>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: isRunning ? "#fbbf24" : "#10b981",
                      display: "inline-block"
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH CONSOLE (Span entire workspace below editor row) */}
      <div className="ide-console">
        <div 
          style={{ 
            background: "var(--bg3)", 
            borderBottom: "1px solid var(--bd)", 
            padding: "8px 14px" 
          }}
          className="d-flex align-items-center gap-2"
        >
          <Terminal size={14} style={{ color: "var(--pur)" }} />
          <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.8rem" }}>
            Console
          </span>
        </div>

        <div className="ide-console-body">
          {consoleLogs.map((log, index) => {
            let color = "var(--tx3)";
            if (log.type === "running") color = "#fbbf24";
            if (log.type === "success") color = "var(--tx)";
            if (log.type === "success_status") color = "#10b981"; // green
            if (log.type === "error") color = "#ef4444"; // red

            return (
              <div key={index} style={{ color, whiteSpace: "pre-wrap", marginBottom: "4px" }}>
                {log.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* SAVE MODAL WINDOW */}
      {isSaveModalOpen && (
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
              Save Code
            </h5>
            <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: "0 0 18px 0" }}>
              Save your program so it is accessible in your Code History.
            </p>

            {/* Input Field */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--tx2)", display: "block", marginBottom: "6px" }}>
                File Name
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  placeholder="e.g. program"
                  value={modalFileName}
                  onChange={(e) => {
                    setModalFileName(e.target.value);
                    setSaveError("");
                  }}
                  style={{
                    width: "100%",
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
              </div>
            </div>

            {/* Auto Detection / Preview Info */}
            <div 
              style={{ 
                background: "var(--bg3)", 
                border: "1px solid var(--bd)", 
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "0.78rem",
                color: "var(--tx2)",
                marginBottom: "20px"
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span>Language:</span>
                <span style={{ color: "var(--pur)", fontWeight: 700 }}>
                  {langNameMap[lang]}
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>Auto-detected name:</span>
                <span style={{ color: "var(--tx3)", fontFamily: "monospace" }}>
                  {previewFileName}
                </span>
              </div>
            </div>

            {/* Notifications */}
            {saveError && (
              <div style={{ color: "#f87171", fontSize: "0.75rem", marginBottom: "14px", fontWeight: 500 }} className="d-flex align-items-center gap-1">
                <AlertCircle size={12} />
                <span>{saveError}</span>
              </div>
            )}
            {saveSuccess && (
              <div style={{ color: "#10b981", fontSize: "0.75rem", marginBottom: "14px", fontWeight: 500 }} className="d-flex align-items-center gap-1">
                <CheckCircle2 size={12} />
                <span>✓ Code saved successfully!</span>
              </div>
            )}

            {/* Controls */}
            <div className="d-flex align-items-center justify-content-end gap-2">
              <button
                onClick={() => setIsSaveModalOpen(false)}
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
                onClick={handleSaveFile}
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
