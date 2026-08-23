const { Server } = require("socket.io");
const sessionManager = require("../execution/sessionManager");
const { routeInteractiveCode } = require("../execution/languageRouter");

function initSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`[Socket.IO] Client connected: ${socket.id}`);

        socket.on("execute:start", async (data) => {
            const { language, code, sessionId: customSessionId } = data || {};
            const sessionId = customSessionId || socket.id;

            if (!language || !code) {
                socket.emit("execute:stderr", { data: "Error: Language and code are required.\n" });
                socket.emit("execute:exit", { code: 1, signal: null });
                return;
            }

            console.log(`[Socket.IO] Starting interactive execution for ${language} (session: ${sessionId})`);

            await routeInteractiveCode(language, code, sessionId, {
                onStdout: (text) => {
                    socket.emit("execute:stdout", { data: text });
                },
                onStderr: (text) => {
                    socket.emit("execute:stderr", { data: text });
                },
                onStatus: (statusObj) => {
                    socket.emit("execute:status", statusObj);
                },
                onExit: (exitInfo) => {
                    socket.emit("execute:exit", exitInfo);
                }
            });
        });

        socket.on("execute:input", (data) => {
            const { sessionId: customSessionId, input } = data || {};
            const sessionId = customSessionId || socket.id;

            if (input !== undefined && input !== null) {
                sessionManager.writeInput(sessionId, input);
            }
        });

        socket.on("execute:stop", (data) => {
            const { sessionId: customSessionId } = data || {};
            const sessionId = customSessionId || socket.id;

            console.log(`[Socket.IO] Stopping execution for session: ${sessionId}`);
            sessionManager.stopSession(sessionId);
            socket.emit("execute:status", { stage: "execution", status: "stopped", message: "Process stopped by user." });
        });

        socket.on("disconnect", () => {
            console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
            sessionManager.stopSession(socket.id);
        });
    });

    return io;
}

module.exports = {
    initSocketServer
};
