const { spawnSync } = require("child_process");

const cache = {};

/**
 * Check if a command is executable on the host machine.
 */
function checkCommand(command, args = ["--version"]) {
    if (cache[command] !== undefined) {
        return cache[command];
    }

    try {
        const result = spawnSync(command, args, {
            shell: false,
            windowsHide: true,
            timeout: 5000
        });

        const available = result.error === undefined && result.status === 0;
        cache[command] = available;
        return available;
    } catch (e) {
        cache[command] = false;
        return false;
    }
}

/**
 * Get available Python command ('python' or 'python3')
 */
function getPythonCommand() {
    if (cache["_pythonCmd"]) {
        return cache["_pythonCmd"];
    }

    // Try 'python' first (standard on Windows)
    if (checkCommand("python", ["--version"])) {
        cache["_pythonCmd"] = "python";
        return "python";
    }

    // Try 'python3'
    if (checkCommand("python3", ["--version"])) {
        cache["_pythonCmd"] = "python3";
        return "python3";
    }

    return null;
}

/**
 * Check if Java compiler (javac) is available
 */
function isJavacAvailable() {
    return checkCommand("javac", ["-version"]);
}

/**
 * Check if Java runtime (java) is available
 */
function isJavaAvailable() {
    return checkCommand("java", ["-version"]);
}

module.exports = {
    checkCommand,
    getPythonCommand,
    isJavacAvailable,
    isJavaAvailable
};
