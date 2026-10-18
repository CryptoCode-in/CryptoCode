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

    // Map socket.id => sessionId (stable UUID) for ownership validation
    const socketSessionMap = new Map();

    io.on("connection", (socket) => {
        console.log(`[Socket.IO] Client connected: ${socket.id}`);

        socket.on("execute:start", async (data) => {
            console.log(`[DEBUG] execute:start received`, data);
            const { language, code, sessionId: customSessionId } = data || {};
            // Prefer client‑provided UUID; fallback to socket.id for legacy clients
            const sessionId = customSessionId || socket.id;
            console.log(`[DEBUG] Using sessionId: ${sessionId}`);

            if (!language || !code) {
                socket.emit("execute:stderr", { data: "Error: Language and code are required.\n" });
                socket.emit("execute:exit", { code: 1, signal: null });
                return;
            }

            // Record ownership so later input/stop calls are verified
            socketSessionMap.set(socket.id, sessionId);

            console.log(`[Socket.IO] Starting interactive execution for ${language} (session: ${sessionId})`);

            await routeInteractiveCode(language, code, sessionId, {
                onStdout: (text) => socket.emit("execute:stdout", { data: text }),
                onStderr: (text) => socket.emit("execute:stderr", { data: text }),
                onStatus: (statusObj) => socket.emit("execute:status", statusObj),
                onExit: (exitInfo) => {
                    socket.emit("execute:exit", exitInfo);
                    // Cleanup mapping after the process ends
                    socketSessionMap.delete(socket.id);
                }
            });
        });

        socket.on("execute:input", (data) => {
            console.log(`[DEBUG] execute:input received`, data);
            const { sessionId: customSessionId, input } = data || {};
            const sessionId = customSessionId || socket.id;
            const owned = socketSessionMap.get(socket.id);
            if (owned && owned !== sessionId) {
                console.warn(`[SECURITY] Socket ${socket.id} attempted to send input to unowned session ${sessionId}`);
                return;
            }
            console.log(`[DEBUG] Input for sessionId ${sessionId}: ${JSON.stringify(input)}`);
            if (input !== undefined && input !== null) {
                const success = sessionManager.writeInput(sessionId, input);
                console.log(`[Socket.IO] writeInput result:`, success);
                socket.emit('execute:inputAck', { sessionId, success });
            }
        });

        socket.on("execute:stop", (data) => {
            const { sessionId: customSessionId } = data || {};
            const sessionId = customSessionId || socket.id;
            const owned = socketSessionMap.get(socket.id);
            if (owned && owned !== sessionId) {
                console.warn(`[SECURITY] Socket ${socket.id} attempted to stop unowned session ${sessionId}`);
                return;
            }
            console.log(`[Socket.IO] Stopping execution for session: ${sessionId}`);
            sessionManager.stopSession(sessionId);
            socket.emit("execute:status", { stage: "execution", status: "stopped", message: "Process stopped by user." });
        });

        socket.on("disconnect", () => {
            console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
            const sessionId = socketSessionMap.get(socket.id);
            if (sessionId) {
                // Ensure any lingering session is terminated
                sessionManager.stopSession(sessionId);
                socketSessionMap.delete(socket.id);
            }
        });
    });

    return io;
}

module.exports = {
    initSocketServer
};
