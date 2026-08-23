const { spawn } = require("child_process");
const { cleanupTempDirectory } = require("./tempManager");

class SessionManager {
    constructor() {
        this.sessions = new Map();

        // Maximum execution time:
        // 5 minutes = 300000 milliseconds
        this.DEFAULT_TIMEOUT = 5 * 60 * 1000;
    }

    createSession(sessionId, command, args = [], options = {}) {

        // Stop old session if same session ID exists
        if (this.sessions.has(sessionId)) {
            this.stopSession(sessionId);
        }

        const {
            cwd,
            tempDir,

            // Default = 5 minutes
            timeout = this.DEFAULT_TIMEOUT,

            onStdout,
            onStderr,
            onExit,
            onStatus
        } = options;

        console.log(
            `[Session ${sessionId}] Starting process: ${command}`
        );

        const child = spawn(command, args, {
            cwd,
            shell: false,

            // Important for interactive programs
            stdio: ["pipe", "pipe", "pipe"]
        });

        let finished = false;
        let timer = null;

        // --------------------------------------------------
        // Cleanup
        // --------------------------------------------------

        const cleanup = (code, signal) => {

            if (finished) {
                return;
            }

            finished = true;

            // Clear timeout
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            // Remove session
            this.sessions.delete(sessionId);

            // Cleanup temporary directory
            if (tempDir) {

                setTimeout(() => {

                    try {
                        cleanupTempDirectory(tempDir);
                    } catch (error) {
                        console.error(
                            `[Session ${sessionId}] Temp cleanup error:`,
                            error.message
                        );
                    }

                }, 500);
            }

            console.log(
                `[Session ${sessionId}] Process exited. Code: ${code}, Signal: ${signal}`
            );

            if (onExit) {
                onExit({
                    code,
                    signal
                });
            }
        };

        // --------------------------------------------------
        // Timeout
        // --------------------------------------------------

        timer = setTimeout(() => {

            if (finished) {
                return;
            }

            console.log(
                `[Session ${sessionId}] Execution timeout reached.`
            );

            if (onStatus) {
                onStatus({
                    stage: "execution",
                    status: "timeout",
                    message: "Process timed out after 5 minutes."
                });
            }

            if (onStderr) {
                onStderr(
                    "\n⚡ Execution timed out (5 minute limit exceeded).\n"
                );
            }

            this.stopSession(sessionId);

        }, timeout);

        // --------------------------------------------------
        // STDOUT
        // --------------------------------------------------

        child.stdout.on("data", (data) => {

            const output = data.toString();

            console.log(
                `[Session ${sessionId}] STDOUT:`,
                output
            );

            if (onStdout) {
                onStdout(output);
            }
        });

        // --------------------------------------------------
        // STDERR
        // --------------------------------------------------

        child.stderr.on("data", (data) => {

            const errorOutput = data.toString();

            console.log(
                `[Session ${sessionId}] STDERR:`,
                errorOutput
            );

            if (onStderr) {
                onStderr(errorOutput);
            }
        });

        // --------------------------------------------------
        // Process Error
        // --------------------------------------------------

        child.on("error", (error) => {

            console.error(
                `[Session ${sessionId}] Process error:`,
                error
            );

            if (onStderr) {
                onStderr(
                    `\nProcess error: ${error.message}\n`
                );
            }

            cleanup(-1, "ERROR");
        });

        // --------------------------------------------------
        // Process Close
        // --------------------------------------------------

        child.on("close", (code, signal) => {

            cleanup(code, signal);

        });

        // --------------------------------------------------
        // STDIN Error
        // --------------------------------------------------

        child.stdin.on("error", (error) => {

            // Ignore broken pipe if process already exited
            if (!finished) {

                console.error(
                    `[Session ${sessionId}] STDIN error:`,
                    error.message
                );
            }
        });

        // --------------------------------------------------
        // Session Object
        // --------------------------------------------------

        const session = {

            id: sessionId,

            child,

            tempDir,

            timer,

            // ----------------------------------------------
// Send input to running program
// ----------------------------------------------

writeInput: (text) => {

    if (finished) {
        console.log(
            `[Session ${sessionId}] Cannot write input. Session finished.`
        );

        return false;
    }

    if (!child.stdin) {
        console.log(
            `[Session ${sessionId}] STDIN does not exist.`
        );

        return false;
    }

    if (!child.stdin.writable) {
        console.log(
            `[Session ${sessionId}] STDIN is not writable.`
        );

        return false;
    }

    try {

        const str = String(text);

        // Add newline only if frontend didn't send one
        const finalInput = str.endsWith("\n")
            ? str
            : str + "\n";

        const success = child.stdin.write(finalInput);

        console.log(
            `[Session ${sessionId}] INPUT:`,
            JSON.stringify(finalInput)
        );

        return success !== false;

    } catch (error) {

        console.error(
            `[Session ${sessionId}] Input error:`,
            error.message
        );

        return false;
    }
},

            // ----------------------------------------------
            // Stop process
            // ----------------------------------------------

            stop: () => {

                if (finished) {
                    return;
                }

                console.log(
                    `[Session ${sessionId}] Stopping process...`
                );

                try {

                    child.kill("SIGKILL");

                } catch (error) {

                    console.error(
                        `[Session ${sessionId}] Kill error:`,
                        error.message
                    );

                    cleanup(-1, "SIGKILL");
                }
            }
        };

        // Save session
        this.sessions.set(
            sessionId,
            session
        );

        if (onStatus) {

            onStatus({
                stage: "execution",
                status: "running",
                message: "Program is running."
            });

        }

        return session;
    }

    // ----------------------------------------------------
    // Write input using session ID
    // ----------------------------------------------------

    writeInput(sessionId, text) {

        const session =
            this.sessions.get(sessionId);

        if (!session) {

            console.log(
                `[Session ${sessionId}] Session not found.`
            );

            return false;
        }

        return session.writeInput(text);
    }

    // ----------------------------------------------------
    // Stop session
    // ----------------------------------------------------

    stopSession(sessionId) {

        const session =
            this.sessions.get(sessionId);

        if (!session) {
            return false;
        }

        session.stop();

        return true;
    }

    // ----------------------------------------------------
    // Check session
    // ----------------------------------------------------

    hasSession(sessionId) {

        return this.sessions.has(
            sessionId
        );
    }
}

const sessionManager =
    new SessionManager();

module.exports =
    sessionManager;