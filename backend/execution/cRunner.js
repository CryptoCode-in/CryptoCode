const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const sessionManager = require("./sessionManager");
const {
    createTempDirectory,
    cleanupTempDirectory
} = require("./tempManager");

/*
========================================================
SAFE CODE TRANSFORMATION FOR UNBUFFERED STDOUT/STDERR
========================================================
*/

function prepareUnbufferedCCode(code) {
    if (!code || typeof code !== "string") return code;

    // Do not inject if setvbuf is already present in the source code
    if (code.includes("setvbuf")) {
        return code;
    }

    let modifiedCode = code;

    // Ensure <stdio.h> is included if missing
    if (!modifiedCode.includes("<stdio.h>")) {
        modifiedCode = `#include <stdio.h>\n` + modifiedCode;
    }

    // Match main function signature up to opening brace '{'
    const mainRegex = /\b(int|void)?\s*main\s*\([^)]*\)\s*\{/;
    const match = modifiedCode.match(mainRegex);

    if (match) {
        const injection = `${match[0]}\n    setvbuf(stdout, NULL, _IONBF, 0);\n    setvbuf(stderr, NULL, _IONBF, 0);`;
        modifiedCode = modifiedCode.replace(mainRegex, injection);
    }

    return modifiedCode;
}

/*
========================================================
C COMPILER
========================================================
*/

async function compileC(code, tempDir) {
    const sourceFile = path.join(tempDir, "main.c");
    const executable = path.join(tempDir, "program.exe");

    const finalCode = prepareUnbufferedCCode(code);

    fs.writeFileSync(sourceFile, finalCode, "utf8");

    return new Promise((resolve, reject) => {
        const compiler = spawn(
            "gcc",
            [
                "-std=c11",
                sourceFile,
                "-o",
                executable
            ],
            {
                cwd: tempDir,
                shell: false,
                windowsHide: true
            }
        );

        let stdout = "";
        let stderr = "";
        let finished = false;

        const timer = setTimeout(() => {
            if (finished) return;
            finished = true;

            try {
                compiler.kill("SIGKILL");
            } catch (e) {}

            resolve({
                success: false,
                stage: "compile",
                output: "C compilation timed out (30s limit exceeded).\n"
            });
        }, 30000);

        compiler.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        compiler.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        compiler.on("error", (error) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            reject(error);
        });

        compiler.on("close", (code) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);

            if (code !== 0) {
                resolve({
                    success: false,
                    stage: "compile",
                    output: stderr || stdout || "C compilation failed."
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
INTERACTIVE C EXECUTION
========================================================
*/

async function runInteractiveC({
    sessionId,
    code,
    onStdout,
    onStderr,
    onExit,
    onStatus
}) {
    let tempDir = null;

    try {
        tempDir = await createTempDirectory("cryptocode-c-");

        if (onStatus) {
            onStatus({
                stage: "compile",
                status: "compiling",
                message: "Compiling C program..."
            });
        }

        const compilation = await compileC(code, tempDir);

        if (!compilation.success) {
            if (onStatus) {
                onStatus({
                    stage: "compile",
                    status: "failed",
                    message: "C compilation failed."
                });
            }

            if (onStderr) {
                onStderr(
                    `\n✗ C Compilation Error:\n${compilation.output}\n`
                );
            }

            await cleanupTempDirectory(tempDir);

            if (onExit) {
                onExit({
                    code: 1,
                    signal: null
                });
            }

            return null;
        }

        if (onStatus) {
            onStatus({
                stage: "compile",
                status: "success",
                message: "C compilation successful."
            });
        }

        const session = sessionManager.createSession(
            sessionId,
            compilation.executable,
            [],
            {
                cwd: tempDir,
                tempDir: tempDir,
                timeout: 5 * 60 * 1000,
                onStdout: onStdout,
                onStderr: onStderr,
                onStatus: onStatus,
                onExit: (result) => {
                    if (onStatus) {
                        onStatus({
                            stage: "execution",
                            status: "exited",
                            message:
                                result.code === 0
                                    ? "C program finished successfully."
                                    : `C program exited with code ${result.code}.`
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
        console.error("C Runner Error:", error);

        if (onStderr) {
            onStderr(`\n✗ C Runner Error: ${error.message}\n`);
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
            onExit({
                code: -1,
                signal: "ERROR"
            });
        }

        return null;
    }
}

/*
========================================================
NORMAL C EXECUTION (/api/execute)
========================================================
*/

async function runC(code, input = "") {
    let tempDir = null;

    try {
        tempDir = await createTempDirectory("cryptocode-c-");

        const compilation = await compileC(code, tempDir);

        if (!compilation.success) {
            return {
                success: false,
                stage: "compile",
                output: compilation.output
            };
        }

        return await new Promise((resolve) => {
            const child = spawn(
                compilation.executable,
                [],
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
    runC,
    runInteractiveC,
    compileC
};