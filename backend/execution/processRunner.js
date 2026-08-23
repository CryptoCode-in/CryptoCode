const { spawn } = require("child_process");

function runProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const {
            cwd,
            input = "",
            timeout = 5 * 60 * 1000
        } = options;

        const child = spawn(command, args, {
            cwd,
            shell: false
        });

        let stdout = "";
        let stderr = "";
        let finished = false;

        const timer = setTimeout(() => {
            if (!finished) {
                finished = true;
                child.kill("SIGKILL");

                resolve({
                    success: false,
                    stdout,
                    stderr: "Execution timed out."
                });
            }
        }, timeout);

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("error", (error) => {
            clearTimeout(timer);

            if (!finished) {
                finished = true;

                resolve({
                    success: false,
                    stdout,
                    stderr: error.message
                });
            }
        });

        child.on("close", (code) => {
            clearTimeout(timer);

            if (finished) return;

            finished = true;

            resolve({
                success: code === 0,
                exitCode: code,
                stdout,
                stderr
            });
        });

        child.stdin.on("error", (err) => {
            // Catch broken pipe errors if process exits before stdin ends
        });

        if (input) {
            child.stdin.write(input);
        }
        child.stdin.end();
    });
}

module.exports = {
    runProcess
};