const fs = require("fs");
const path = require("path");
const os = require("os");

function createTempDirectory(prefix = "execution_") {
    const baseDir = path.join(os.tmpdir(), "cryptocode");

    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }

    const folderName =
        `${prefix}${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 8)}`;

    const executionDir = path.join(baseDir, folderName);

    fs.mkdirSync(executionDir, {
        recursive: true
    });

    return executionDir;
}

function writeSourceFile(directory, filename, code) {
    const filePath = path.join(directory, filename);

    fs.writeFileSync(filePath, code, "utf8");

    return filePath;
}

async function cleanupTempDirectory(directory, retries = 3, delayMs = 300) {
    if (!directory) return;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            if (fs.existsSync(directory)) {
                fs.rmSync(directory, {
                    recursive: true,
                    force: true,
                    maxRetries: 3,
                    retryDelay: 100
                });
            }
            return;
        } catch (error) {
            if (attempt === retries) {
                console.error(
                    `Temporary directory cleanup failed for ${directory}:`,
                    error.message
                );
            } else {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
    }
}

module.exports = {
    createTempDirectory,
    writeSourceFile,
    cleanupTempDirectory
};