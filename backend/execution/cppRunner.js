const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const {
    runProcess
} = require("./processRunner");

const {
    createTempDirectory,
    writeSourceFile,
    cleanupTempDirectory
} = require("./tempManager");

const sessionManager = require("./sessionManager");

/*
========================================================
COMPILATION FOR C++
========================================================
*/

async function compileCpp(code, tempDir) {
    const sourceFile = writeSourceFile(tempDir, "main.cpp", code);
    const executable = path.join(tempDir, "program.exe");

    return new Promise((resolve, reject) => {
        const compiler = spawn(
            "g++",
            [
                "-std=c++17",
                sourceFile,
                "-o",
                executable
            ],
            {
                cwd: tempDir,
                shell: false
            }
        );

        let stdout = "";
        let stderr = "";
        let finished = false;

        const timer = setTimeout(() => {
            if (!finished) {
                finished = true;
                try {
                    compiler.kill("SIGKILL");
                } catch (e) {}
                resolve({
                    success: false,
                    stage: "compile",
                    output: "C++ compilation timed out (30s limit exceeded).\n"
                });
            }
        }, 30000);

        compiler.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        compiler.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        compiler.on("error", (error) => {
            clearTimeout(timer);
            if (!finished) {
                finished = true;
                reject(error);
            }
        });

        compiler.on("close", (code) => {
            clearTimeout(timer);
            if (finished) return;
            finished = true;

            if (code !== 0) {
                resolve({
                    success: false,
                    stage: "compile",
                    output: stderr || stdout || "C++ compilation failed."
                });
                return;
            }

            resolve({
                success: true,
                stage: "compile",
                executable
            });
        });
    });
}

/*
========================================================
NORMAL EXECUTION (Used by POST /api/execute)
========================================================
*/

async function runCpp(code, input = "") {
    let tempDir = null;

    try {
        tempDir = await createTempDirectory("cryptocode-cpp-");

        const compilation = await compileCpp(code, tempDir);

        if (!compilation.success) {
            return {
                success: false,
                stage: "compile",
                output: compilation.output
            };
        }

        const runResult = await runProcess(
            compilation.executable,
            [],
            {
                cwd: tempDir,
                input,
                timeout: 5 * 60 * 1000
            }
        );

        return {
            success: runResult.success,
            stage: "execution",
            output: runResult.stdout || runResult.stderr || ""
        };

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

/*
========================================================
INTERACTIVE C++ EXECUTION (Used by Socket.IO)
========================================================
*/

async function runInteractiveCpp({
    sessionId,
    code,
    tempDir,
    onStdout,
    onStderr,
    onExit,
    onStatus
}) {
    let directory = tempDir;

    try {
        if (!directory) {
            directory = await createTempDirectory("cryptocode-cpp-");
        }

        if (onStatus) {
            onStatus({
                stage: "compile",
                status: "compiling",
                message: "Compiling C++ program..."
            });
        }

        const compilation = await compileCpp(code, directory);

        if (!compilation.success) {
            if (onStatus) {
                onStatus({
                    stage: "compile",
                    status: "failed",
                    message: "C++ compilation failed."
                });
            }

            if (onStderr) {
                onStderr(compilation.output);
            }

            await cleanupTempDirectory(directory);

            if (onExit) {
                onExit({ code: 1, signal: null });
            }

            return null;
        }

        if (onStatus) {
            onStatus({
                stage: "compile",
                status: "success",
                message: "Compilation successful."
            });
        }

        const session = sessionManager.createSession(
            sessionId,
            compilation.executable,
            [],
            {
                cwd: directory,
                tempDir: directory,
                timeout: 5 * 60 * 1000,
                onStdout,
                onStderr,
                onExit: (result) => {
                    if (onStatus) {
                        onStatus({
                            stage: "execution",
                            status: "exited",
                            message: "C++ program finished."
                        });
                    }
                    if (onExit) {
                        onExit(result);
                    }
                },
                onStatus
            }
        );

        return session;

    } catch (error) {
        console.error("C++ Runner Error:", error);

        if (onStderr) {
            onStderr(`\nC++ Runner Error: ${error.message}\n`);
        }

        if (onStatus) {
            onStatus({
                stage: "system",
                status: "error",
                message: error.message
            });
        }

        if (directory) {
            await cleanupTempDirectory(directory);
        }

        if (onExit) {
            onExit({ code: -1, signal: "ERROR" });
        }

        return null;
    }
}

module.exports = {
    runCpp,
    runInteractiveCpp,
    compileCpp
};