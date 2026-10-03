require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const supabase = require("./src/config/supabase");

const authRoutes = require("./src/routes/authRoutes");
const submissionRoutes = require("./src/routes/submissionRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const { getSubmissionAnalytics } = require("./src/controllers/submissionController");
const executionManager = require("./execution/executionManager");
const { initSocketServer } = require("./socket/socketHandler");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server 
initSocketServer(server);

app.use(cors());
app.use(express.json());


// Health check
app.get("/", (req, res) => {
    res.send("Cryptocode Backend Running");
});


// Profiles
app.get("/profiles", async(req, res) => {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*");

        if (error) {
            return res.status(500).json(error);
        }

        res.json(data);

    } catch (error) {
        console.error("Profiles error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch profiles"
        });
    }
});


// Authentication routes
app.use("/auth", authRoutes);
app.use("/submissions", submissionRoutes);
app.use("/students", studentRoutes);
app.use("/admin", adminRoutes);
app.get("/analytics", getSubmissionAnalytics);


// Code execution route (batch / backwards-compatible)
app.post("/api/execute", async(req, res) => {
    try {
        const {
            language,
            code,
            input = ""
        } = req.body;

        if (!language || !code) {
            return res.status(400).json({
                success: false,
                error: "Language and code are required."
            });
        }

        const result = await executionManager.execute(
            language,
            code,
            input
        );

        res.json(result);

    } catch (error) {
        console.error("Execution error:", error);

        res.status(500).json({
            success: false,
            error: "Execution service failed."
        });
    }
});

// Start HTTP & WebSocket server
server.listen(5000, () => {
    console.log("Server running on port 5000");
});