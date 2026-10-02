import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import { 
  Play, Square, RotateCcw, Save,
  CheckCircle2, AlertCircle, Copy, Check,
  Trash2, Maximize2, Minimize2, ChevronDown,
  Radio, Send, Code2, Plus, X,
  FilePlus, FolderOpen
} from "lucide-react";

const templates = {
  python: `# Welcome to CryptoCode Python Workspace\nname = input()\nage = input()\nprint(f"Hello, {name}! You are {age} years old.")\n`,
  c: `#include <stdio.h>\n\nint main(void) {\n    char name[64];\n    int age;\n    if (scanf("%63s %d", name, &age) == 2) {\n        printf("Hello, %s! You are %d years old.\\n", name, age);\n    } else {\n        printf("Welcome to CryptoCode C Compiler\\n");\n    }\n    return 0;\n}`,
  cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name;\n    int age;\n    if (cin >> name >> age) {\n        cout << "Hello, " << name << "! You are " << age << " years old." << endl;\n    } else {\n        cout << "Welcome to CryptoCode C++" << endl;\n    }\n    return 0;\n}`,
  java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNext()) {\n            String name = scanner.next();\n            int age = scanner.hasNextInt() ? scanner.nextInt() : 0;\n            System.out.println("Hello, " + name + "! You are " + age + " years old.");\n        } else {\n            System.out.println("Welcome to CryptoCode Java");\n        }\n    }\n}`
};

const extMap = {
  python: "py",
  c: "c",
  cpp: "cpp",
  java: "java"
};

const defaultFileMap = {
  python: "main.py",
  c: "main.c",
  cpp: "main.cpp",
  java: "Main.java"
};

const langNameMap = {
  python: "Python",
  c: "C",
  cpp: "C++",
  java: "Java"
};

const langIconMap = {
  python: "🐍",
  c: "⚡",
  cpp: "⚙",
  java: "☕"
};

