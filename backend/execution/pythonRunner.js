const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const sessionManager = require("./sessionManager");
const {
    createTempDirectory,
    cleanupTempDirectory
} = require("./tempManager");
const { getPythonCommand } = require("./envDetector");

/*
========================================================
PYTHON RUNNER
========================================================
*/

async function runInteractivePython({
    sessionId,
    code,
    onStdout,
    onStderr,
    onExit,
    onStatus
}) {
    let tempDir = null;

    try {
        const pythonCmd = getPythonCommand();

        if (!pythonCmd) {
            if (onStderr) {
                onStderr("Python interpreter not found. Please install Python 3 and ensure it is available in system PATH.\n");
            }
            if (onStatus) {
                onStatus({
                    stage: "system",
                    status: "error",
                    message: "Python interpreter not found."
                });
            }
            if (onExit) {
                onExit({ code: 1, signal: null });
            }
            return null;
        }

        tempDir = await createTempDirectory("cryptocode-py-");

        const sourceFile = path.join(tempDir, "main.py");
        fs.writeFileSync(sourceFile, code, "utf8");

        const session = sessionManager.createSession(
            sessionId,
            pythonCmd,
            ["-u", sourceFile],
            {
                cwd: tempDir,
                tempDir: tempDir,
                timeout: 5 * 60 * 1000,
                onStdout,
                onStderr,
                onStatus,
                onExit: (result) => {
                    if (onStatus) {
                        onStatus({
                            stage: "execution",
                            status: "exited",
                            message:
                                result.code === 0
                                    ? "Python program finished successfully."
                                    : `Python program exited with code ${result.code}.`
                        });
                    }

                    if (onExit) {
                        onExit(result);
                    }
                }
            }
        );

        return session;

    } catch (error) {
        console.error("Python Runner Error:", error);

        if (onStderr) {
            onStderr(`\n✗ Python Runner Error: ${error.message}\n`);
        }

        if (onStatus) {
            onStatus({
                stage: "system",
                status: "error",
                message: error.message
            });
        }

        if (tempDir) {
            await cleanupTempDirectory(tempDir);
        }

        if (onExit) {
            onExit({ code: -1, signal: "ERROR" });
        }

        return null;
    }
}

/*
========================================================
NORMAL PYTHON EXECUTION (/api/execute)
========================================================
*/

async function runPython(code, input = "") {
    let tempDir = null;

    try {
        const pythonCmd = getPythonCommand();

        if (!pythonCmd) {
            return {
                success: false,
                stage: "system",
                output: "Python interpreter not found. Please install Python 3 or configure PATH."
            };
        }

        tempDir = await createTempDirectory("cryptocode-py-");

        const sourceFile = path.join(tempDir, "main.py");
        fs.writeFileSync(sourceFile, code, "utf8");

        return await new Promise((resolve) => {
            const child = spawn(
                pythonCmd,
                ["-u", sourceFile],
                {
                    cwd: tempDir,
                    shell: false,
                    windowsHide: true,
                    stdio: ["pipe", "pipe", "pipe"]
                }
            );

            let output = "";
            let errorOutput = "";

            child.stdout.on("data", (data) => {
                output += data.toString();
            });

            child.stderr.on("data", (data) => {
                errorOutput += data.toString();
            });

            child.on("error", (error) => {
                resolve({
                    success: false,
                    stage: "execution",
                    output: error.message
                });
            });

            child.on("close", (code) => {
                if (code === 0) {
                    resolve({
                        success: true,
                        stage: "execution",
                        output
                    });
                } else {
                    resolve({
                        success: false,
                        stage: "execution",
                        output:
                            errorOutput ||
                            output ||
                            `Process exited with code ${code}`
                    });
                }
            });

            if (input !== undefined && input !== null) {
                if (String(input).length > 0) {
                    child.stdin.write(String(input));
                }
            }

            child.stdin.end();
        });

    } catch (error) {
        return {
            success: false,
            stage: "system",
            output: error.message
        };

    } finally {
        if (tempDir) {
            await cleanupTempDirectory(tempDir);
        }
    }
}

module.exports = {
    runPython,
    runInteractivePython
};
