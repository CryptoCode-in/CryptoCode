const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const sessionManager = require("./sessionManager");
const {
    createTempDirectory,
    cleanupTempDirectory
} = require("./tempManager");
const { isJavacAvailable, isJavaAvailable } = require("./envDetector");

/*
========================================================
JAVA RUNNER
========================================================
*/

function extractClassName(code) {
    if (!code) return "Main";
    const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
    if (match && match[1]) {
        return match[1];
    }
    return "Main";
}

function prepareUnbufferedJavaCode(code) {
    if (!code || typeof code !== "string") return code;
    if (code.includes("System.setOut")) return code;

    const mainRegex = /public\s+static\s+void\s+main\s*\(\s*String\s*(\[[\]\s]*|\.\.\.\s*)[A-Za-z0-9_]+\s*\)\s*(throws\s+[^{]+)?\{/;
    const match = code.match(mainRegex);

    if (match) {
        const injection = `${match[0]}\n        System.setOut(new java.io.PrintStream(System.out, true) {\n            public void print(String s) { super.print(s); super.flush(); }\n            public void print(boolean b) { super.print(b); super.flush(); }\n            public void print(char c) { super.print(c); super.flush(); }\n            public void print(int i) { super.print(i); super.flush(); }\n            public void print(long l) { super.print(l); super.flush(); }\n            public void print(float f) { super.print(f); super.flush(); }\n            public void print(double d) { super.print(d); super.flush(); }\n            public void print(char[] s) { super.print(s); super.flush(); }\n            public void print(Object obj) { super.print(obj); super.flush(); }\n            public void write(byte[] b, int off, int len) { super.write(b, off, len); super.flush(); }\n            public void write(int b) { super.write(b); super.flush(); }\n        });`;
        return code.replace(mainRegex, injection);
    }
    return code;
}

async function compileJava(code, tempDir) {
    if (!isJavacAvailable()) {
        return {
            success: false,
            stage: "compile",
            output: "Java compiler (javac) not found. Please install JDK and ensure javac is in system PATH.\n"
        };
    }

    const className = extractClassName(code);
    const sourceFile = path.join(tempDir, `${className}.java`);

    const finalCode = prepareUnbufferedJavaCode(code);
    fs.writeFileSync(sourceFile, finalCode, "utf8");

    return new Promise((resolve, reject) => {
        const compiler = spawn(
            "javac",
            [sourceFile],
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
                output: "Java compilation timed out (30s limit exceeded).\n"
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
            resolve({
                success: false,
                stage: "compile",
                output: `Java compilation error: ${error.message}\n`
            });
        });

        compiler.on("close", (code) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);

            if (code !== 0) {
                resolve({
                    success: false,
                    stage: "compile",
                    output: stderr || stdout || "Java compilation failed."
                });
                return;
            }

            resolve({
                success: true,
                stage: "compile",
                className
            });
        });
    });
}

/*
========================================================
INTERACTIVE JAVA EXECUTION (Socket.IO)
========================================================
*/

async function runInteractiveJava({
    sessionId,
    code,
    onStdout,
    onStderr,
    onExit,
    onStatus
}) {
    let tempDir = null;

    try {
        if (!isJavaAvailable()) {
            if (onStderr) {
                onStderr("Java runtime (java) not found. Please install Java and ensure it is in system PATH.\n");
            }
            if (onStatus) {
                onStatus({
                    stage: "system",
                    status: "error",
                    message: "Java runtime not found."
                });
            }
            if (onExit) {
                onExit({ code: 1, signal: null });
            }
            return null;
        }

        tempDir = await createTempDirectory("cryptocode-java-");

        if (onStatus) {
            onStatus({
                stage: "compile",
                status: "compiling",
                message: "Compiling Java program..."
            });
        }

        const compilation = await compileJava(code, tempDir);

        if (!compilation.success) {
            if (onStatus) {
                onStatus({
                    stage: "compile",
                    status: "failed",
                    message: "Java compilation failed."
                });
            }

            if (onStderr) {
                onStderr(`\n✗ Java Compilation Error:\n${compilation.output}\n`);
            }

            await cleanupTempDirectory(tempDir);

            if (onExit) {
                onExit({ code: 1, signal: null });
            }

            return null;
        }

        if (onStatus) {
            onStatus({
                stage: "compile",
                status: "success",
                message: "Java compilation successful."
            });
        }

        const className = compilation.className || "Main";

        const session = sessionManager.createSession(
            sessionId,
            "java",
            ["-cp", tempDir, className],
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
                                    ? "Java program finished successfully."
                                    : `Java program exited with code ${result.code}.`
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
        console.error("Java Runner Error:", error);

        if (onStderr) {
            onStderr(`\n✗ Java Runner Error: ${error.message}\n`);
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
NORMAL JAVA EXECUTION (/api/execute)
========================================================
*/

async function runJava(code, input = "") {
    let tempDir = null;

    try {
        if (!isJavaAvailable()) {
            return {
                success: false,
                stage: "system",
                output: "Java runtime (java) not found."
            };
        }

        tempDir = await createTempDirectory("cryptocode-java-");

        const compilation = await compileJava(code, tempDir);

        if (!compilation.success) {
            return {
                success: false,
                stage: "compile",
                output: compilation.output
            };
        }

        const className = compilation.className || "Main";

        return await new Promise((resolve) => {
            const child = spawn(
                "java",
                ["-cp", tempDir, className],
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
    runJava,
    runInteractiveJava,
    compileJava
};