function CodeEditor({
  lang = "c",
  setLang,
  code = "",
  setCode,
  fileName = "main.c",
  setFileName,
  submissionId,
  setSubmissionId
}) {
  // Execution & Socket State
  const socketRef = useRef(null);
  const sessionIdRef = useRef(null);
  const inputQueueRef = useRef([]);
  const terminalEndRef = useRef(null);
  const editorContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const plusMenuRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState({
    stage: "idle",
    status: "idle",
    message: "Ready"
  });

  const [outputLogs, setOutputLogs] = useState([
    {
      text: "⚡ Interactive Terminal ready. Click 'Run' to execute code.\n",
      type: "system"
    }
  ]);
  const [stdinText, setStdinText] = useState("Alice\n30");
  const [isStdinOpen, setIsStdinOpen] = useState(false);
  const [liveInputText, setLiveInputText] = useState("");

  // Toolbar & Menu States
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [modalFileName, setModalFileName] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /*
   * ---------------------------------------------------------
   * CLOSE PLUS MENU ON CLICK OUTSIDE
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target)) {
        setIsPlusMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * SOCKET CONNECTION
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      timeout: 10000
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket.IO] Connected:", socket.id);
      sessionIdRef.current = socket.id;
      setConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.IO] Disconnected:", reason);
      setConnected(false);
      setIsRunning(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket.IO] Connection error:", error.message);
      setConnected(false);
    });

    socket.on("execute:status", (statusObj) => {
      console.log("[Socket.IO] STATUS:", statusObj);
      setStatus(statusObj);

      const currentStatus = statusObj?.status;
      const running = currentStatus === "running" || currentStatus === "compiling";
      setIsRunning(running);

      if (currentStatus === "running") {
        flushInputQueue();
      }
    });

    socket.on("execute:stdout", (payload) => {
      if (!payload || payload.data === undefined) return;
      const text = String(payload.data);
      setOutputLogs((prev) => [
        ...prev,
        { text, type: "stdout" }
      ]);
    });

    socket.on("execute:stderr", (payload) => {
      if (!payload || payload.data === undefined) return;
      const text = String(payload.data);
      setOutputLogs((prev) => [
        ...prev,
        { text, type: "stderr" }
      ]);
    });

    socket.on("execute:exit", (exitInfo) => {
      console.log("[Socket.IO] EXIT:", exitInfo);
      const exitCode = exitInfo && exitInfo.code !== undefined ? exitInfo.code : 0;
      const success = exitCode === 0;
      const statusText = success
        ? "✓ Process finished successfully"
        : `✗ Process exited with code ${exitCode}`;

      setOutputLogs((prev) => [
        ...prev,
        {
          text: "\n----------------------------------------\n" + statusText + "\n",
          type: success ? "success" : "error"
        }
      ]);

      setStatus({
        stage: "execution",
        status: "exited",
        message: statusText
      });

      inputQueueRef.current = [];
      setIsRunning(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("execute:status");
      socket.off("execute:stdout");
      socket.off("execute:stderr");
      socket.off("execute:exit");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * INPUT QUEUE HANDLING
   * ---------------------------------------------------------
   */
  const flushInputQueue = () => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;
    if (inputQueueRef.current.length === 0) return;

    const queuedInputs = [...inputQueueRef.current];
    inputQueueRef.current = [];

    queuedInputs.forEach((input) => {
      console.log("[Socket.IO] Sending queued input:", JSON.stringify(input));
      socket.emit("execute:input", {
        sessionId,
        input
      });
    });
  };

  /*
   * ---------------------------------------------------------
   * EXECUTION HANDLERS
   * ---------------------------------------------------------
   */
  const handleStart = () => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      setOutputLogs((prev) => [
        ...prev,
        { text: "✗ Error: Socket server not connected.\n", type: "error" }
      ]);
      return;
    }

    if (!code || !code.trim()) {
      setOutputLogs((prev) => [
        ...prev,
        { text: "⚠ Error: Code cannot be empty.\n", type: "error" }
      ]);
      return;
    }

    // Pre-queue STDIN lines if provided
    inputQueueRef.current = [];
    if (stdinText && stdinText.trim()) {
      const rawLines = stdinText.split("\n");
      rawLines.forEach((line) => {
        inputQueueRef.current.push(line.endsWith("\n") ? line : line + "\n");
      });
    }

    const sessionId = socket.id;
    sessionIdRef.current = sessionId;

    setOutputLogs([
      {
        text: `$ Compiling and executing ${lang.toUpperCase()} program...\n`,
        type: "system"
      }
    ]);

    setStatus({
      stage: "compile",
      status: "compiling",
      message: "Compiling..."
    });
    setIsRunning(true);

    socket.emit("execute:start", {
      language: lang,
      code,
      sessionId
    });
  };

  const handleStop = () => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    const sessionId = sessionIdRef.current;

    socket.emit("execute:stop", { sessionId });
    inputQueueRef.current = [];

    setOutputLogs((prev) => [
      ...prev,
      { text: "\n⚡ Execution stopped by user.\n", type: "system" }
    ]);

    setStatus({
      stage: "execution",
      status: "stopped",
      message: "Stopped by user"
    });
    setIsRunning(false);
  };

  const handleSendInput = (e) => {
    if (e) e.preventDefault();
    const socket = socketRef.current;
    if (!liveInputText && liveInputText !== "0") return;

    const formattedInput = liveInputText.endsWith("\n")
      ? liveInputText
      : liveInputText + "\n";

    setOutputLogs((prev) => [
      ...prev,
      { text: formattedInput, type: "stdin" }
    ]);

    if (status.status !== "running" || !socket || !socket.connected) {
      inputQueueRef.current.push(formattedInput);
      setLiveInputText("");
      return;
    }

    const sessionId = sessionIdRef.current;
    socket.emit("execute:input", {
      sessionId,
      input: formattedInput
    });
    setLiveInputText("");
  };

  const handleClear = () => {
    setOutputLogs([
      { text: "⚡ Terminal cleared.\n", type: "system" }
    ]);
  };

  /*
   * ---------------------------------------------------------
   * TOOLBAR ACTIONS
   * ---------------------------------------------------------
   */
  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopyCodeSuccess(true);
    setTimeout(() => setCopyCodeSuccess(false), 1800);
  };

  const handleReset = () => {
    if (confirm("Reset editor to default template? Your current edits will be lost.")) {
      if (templates[lang]) {
        setCode(templates[lang]);
      }
    }
  };

  const handleEraseCode = () => {
    if (confirm("Clear all code in the editor?")) {
      setCode("");
    }
  };

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      if (editorContainerRef.current?.requestFullscreen) {
        editorContainerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    if (setLang) setLang(selected);
    if (setCode && templates[selected]) {
      setCode(templates[selected]);
    }
    if (setFileName) {
      setFileName(defaultFileMap[selected] || `main.${extMap[selected]}`);
    }
  };

  /*
   * ---------------------------------------------------------
   * [+] BUTTON: NEW BLANK FILE & OPEN FILE
   * ---------------------------------------------------------
   */
  const handleNewBlankFile = () => {
    setIsPlusMenuOpen(false);
    const ext = extMap[lang] || "c";
    const defaultName = defaultFileMap[lang] || `main.${ext}`;
    if (setFileName) setFileName(defaultName);
    if (setCode) setCode("");
  };

  const handleTriggerOpenLocalFile = () => {
    setIsPlusMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileOpen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        if (setCode) setCode(content);
        if (setFileName) setFileName(file.name);

        // Detect language from extension
        const ext = file.name.split(".").pop().toLowerCase();
        let detected = null;
        if (ext === "c") detected = "c";
        else if (ext === "cpp" || ext === "cc" || ext === "cxx") detected = "cpp";
        else if (ext === "java") detected = "java";
        else if (ext === "py") detected = "python";

        if (detected && setLang) {
          setLang(detected);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  /*
   * ---------------------------------------------------------
   * SAVE MODAL & DATABASE LOGIC
   * ---------------------------------------------------------
   */
  const handleOpenSaveModal = () => {
    const ext = extMap[lang] || "c";
    let baseName = fileName || `main.${ext}`;
    if (baseName.endsWith(`.${ext}`)) {
      baseName = baseName.substring(0, baseName.length - ext.length - 1);
    }
    setModalFileName(baseName);
    setSaveError("");
    setSaveSuccess(false);
    setIsSaveModalOpen(true);
  };

  const handleSaveFile = async () => {
    if (isSaving) return;

    const baseName = modalFileName.trim();
    if (!baseName) {
      setSaveError("File name cannot be empty");
      return;
    }
    setIsSaving(true);

    const ext = extMap[lang] || "c";
    let finalFileName = baseName;
    if (!finalFileName.endsWith(`.${ext}`)) {
      finalFileName = `${finalFileName}.${ext}`;
    }

    let savedFiles = [];
    const saved = localStorage.getItem("cryptocode_saved_files");
    if (saved) {
      try {
        savedFiles = JSON.parse(saved);
      } catch (e) {
        savedFiles = [];
      }
    }

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
      updatedFiles = savedFiles.map((f) =>
        f.name.toLowerCase() === finalFileName.toLowerCase() ? newFileObj : f
      );
    } else {
      updatedFiles = [newFileObj, ...savedFiles];
    }

    const currentUser = JSON.parse(
      localStorage.getItem("cryptocode_user")
    );

    try {
      const url = submissionId
        ? `http://localhost:5000/submissions/${submissionId}`
        : "http://localhost:5000/submissions/save";

      const method = submissionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
    user_id: currentUser?.id,
    source_code: code,
    language: lang,
    filename: finalFileName,
    status: "saved",
}),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Save submission failed:", data);
        setSaveError(data.message || "Failed to save submission");
        return;
      }

      if (!submissionId && data.submission?.id && setSubmissionId) {
        setSubmissionId(data.submission.id);
      }
    } catch (error) {
      console.error("Save submission error:", error);
    } finally {
      setIsSaving(false);
    }

    localStorage.setItem("cryptocode_saved_files", JSON.stringify(updatedFiles));
    if (setFileName) setFileName(finalFileName);
    setSaveSuccess(true);

    setTimeout(() => {
      setIsSaveModalOpen(false);
      setSaveSuccess(false);
    }, 800);
  };

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [outputLogs]);

  // STDIN Line numbers
  const stdinLineCount = stdinText ? stdinText.split("\n").length : 1;
  const stdinLineNumbers = Array.from({ length: Math.max(stdinLineCount, 1) }, (_, i) => i + 1);

  const ext = extMap[lang] || "c";
  const previewFileName = modalFileName.trim() 
    ? (modalFileName.trim().endsWith(`.${ext}`) ? modalFileName.trim() : `${modalFileName.trim()}.${ext}`)
    : `filename.${ext}`;

  return (
    <div
      ref={editorContainerRef}
      id="editor-section"
      className={`ide-outer-container ${isFullscreen ? "ide-fullscreen" : ""}`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .ide-outer-container {
              width: 100%;
              max-width: 100% !important;
              padding: 0 4px;
              margin-bottom: 30px;
              display: flex;
              flex-direction: column;
              gap: 16px;
              box-sizing: border-box;
            }

            .ide-outer-container.ide-fullscreen {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              z-index: 99999 !important;
              background: #07090e !important;
              padding: 24px 32px !important;
              overflow-y: auto !important;
              margin: 0 !important;
            }

            /* 1. TOP HEADER */
            .ide-top-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 4px 0 8px 0;
            }

            .ide-header-title-box {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }

            .ide-title {
              font-size: 1.65rem;
              font-weight: 700;
              color: #f8fafc;
              letter-spacing: -0.025em;
              margin: 0;
              line-height: 1.2;
            }

            .ide-title-highlight {
              background: linear-gradient(135deg, #a78bfa, #818cf8);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            .ide-subtitle {
              font-size: 0.85rem;
              color: #94a3b8;
              margin: 0;
            }

            /* LANGUAGE DROPDOWN */
            .ide-lang-selector-box {
              position: relative;
              display: inline-flex;
              align-items: center;
            }

            .ide-lang-select {
              appearance: none;
              -webkit-appearance: none;
              background: #111625;
              border: 1px solid rgba(129, 140, 248, 0.28);
              border-radius: 10px;
              color: #f1f5f9;
              font-size: 0.84rem;
              font-weight: 600;
              padding: 7px 32px 7px 14px;
              outline: none;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            .ide-lang-select:hover, .ide-lang-select:focus {
              border-color: #818cf8;
              background: #171d30;
              box-shadow: 0 0 12px rgba(129, 140, 248, 0.25);
            }

            .ide-lang-chevron {
              position: absolute;
              right: 11px;
              pointer-events: none;
              color: #818cf8;
            }

            /* 2. FILE TOOLBAR */
            .ide-toolbar-card {
              background: #0d121f;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 12px;
              padding: 8px 14px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 12px;
              box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
            }

            .ide-toolbar-left {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .ide-file-tab {
              background: rgba(129, 140, 248, 0.12);
              border: 1px solid rgba(129, 140, 248, 0.35);
              border-radius: 8px;
              padding: 5px 12px;
              display: flex;
              align-items: center;
              gap: 8px;
              color: #e2e8f0;
              font-size: 0.82rem;
              font-weight: 600;
              box-shadow: 0 0 10px rgba(129, 140, 248, 0.06);
            }

            .ide-tab-icon {
              font-size: 0.95rem;
              line-height: 1;
            }

            .ide-tab-name {
              font-family: 'JetBrains Mono', Consolas, monospace;
              letter-spacing: -0.01em;
            }

            .ide-tab-close {
              color: #64748b;
              cursor: pointer;
              transition: color 0.15s ease;
              display: flex;
              align-items: center;
            }

            .ide-tab-close:hover {
              color: #f87171;
            }

            .ide-tab-add-btn {
              background: rgba(255, 255, 255, 0.04);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 7px;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #94a3b8;
              cursor: pointer;
              transition: all 0.15s ease;
            }

            .ide-tab-add-btn:hover, .ide-tab-add-btn.active {
              background: rgba(129, 140, 248, 0.15);
              border-color: rgba(129, 140, 248, 0.35);
              color: #fff;
            }

            /* PLUS DROPDOWN MENU */
            .ide-plus-dropdown-menu {
              position: absolute;
              top: calc(100% + 8px);
              left: 0;
              z-index: 1000;
              background: #111625;
              border: 1px solid rgba(255, 255, 255, 0.12);
              border-radius: 10px;
              padding: 6px;
              min-width: 195px;
              box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
              display: flex;
              flex-direction: column;
              gap: 4px;
            }

            .ide-plus-menu-item {
              background: transparent;
              border: none;
              border-radius: 6px;
              padding: 8px 12px;
              color: #cbd5e1;
              font-size: 0.82rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              width: 100%;
              text-align: left;
              transition: all 0.15s ease;
            }

            .ide-plus-menu-item:hover {
              background: rgba(129, 140, 248, 0.15);
              color: #fff;
            }

            .ide-toolbar-right {
              display: flex;
              align-items: center;
              gap: 8px;
              flex-wrap: wrap;
            }

            .ide-tool-btn {
              background: rgba(255, 255, 255, 0.04);
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 8px;
              padding: 6px 12px;
              color: #cbd5e1;
              font-size: 0.8rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 6px;
              cursor: pointer;
              transition: all 0.15s ease;
            }

            .ide-tool-btn:hover:not(:disabled) {
              background: rgba(255, 255, 255, 0.08);
              border-color: rgba(255, 255, 255, 0.18);
              color: #ffffff;
            }

            .ide-tool-btn.active {
              background: rgba(129, 140, 248, 0.15);
              border-color: rgba(129, 140, 248, 0.35);
              color: #fff;
            }

            .ide-tool-btn:disabled {
              opacity: 0.45;
              cursor: not-allowed;
            }

            .ide-save-btn {
              background: linear-gradient(135deg, #7c3aed, #6366f1);
              border: none;
              border-radius: 8px;
              padding: 6px 14px;
              color: #ffffff;
              font-size: 0.8rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 6px;
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(124, 58, 237, 0.35);
              transition: all 0.2s ease;
            }

            .ide-save-btn:hover:not(:disabled) {
              opacity: 0.95;
              transform: translateY(-1px);
              box-shadow: 0 4px 14px rgba(124, 58, 237, 0.5);
            }

            .ide-save-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .ide-run-btn {
              background: linear-gradient(135deg, #2563eb, #4f46e5);
              border: none;
              border-radius: 8px;
              padding: 6px 16px;
              color: #ffffff;
              font-size: 0.82rem;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 6px;
              cursor: pointer;
              box-shadow: 0 2px 10px rgba(37, 99, 235, 0.35);
              transition: all 0.2s ease;
            }

            .ide-run-btn:hover:not(:disabled) {
              opacity: 0.95;
              transform: translateY(-1px);
              box-shadow: 0 4px 16px rgba(37, 99, 235, 0.5);
            }

            .ide-run-btn:disabled {
              opacity: 0.45;
              cursor: not-allowed;
            }

            .ide-stop-btn {
              background: #ef4444;
              border: none;
              border-radius: 8px;
              padding: 6px 16px;
              color: #ffffff;
              font-size: 0.82rem;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 6px;
              cursor: pointer;
              box-shadow: 0 2px 10px rgba(239, 68, 68, 0.35);
              transition: all 0.15s ease;
            }

            .ide-stop-btn:hover {
              background: #dc2626;
            }

            /* STDIN SECTION (COLLAPSIBLE) */
            .ide-stdin-card {
              background: #090d16;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
            }

            .ide-stdin-header {
              padding: 7px 14px;
              background: rgba(255, 255, 255, 0.02);
              border-bottom: 1px solid rgba(255, 255, 255, 0.06);
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .ide-stdin-symbol {
              color: #818cf8;
              font-weight: 800;
              font-family: 'JetBrains Mono', Consolas, monospace;
              font-size: 0.9rem;
            }

            .ide-stdin-title {
              font-weight: 700;
              color: #f1f5f9;
              font-size: 0.82rem;
              letter-spacing: 0.04em;
            }

            .ide-stdin-subtitle {
              color: #64748b;
              font-size: 0.78rem;
            }

            .ide-stdin-badge {
              font-size: 0.7rem;
              color: #94a3b8;
              background: rgba(255, 255, 255, 0.05);
              padding: 2px 8px;
              border-radius: 6px;
              font-weight: 600;
              border: 1px solid rgba(255, 255, 255, 0.08);
              font-family: 'JetBrains Mono', Consolas, monospace;
            }

            .ide-stdin-body {
              display: flex;
              background: #07090e;
              padding: 8px 14px;
              font-family: 'JetBrains Mono', Consolas, monospace;
              font-size: 0.85rem;
              line-height: 1.5;
            }

            .ide-stdin-gutter {
              width: 32px;
              color: #475569;
              user-select: none;
              text-align: left;
              font-size: 0.85rem;
              line-height: 1.5;
            }

            .ide-stdin-line-no {
              height: 21px;
            }

            .ide-stdin-input {
              flex: 1;
              background: transparent;
              border: none;
              color: #e2e8f0;
              outline: none;
              resize: none;
              font-family: 'JetBrains Mono', Consolas, monospace;
              font-size: 0.85rem;
              line-height: 1.5;
              padding: 0;
            }

            .ide-stdin-input::placeholder {
              color: #475569;
            }

            /* 3. SIDE-BY-SIDE WORKSPACE (CODE EDITOR ~68% | INTERACTIVE CONSOLE ~32%) */
            .ide-workspace-grid {
              display: grid;
              grid-template-columns: 68% calc(32% - 16px);
              gap: 16px;
              align-items: stretch;
              width: 100%;
            }

            /* LEFT PANEL: CODE EDITOR */
            .ide-editor-panel {
              width: 100%;
              height: 600px;
              background: #090d16;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 12px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            }

            .ide-panel-header {
              background: #0d121e;
              border-bottom: 1px solid rgba(255, 255, 255, 0.06);
              padding: 9px 14px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 42px;
              box-sizing: border-box;
            }

            .ide-panel-title {
              font-size: 0.82rem;
              font-weight: 700;
              color: #f1f5f9;
              letter-spacing: 0.01em;
            }

            .ide-autosave-badge {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 0.72rem;
              color: #10b981;
              font-weight: 600;
              background: rgba(16, 185, 129, 0.08);
              border: 1px solid rgba(16, 185, 129, 0.2);
              padding: 2px 8px;
              border-radius: 6px;
            }

            .ide-autosave-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #10b981;
              box-shadow: 0 0 6px #10b981;
            }

            .ide-encoding-badge {
              font-size: 0.7rem;
              color: #64748b;
              background: rgba(255, 255, 255, 0.04);
              border: 1px solid rgba(255, 255, 255, 0.08);
              padding: 2px 7px;
              border-radius: 5px;
              font-weight: 600;
              font-family: 'JetBrains Mono', Consolas, monospace;
            }

            .ide-monaco-wrapper {
              flex: 1;
              width: 100%;
              height: calc(100% - 42px);
              background: #1e1e1e;
              overflow: hidden;
            }

            /* RIGHT PANEL: INTERACTIVE CONSOLE */
            .ide-console-card {
              width: 100%;
              height: 600px;
              background: #090d16;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 12px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
            }

            .ide-console-header {
              background: #0d121e;
              border-bottom: 1px solid rgba(255, 255, 255, 0.06);
              padding: 9px 14px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 42px;
              box-sizing: border-box;
            }

            .ide-console-title {
              font-weight: 600;
              color: #f1f5f9;
              font-size: 0.82rem;
            }

            .ide-status-pill {
              font-size: 0.7rem;
              font-weight: 700;
              padding: 2px 8px;
              border-radius: 6px;
              text-transform: uppercase;
              font-family: 'JetBrains Mono', monospace;
            }

            .ide-status-running {
              background: rgba(16, 185, 129, 0.15);
              color: #10b981;
            }

            .ide-status-compiling {
              background: rgba(251, 191, 36, 0.15);
              color: #fbbf24;
            }

            .ide-status-stopped, .ide-status-idle, .ide-status-exited {
              background: rgba(255, 255, 255, 0.06);
              color: #94a3b8;
            }

            .ide-clear-btn {
              padding: 4px 10px;
              font-size: 0.74rem;
            }

            .ide-console-body {
              flex: 1;
              overflow-y: auto;
              background: #07090e;
              padding: 12px 16px;
              font-family: 'JetBrains Mono', Consolas, monospace;
              font-size: 0.84rem;
              line-height: 1.55;
              height: calc(100% - 42px - 50px);
            }

            .ide-console-input-bar {
              background: #0d121e;
              border-top: 1px solid rgba(255, 255, 255, 0.06);
              padding: 8px 14px;
              display: flex;
              align-items: center;
              gap: 10px;
              height: 50px;
              box-sizing: border-box;
            }

            .ide-console-prompt {
              color: #10b981;
              font-weight: 700;
              font-family: 'JetBrains Mono', monospace;
              font-size: 0.85rem;
            }

            .ide-console-input-field {
              flex: 1;
              background: #07090e;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 8px;
              color: #10b981;
              font-family: 'JetBrains Mono', Consolas, monospace;
              font-size: 0.84rem;
              padding: 6px 12px;
              outline: none;
              transition: border-color 0.15s ease;
            }

            .ide-console-input-field:focus {
              border-color: #818cf8;
            }

            .ide-console-input-field:disabled {
              opacity: 0.55;
              cursor: not-allowed;
            }

            .ide-console-send-btn {
              background: var(--pur, #7c3aed);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              color: #fff;
              padding: 6px 14px;
              font-size: 0.75rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 5px;
              cursor: pointer;
              transition: all 0.15s ease;
            }

            .ide-console-send-btn:disabled {
              background: rgba(255, 255, 255, 0.05);
              border-color: rgba(255, 255, 255, 0.08);
              color: #64748b;
              cursor: not-allowed;
            }

            /* FULLSCREEN ADJUSTMENT */
            .ide-outer-container.ide-fullscreen .ide-editor-panel,
            .ide-outer-container.ide-fullscreen .ide-console-card {
              height: calc(100vh - 200px) !important;
              min-height: 520px;
            }

            /* RESPONSIVE DESIGN */
            @media (max-width: 1200px) {
              .ide-workspace-grid {
                grid-template-columns: 60% calc(40% - 14px);
              }
            }

            @media (max-width: 860px) {
              .ide-workspace-grid {
                grid-template-columns: 1fr;
              }
              .ide-editor-panel {
                height: 460px;
              }
              .ide-console-card {
                height: 340px;
              }
              .ide-toolbar-card {
                flex-wrap: wrap;
              }
            }

            @media (max-width: 640px) {
              .ide-top-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
              }
              .ide-toolbar-card {
                flex-direction: column;
                align-items: stretch;
              }
              .ide-toolbar-right {
                justify-content: flex-start;
              }
            }
          `
        }}
      />

      {/* 1. TOP IDE HEADER */}
      <div className="ide-top-header">
        <div className="ide-header-title-box">
          <h2 className="ide-title">
            Online <span className="ide-title-highlight">{langNameMap[lang] || "C"}</span> Compiler
          </h2>
          <p className="ide-subtitle">
            Write, run, and share code snippets - no setup required.
          </p>
        </div>

        {/* Language Selector Dropdown */}
        <div className="ide-lang-selector-box">
          <select
            id="langSelect"
            value={lang}
            onChange={handleLanguageChange}
            className="ide-lang-select"
          >
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <ChevronDown size={14} className="ide-lang-chevron" />
        </div>
      </div>

      {/* 2. FILE TOOLBAR */}
      <div className="ide-toolbar-card">
        {/* Left: Active file tab + plus dropdown */}
        <div className="ide-toolbar-left position-relative" ref={plusMenuRef}>
          <div className="ide-file-tab">
            <span className="ide-tab-icon">{langIconMap[lang] || "⚡"}</span>
            <span className="ide-tab-name">{fileName || defaultFileMap[lang] || "main.c"}</span>
            <span className="ide-tab-close" title="Reset to template" onClick={handleReset}>
              <X size={12} />
            </span>
          </div>

          {/* [+] Button with Dropdown */}
          <div className="position-relative">
            <button
              className={`ide-tab-add-btn ${isPlusMenuOpen ? "active" : ""}`}
              title="Add / Open File"
              onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
            >
              <Plus size={14} />
            </button>

            {isPlusMenuOpen && (
              <div className="ide-plus-dropdown-menu">
                <button
                  className="ide-plus-menu-item"
                  onClick={handleNewBlankFile}
                >
                  <FilePlus size={14} style={{ color: "#818cf8" }} />
                  <span>+ New Blank File</span>
                </button>
                <button
                  className="ide-plus-menu-item"
                  onClick={handleTriggerOpenLocalFile}
                >
                  <FolderOpen size={14} style={{ color: "#38bdf8" }} />
                  <span>📂 Open Existing File</span>
                </button>
              </div>
            )}
          </div>

          {/* Hidden native file input for opening local source files */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".c,.cpp,.java,.py"
            onChange={handleFileOpen}
            style={{ display: "none" }}
          />
        </div>

        {/* Right: Action Buttons */}
        <div className="ide-toolbar-right">
          {/* STDIN Toggle Button */}
          <button
            onClick={() => setIsStdinOpen(!isStdinOpen)}
            className={`ide-tool-btn ${isStdinOpen ? "active" : ""}`}
            title="Toggle STDIN Input"
          >
            <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#818cf8" }}>&gt;_</span>
            <span>STDIN</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="ide-tool-btn"
            title="Copy Code to Clipboard"
          >
            {copyCodeSuccess ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copyCodeSuccess ? "Copied!" : "Copy"}</span>
          </button>

          {/* Save Content */}
          <button
            onClick={handleOpenSaveModal}
            disabled={isRunning || isSaving}
            className="ide-save-btn"
            title="Save to Code History"
          >
            <Save size={14} />
            <span>Save Content</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="ide-tool-btn"
            title="Reset to Template"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {/* Erase */}
          <button
            onClick={handleEraseCode}
            disabled={isRunning}
            className="ide-tool-btn"
            title="Clear Editor"
          >
            <Trash2 size={14} />
            <span>Erase</span>
          </button>

          {/* Run / Stop Code */}
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={!connected}
              className="ide-run-btn"
              title="Run Program"
            >
              <Play size={13} fill="currentColor" />
              <span>Run</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="ide-stop-btn"
              title="Stop Execution"
            >
              <Square size={13} fill="currentColor" />
              <span>Stop</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="ide-tool-btn"
            title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* OPTIONAL STDIN / INPUT SECTION (Collapsible) */}
      {isStdinOpen && (
        <div className="ide-stdin-card">
          <div className="ide-stdin-header">
            <div className="d-flex align-items-center gap-2">
              <span className="ide-stdin-symbol">&gt;_</span>
              <span className="ide-stdin-title">STDIN</span>
              <span className="ide-stdin-subtitle">
                Optional input fed to the program on stdin - one line per line.
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="ide-stdin-badge">
                {stdinLineCount} {stdinLineCount === 1 ? "line" : "lines"}
              </div>
              <button
                onClick={() => setIsStdinOpen(false)}
                className="ide-tab-close"
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
                title="Close STDIN"
              >
                <X size={13} />
              </button>
            </div>
          </div>
          <div className="ide-stdin-body">
            <div className="ide-stdin-gutter">
              {stdinLineNumbers.map((num) => (
                <div key={num} className="ide-stdin-line-no">{num}</div>
              ))}
            </div>
            <textarea
              className="ide-stdin-input"
              rows={Math.max(2, Math.min(stdinLineCount, 5))}
              value={stdinText}
              onChange={(e) => setStdinText(e.target.value)}
              placeholder="Alice&#10;30"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* 3. SIDE-BY-SIDE WORKSPACE: CODE EDITOR (68%) | INTERACTIVE CONSOLE (32%) */}
      <div className="ide-workspace-grid">
        {/* LEFT PANEL: Monaco Code Editor */}
        <div className="ide-editor-panel">
          <div className="ide-panel-header">
            <div className="d-flex align-items-center gap-2">
              <Code2 size={14} style={{ color: "#818cf8" }} />
              <span className="ide-panel-title">Code Editor</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="ide-autosave-badge">
                <span className="ide-autosave-dot"></span>
                <span>Auto Save: ON</span>
              </div>
              <div className="ide-encoding-badge">UTF-8</div>
            </div>
          </div>

          <div className="ide-monaco-wrapper">
            <Editor
              height="100%"
              width="100%"
              language={lang}
              value={code}
              onChange={(val) => setCode && setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                minimap: { enabled: false },
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                automaticLayout: true,
                tabSize: 4,
                lineNumbers: "on",
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on"
              }}
            />
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Console */}
        <div className="ide-console-card">
          <div className="ide-console-header">
            <div className="d-flex align-items-center gap-2">
              <Radio
                size={14}
                style={{ color: connected ? "#10b981" : "#ef4444" }}
              />
              <span className="ide-console-title">Interactive Console</span>
              <span
                className={`ide-status-pill ide-status-${status.status || "idle"}`}
              >
                ● {status.status || "idle"}
              </span>
            </div>

            <button onClick={handleClear} className="ide-tool-btn ide-clear-btn" title="Clear Console">
              <RotateCcw size={12} />
              <span>Clear</span>
            </button>
          </div>

          <div className="ide-console-body" ref={terminalEndRef}>
            {outputLogs.map((log, index) => {
              let color = "#c9d1d9";
              if (log.type === "stdout") color = "#58a6ff";
              if (log.type === "stderr") color = "#f85149";
              if (log.type === "stdin") color = "#7ee787";
              if (log.type === "system") color = "#8b949e";
              if (log.type === "success") color = "#3fb950";
              if (log.type === "error") color = "#f85149";

              return (
                <span key={index} style={{ color, whiteSpace: "pre-wrap" }}>
                  {log.text}
                </span>
              );
            })}
          </div>

          <form onSubmit={handleSendInput} className="ide-console-input-bar">
            <span className="ide-console-prompt">&gt;</span>
            <input
              type="text"
              className="ide-console-input-field"
              placeholder={
                isRunning
                  ? "Type live stdin input and press Enter..."
                  : "Start program to send live stdin input..."
              }
              value={liveInputText}
              onChange={(e) => setLiveInputText(e.target.value)}
              disabled={!isRunning}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!isRunning}
              className="ide-console-send-btn"
            >
              <Send size={12} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* 4. SAVE MODAL WINDOW */}
      {isSaveModalOpen && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100050,
            padding: "20px"
          }}
        >
          <div
            style={{
              background: "var(--sf, #121826)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "18px",
              width: "100%",
              maxWidth: "420px",
              padding: "24px",
              boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.5)"
            }}
          >
            <h5 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--tx, #fff)", margin: "0 0 8px 0" }}>
              Save Code
            </h5>
            <p style={{ fontSize: "0.8rem", color: "var(--tx3, #94a3b8)", margin: "0 0 18px 0" }}>
              Save your program so it is accessible in your Code History.
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--tx2, #cbd5e1)", display: "block", marginBottom: "6px" }}>
                File Name
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  placeholder="e.g. main"
                  value={modalFileName}
                  onChange={(e) => {
                    setModalFileName(e.target.value);
                    setSaveError("");
                  }}
                  style={{
                    width: "100%",
                    background: "var(--bg3, #0a0d14)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    color: "var(--tx, #fff)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                  autoFocus
                />
              </div>
            </div>

            <div 
              style={{ 
                background: "var(--bg3, #0a0d14)", 
                border: "1px solid rgba(255, 255, 255, 0.08)", 
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "0.78rem",
                color: "var(--tx2, #cbd5e1)",
                marginBottom: "20px"
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span>Language:</span>
                <span style={{ color: "var(--pur, #818cf8)", fontWeight: 700 }}>
                  {langNameMap[lang]}
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>Saved as:</span>
                <span style={{ color: "var(--tx3, #94a3b8)", fontFamily: "monospace" }}>
                  {previewFileName}
                </span>
              </div>
            </div>

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

            <div className="d-flex align-items-center justify-content-end gap-2">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "var(--tx2, #cbd5e1)",
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
                disabled={isSaving}
                style={{
                  background: "var(--pur, #7c3aed)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: isSaving ? "not-allowed" : "pointer"
                }}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
