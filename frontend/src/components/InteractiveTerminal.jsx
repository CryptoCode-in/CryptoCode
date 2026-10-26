import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../utils/api";
import {
  Play,
  Square,
  RotateCcw,
  Send,
  Radio
} from "lucide-react";

function InteractiveTerminal({ language, code, onRunStateChange }) {
  const socketRef = useRef(null);
  const terminalEndRef = useRef(null);
  const consoleInputRef = useRef(null);
  const consoleInputBarRef = useRef(null);
  const terminalBoxRef = useRef(null);
  const inputQueueRef = useRef([]);
  const sessionIdRef = useRef(null);
  // Persistent session ID for the current run – set once on start and never overwritten on reconnection
  const permanentSessionIdRef = useRef(null);
  const sessionUuidRef = useRef(null);
  if (!sessionUuidRef.current) {
    sessionUuidRef.current = crypto.randomUUID();
  }
  const [connected, setConnected] = useState(false);

  const [status, setStatus] = useState({
    stage: "idle",
    status: "idle",
    message: "Ready"
  });

  const [outputLogs, setOutputLogs] = useState([
    {
      text: "⚡ Interactive Terminal ready. Click 'Run Code' to execute.\n",
      type: "system"
    }
  ]);

  const [inputText, setInputText] = useState("");

  // Helper to scroll console input bar into view cleanly on mobile
  const scrollInputIntoView = (smooth = true) => {
    requestAnimationFrame(() => {
      if (consoleInputBarRef.current) {
        consoleInputBarRef.current.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "nearest",
          inline: "nearest"
        });
      }
    });
  };

  // Keep input visible when mobile virtual keyboard opens
  const handleInputFocus = () => {
    setTimeout(() => {
      if (consoleInputBarRef.current) {
        consoleInputBarRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }, 300);
  };

  // Adjust scroll when mobile virtual keyboard resizes viewport
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleViewportChange = () => {
      if (document.activeElement === consoleInputRef.current && consoleInputBarRef.current) {
        consoleInputBarRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    };

    vv.addEventListener("resize", handleViewportChange);
    vv.addEventListener("scroll", handleViewportChange);
    return () => {
      vv.removeEventListener("resize", handleViewportChange);
      vv.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * SOCKET CONNECTION
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const socket = io(API_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      timeout: 10000
    });

    socketRef.current = socket;

    if (socket.listenerAdded) {
      return; // prevent duplicate listeners
    }
    socket.listenerAdded = true;

    socket.on("connect", () => {
      console.log("[Socket.IO] Connected:", socket.id);

      // Use stable UUID as session identifier
      sessionIdRef.current = sessionUuidRef.current;
      setConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.IO] Disconnected:", reason);

      setConnected(false);

      if (onRunStateChange) {
        onRunStateChange(false);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket.IO] Connection error:", error.message);
      setConnected(false);
    });

    /*
     * -------------------------------------------------------
     * EXECUTION STATUS
     * -------------------------------------------------------
     */
    socket.on("execute:status", (statusObj) => {
      console.log("[Socket.IO] STATUS:", statusObj);

      setStatus(statusObj);

      const currentStatus = statusObj?.status;

      if (onRunStateChange) {
        onRunStateChange(
          currentStatus === "running" ||
          currentStatus === "compiling" ||
          currentStatus === "waiting_input"
        );
      }

      if (currentStatus === "running" || currentStatus === "waiting_input") {
        flushInputQueue();
      }

      if (currentStatus === "waiting_input") {
        scrollInputIntoView(true);
      }
    });

    /*
     * -------------------------------------------------------
     * STDOUT
     * -------------------------------------------------------
     */
    socket.on("execute:stdout", (payload) => {
      if (!payload || payload.data === undefined) return;

      const text = String(payload.data);

      console.log("[Socket.IO] STDOUT:", text);

      setOutputLogs((prev) => [
        ...prev,
        {
          text,
          type: "stdout"
        }
      ]);

      if (/[:?]\s*$/.test(text)) {
        scrollInputIntoView(true);
      }
    });

    /*
     * -------------------------------------------------------
     * STDERR
     * -------------------------------------------------------
     */
    socket.on("execute:stderr", (payload) => {
      if (!payload || payload.data === undefined) return;

      const text = String(payload.data);

      console.log("[Socket.IO] STDERR:", text);

      setOutputLogs((prev) => [
        ...prev,
        {
          text,
          type: "stderr"
        }
      ]);
    });

    /*
     * -------------------------------------------------------
     * PROCESS EXIT
     * -------------------------------------------------------
     */
    socket.on("execute:exit", (exitInfo) => {
      console.log("[Socket.IO] EXIT:", exitInfo);

      const exitCode =
        exitInfo && exitInfo.code !== undefined
          ? exitInfo.code
          : 0;

      const success = exitCode === 0;

      const statusText = success
        ? "✓ Process finished successfully"
        : `✗ Process exited with code ${exitCode}`;

      setOutputLogs((prev) => [
        ...prev,
        {
          text:
            "\n----------------------------------------\n" +
            statusText +
            "\n",
          type: success ? "success" : "error"
        }
      ]);

      setStatus({
        stage: "execution",
        status: "exited",
        message: statusText
      });

      inputQueueRef.current = [];

      if (onRunStateChange) {
        onRunStateChange(false);
      }
    });

    /*
     * CLEANUP
     */
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
   * SEND QUEUED INPUTS
   * ---------------------------------------------------------
   */
  const flushInputQueue = () => {
    const socket = socketRef.current;

    if (!socket || !socket.connected) {
      return;
    }

    const sessionId =
      permanentSessionIdRef.current ||
      sessionIdRef.current ||
      socket.id;

    if (!sessionId) {
      return;
    }

    if (inputQueueRef.current.length === 0) {
      return;
    }

    const queuedInputs = [...inputQueueRef.current];

    inputQueueRef.current = [];

    queuedInputs.forEach((input) => {
      console.log(
        "[Socket.IO] Sending queued input:",
        JSON.stringify(input)
      );

      socket.emit("execute:input", {
        sessionId,
        input
      });
    });
  };

  /*
   * ---------------------------------------------------------
   * START PROGRAM
   * ---------------------------------------------------------
   */
  const handleStart = () => {
    const socket = socketRef.current;

    if (!socket || !socket.connected) {
      setOutputLogs((prev) => [
        ...prev,
        {
          text: "✗ Error: Socket server not connected.\n",
          type: "error"
        }
      ]);

      return;
    }

    if (!code || !code.trim()) {
      setOutputLogs((prev) => [
        ...prev,
        {
          text: "⚠ Error: Code cannot be empty.\n",
          type: "error"
        }
      ]);

      return;
    }

    /*
     * Make sure old inputs don't go to new process.
     */
    inputQueueRef.current = [];

    /*
     * Current socket ID is the session ID.
     */
    // Use stable UUID for session identifier
    const sessionId = sessionUuidRef.current;
    sessionIdRef.current = sessionId;
    permanentSessionIdRef.current = sessionId;

    console.log(
      "[CryptoCode] Starting execution",
      {
        language,
        sessionId
      }
    );

    setOutputLogs([
      {
        text: `$ Compiling ${language.toUpperCase()} program...\n`,
        type: "system"
      }
    ]);

    setStatus({
      stage: "compile",
      status: "compiling",
      message: "Compiling..."
    });

    if (onRunStateChange) {
      onRunStateChange(true);
    }

    /*
     * IMPORTANT:
     * Send EXACT SAME sessionId that will be used
     * for execute:input and execute:stop.
     */
    socket.emit("execute:start", {
      language,
      code,
      sessionId
    });
  };

  /*
   * ---------------------------------------------------------
   * STOP PROGRAM
   * ---------------------------------------------------------
   */
  const handleStop = () => {
    const socket = socketRef.current;

    if (!socket || !socket.connected) {
      return;
    }

    const sessionId =
      permanentSessionIdRef.current ||
      sessionIdRef.current ||
      socket.id;

    console.log(
      "[CryptoCode] Stopping session:",
      sessionId
    );

    socket.emit("execute:stop", {
      sessionId
    });

    inputQueueRef.current = [];

    setOutputLogs((prev) => [
      ...prev,
      {
        text: "\n⚡ Execution stopped by user.\n",
        type: "system"
      }
    ]);

    setStatus({
      stage: "execution",
      status: "stopped",
      message: "Stopped by user"
    });

    if (onRunStateChange) {
      onRunStateChange(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * SEND LIVE STDIN
   * ---------------------------------------------------------
   */
  const handleSendInput = (e) => {
    if (e) {
      e.preventDefault();
    }

    const socket = socketRef.current;

    if (!inputText && inputText !== "0") {
      return;
    }

    /*
     * Always send newline.
     *
     * This is required for:
     * scanf()
     * cin >>
     * getline()
     * fgets()
     * getchar()
     */
    // Send raw input with clean newline
    const cleanInput = inputText.replace(/\r/g, "");
    const formattedInput = cleanInput.endsWith("\n")
      ? cleanInput
      : cleanInput + "\n";

    /*
     * Show input in terminal.
     */
    setOutputLogs((prev) => [
      ...prev,
      {
        text: formattedInput,
        type: "stdin"
      }
    ]);

    /*
     * If process is running or waiting for input, send live; otherwise queue.
     */
    const canSendLive =
      socket &&
      socket.connected &&
      (status.status === "running" || status.status === "waiting_input" || isRunning);

    if (!canSendLive) {
      console.log(
        "[CryptoCode] Input queued:",
        JSON.stringify(formattedInput)
      );

      inputQueueRef.current.push(formattedInput);

      setInputText("");

      return;
    }

    /*
     * Process is running.
     * Send directly to backend.
     */
    const sessionId =
      permanentSessionIdRef.current ||
      sessionIdRef.current ||
      socket.id;

    console.log(
      "[CryptoCode] Sending stdin:",
      {
        sessionId,
        input: formattedInput
      }
    );

    socket.emit("execute:input", {
      sessionId,
      input: formattedInput
    });

    setInputText("");
  };

  /*
   * ---------------------------------------------------------
   * CLEAR TERMINAL
   * ---------------------------------------------------------
   */
  const handleClear = () => {
    setOutputLogs([
      {
        text: "⚡ Terminal cleared.\n",
        type: "system"
      }
    ]);
  };

  /*
   * ---------------------------------------------------------
   * AUTO SCROLL
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollTop =
        terminalEndRef.current.scrollHeight;
    }
  }, [outputLogs]);

  // Flush any queued inputs once the process is running or waiting for input
  useEffect(() => {
    if (status.status === "running" || status.status === "waiting_input") {
      flushInputQueue();
    }
  }, [status.status]);

  /*
   * ---------------------------------------------------------
   * RUNNING STATE
   * ---------------------------------------------------------
   */
  const isRunning =
    status.status === "running" ||
    status.status === "compiling" ||
    status.status === "waiting_input";

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */
  return (
    <div
      className="interactive-terminal-container"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .terminal-box {
              background: var(--sf);
              border: 1px solid var(--bd);
              border-radius: 16px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
            }

            .terminal-header {
              background: var(--bg3);
              border-bottom: 1px solid var(--bd);
              padding: 10px 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-shrink: 0;
            }

            .terminal-body {
              background: #0d1117;
              font-family: 'JetBrains Mono', Consolas, monospace;
              font-size: 0.85rem;
              min-height: 160px;
              max-height: 340px;
              flex: 1 1 auto;
              overflow-y: auto;
              padding: 14px 16px;
              color: #c9d1d9;
              line-height: 1.5;
              -webkit-overflow-scrolling: touch;
            }

            .terminal-input-bar {
              background: var(--bg3);
              border-top: 1px solid var(--bd);
              padding: 8px 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              min-height: 52px;
              flex-shrink: 0;
              box-sizing: border-box;
            }

            .terminal-input-field {
              flex: 1;
              background: #0d1117;
              border: 1px solid var(--bd);
              border-radius: 8px;
              color: #10b981;
              font-family: 'JetBrains Mono', Consolas, monospace;
              font-size: 0.85rem;
              padding: 6px 12px;
              outline: none;
            }

            .terminal-input-field:focus {
              border-color: var(--pur);
            }

            .terminal-input-field:disabled {
              opacity: 0.55;
              cursor: not-allowed;
            }

            @media (max-width: 480px) {
              .terminal-input-bar {
                padding: 8px 8px;
                gap: 6px;
                min-height: 50px;
              }
              .terminal-input-field {
                padding: 6px 8px;
                font-size: 0.82rem;
              }
            }
          `
        }}
      />

      <div className="terminal-box" ref={terminalBoxRef}>

        {/* HEADER */}
        <div className="terminal-header">

          <div className="d-flex align-items-center gap-3">

            <div className="d-flex align-items-center gap-2">

              <Radio
                size={14}
                style={{
                  color: connected
                    ? "#10b981"
                    : "#ef4444"
                }}
              />

              <span
                style={{
                  fontWeight: 600,
                  color: "var(--tx)",
                  fontSize: "0.82rem"
                }}
              >
                Interactive Console
              </span>

            </div>

            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "6px",
                textTransform: "uppercase",

                background:
                  status.status === "running"
                    ? "rgba(16, 185, 129, 0.15)"
                    : status.status === "compiling"
                    ? "rgba(251, 191, 36, 0.15)"
                    : "rgba(255, 255, 255, 0.08)",

                color:
                  status.status === "running"
                    ? "#10b981"
                    : status.status === "compiling"
                    ? "#fbbf24"
                    : "var(--tx3)"
              }}
            >
              ● {status.status}
            </span>

          </div>

          <div className="d-flex align-items-center gap-2">

            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={!connected}
                style={{
                  background: "var(--grad)",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: connected
                    ? "pointer"
                    : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Play
                  size={12}
                  fill="currentColor"
                />

                <span>Run Code</span>
              </button>
            ) : (
              <button
                onClick={handleStop}
                style={{
                  background: "#ef4444",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Square
                  size={12}
                  fill="currentColor"
                />

                <span>Stop</span>
              </button>
            )}

            <button
              onClick={handleClear}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--bd)",
                borderRadius: "6px",
                color: "var(--tx2)",
                padding: "4px 10px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <RotateCcw size={12} />
              <span>Clear</span>
            </button>

          </div>
        </div>

        {/* TERMINAL OUTPUT */}
        <div
          className="terminal-body"
          ref={terminalEndRef}
        >
          {outputLogs.map((log, index) => {

            const style = {
              whiteSpace: "pre-wrap"
            };

            if (log.type === "stdout") {
              style.color = "#58a6ff";
            }

            if (log.type === "stderr") {
              style.color = "#f85149";
            }

            if (log.type === "stdin") {
              style.color = "#7ee787";
            }

            if (log.type === "system") {
              style.color = "#8b949e";
            }

            if (log.type === "success") {
              style.color = "#3fb950";
            }

            if (log.type === "error") {
              style.color = "#f85149";
            }

            return (
              <span
                key={index}
                style={style}
              >
                {log.text}
              </span>
            );
          })}
        </div>

        {/* INPUT */}
        <form
          ref={consoleInputBarRef}
          onSubmit={handleSendInput}
          className="terminal-input-bar"
        >

          <span
            style={{
              color: "#10b981",
              fontWeight: 700,
              fontFamily: "monospace",
              fontSize: "0.85rem"
            }}
          >
            &gt;
          </span>

          <input
            ref={consoleInputRef}
            type="text"
            className="terminal-input-field"
            placeholder={
              isRunning
                ? "Type live stdin input and press Enter..."
                : "Start program to send live stdin input..."
            }
            value={inputText}
            onChange={(e) =>
              setInputText(e.target.value)
            }
            onFocus={handleInputFocus}
            disabled={!isRunning}
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={!isRunning}
            style={{
              background: isRunning
                ? "var(--pur)"
                : "var(--bg3)",
              border: "1px solid var(--bd)",
              borderRadius: "8px",
              color: "#fff",
              padding: "6px 12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: isRunning
                ? "pointer"
                : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <Send size={12} />
            <span>Send</span>
          </button>

        </form>

      </div>
    </div>
  );
}

export default InteractiveTerminal;