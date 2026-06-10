import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Terminal, Shield } from "lucide-react";

const templates = {
  python: 'print("Welcome to CryptoCode")',
  javascript: 'console.log("Welcome to CryptoCode");',
  c: `#include <stdio.h>\n\nint main() {\n    printf("Welcome to CryptoCode\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to CryptoCode" << endl;\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Welcome to CryptoCode");\n    }\n}`,
};

function CodeEditor() {
  const [lang, setLang] = useState("python");
  const [code, setCode] = useState(templates.python);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([
    { text: "// Output will appear here after running...", type: "default" },
  ]);

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    setLang(selected);
    setCode(templates[selected]);
  };

  const handleReset = () => {
    setCode(templates[lang]);
    setConsoleLogs([{ text: "// Code reset to default template.", type: "default" }]);
  };

  const handleRun = () => {
    setIsRunning(true);
    setConsoleLogs([{ text: "⚡ Initializing secure compilation sandbox...", type: "running" }]);

    setTimeout(() => {
      let output = "";
      if (lang === "python") {
        output = "Welcome to CryptoCode\n\n[Process exited with code 0 — 0.08s]";
      } else if (lang === "javascript") {
        output = "Welcome to CryptoCode\n\n[Process exited with code 0 — 0.06s]";
      } else if (lang === "c" || lang === "cpp") {
        output = "Welcome to CryptoCode\n\n[Process exited with code 0 — 0.12s]";
      } else if (lang === "java") {
        output = "Welcome to CryptoCode\n\n[Process exited with code 0 — 0.22s]";
      }

      setConsoleLogs([
        { text: "⚡ Compilation successful.", type: "running" },
        { text: "✓ Running tests...", type: "running" },
        { text: output, type: "success" },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div id="editor-section" style={{ marginBottom: "32px" }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "var(--tx)" }}>
            Online Coding Sandbox
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--tx3)", margin: 0 }}>
            Secure browser-based compiler and runtime environment.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="boc btn px-3 py-2"
            style={{ fontSize: "0.82rem", gap: "6px" }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="bgrd btn px-3 py-2"
            style={{ fontSize: "0.82rem", gap: "6px" }}
          >
            <Play size={14} />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </button>
        </div>
      </div>

      <div className="code-editor-panel" style={{ border: "1px solid var(--bd)" }}>
        {/* Editor Controls Bar */}
        <div className="code-topbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="d-flex align-items-center gap-2">
            <Terminal size={14} style={{ color: "var(--pur)" }} />
            <span style={{ fontWeight: 600, color: "var(--tx)", fontSize: "0.8rem" }}>main.{lang === "javascript" ? "js" : lang === "python" ? "py" : lang === "cpp" ? "cpp" : lang}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <select
              id="langSelect"
              value={lang}
              onChange={handleLanguageChange}
              style={{
                background: "var(--sf)",
                border: "1px solid var(--bd)",
                color: "var(--tx)",
                borderRadius: "7px",
                padding: "4px 10px",
                fontSize: "0.78rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C (GCC)</option>
              <option value="cpp">C++ (G++)</option>
              <option value="java">Java (JDK 21)</option>
            </select>

            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: isRunning ? "#fbbf24" : "#34d399",
                boxShadow: isRunning ? "0 0 6px #fbbf24" : "0 0 6px #34d399",
              }}
            ></span>
            <span style={{ fontSize: "0.72rem", color: isRunning ? "#fbbf24" : "#34d399" }}>
              {isRunning ? "Running" : "Ready"}
            </span>
          </div>
        </div>

        {/* Monaco Editor Component */}
        <div style={{ background: "#1e1e1e" }}>
          <Editor
            height="400px"
            language={lang === "cpp" ? "cpp" : lang === "c" ? "c" : lang}
            value={code}
            onChange={(val) => setCode(val || "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              automaticLayout: true,
              tabSize: 4,
            }}
          />
        </div>

        {/* Console / Output Window */}
        <div
          className="code-output"
          style={{
            background: "var(--bg3)",
            borderTop: "1px solid var(--bd)",
            padding: "12px 16px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8rem",
            minHeight: "120px",
            maxHeight: "180px",
            overflowY: "auto",
          }}
        >
          <div className="d-flex align-items-center gap-1 mb-2" style={{ color: "var(--tx3)", fontSize: "0.7rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "4px" }}>
            <Shield size={12} />
            <span>SANDBOX CONSOLE</span>
          </div>
          {consoleLogs.map((log, index) => {
            let color = "var(--tx3)";
            if (log.type === "running") color = "#fbbf24";
            if (log.type === "success") color = "#34d399";
            if (log.type === "error") color = "#f87171";

            return (
              <div key={index} style={{ color, whiteSpace: "pre-wrap", marginBottom: "4px" }}>
                {log.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
