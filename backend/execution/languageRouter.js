const { runC, runInteractiveC } = require("./cRunner");
const { runCpp, runInteractiveCpp } = require("./cppRunner");
const { runJava, runInteractiveJava } = require("./javaRunner");
const { runPython, runInteractivePython } = require("./pythonRunner");

/*
========================================================
NORMAL CODE EXECUTION
Used by POST /api/execute
========================================================
*/

async function routeCode(language, code, input = "") {
    if (!language) {
        return {
            success: false,
            stage: "validation",
            output: "Language is required."
        };
    }

    switch (language.toLowerCase()) {
        case "c":
            return await runC(code, input);

        case "cpp":
        case "c++":
            return await runCpp(code, input);

        case "java":
            return await runJava(code, input);

        case "python":
        case "py":
            return await runPython(code, input);

        default:
            return {
                success: false,
                stage: "validation",
                output: `Language '${language}' is not available yet.`
            };
    }
}

/*
========================================================
INTERACTIVE CODE EXECUTION
Used by Socket.IO Interactive Terminal
========================================================
*/

async function routeInteractiveCode(
    language,
    code,
    sessionId,
    callbacks = {}
) {
    if (!language) {
        if (callbacks.onStderr) {
            callbacks.onStderr("Error: Language is required.\n");
        }
        return null;
    }

    if (!code || !code.trim()) {
        if (callbacks.onStderr) {
            callbacks.onStderr("Error: Code cannot be empty.\n");
        }
        return null;
    }

    switch (language.toLowerCase()) {
        case "c":
            return await runInteractiveC({
                sessionId,
                code,
                onStdout: callbacks.onStdout,
                onStderr: callbacks.onStderr,
                onStatus: callbacks.onStatus,
                onExit: callbacks.onExit
            });

        case "cpp":
        case "c++":
            return await runInteractiveCpp({
                sessionId,
                code,
                onStdout: callbacks.onStdout,
                onStderr: callbacks.onStderr,
                onStatus: callbacks.onStatus,
                onExit: callbacks.onExit
            });

        case "java":
            return await runInteractiveJava({
                sessionId,
                code,
                onStdout: callbacks.onStdout,
                onStderr: callbacks.onStderr,
                onStatus: callbacks.onStatus,
                onExit: callbacks.onExit
            });

        case "python":
        case "py":
            return await runInteractivePython({
                sessionId,
                code,
                onStdout: callbacks.onStdout,
                onStderr: callbacks.onStderr,
                onStatus: callbacks.onStatus,
                onExit: callbacks.onExit
            });

        default:
            if (callbacks.onStderr) {
                callbacks.onStderr(`Unsupported language: ${language}\n`);
            }
            if (callbacks.onExit) {
                callbacks.onExit({ code: 1, signal: null });
            }
            return null;
    }
}

module.exports = {
    routeCode,
    routeInteractiveCode
};