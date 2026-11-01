const express = require("express");

const router = express.Router();

const {
    saveSubmission,
    updateSubmission,
    getSubmissions,
    getSubmissionById,
    getSubmissionAnalytics
} = require("../controllers/submissionController");

const { authenticateUser } = require("../middleware/authMiddleware");

// Specific named routes first (before /:id wildcard)
router.post("/save", authenticateUser, saveSubmission);
router.get("/analytics", authenticateUser, getSubmissionAnalytics);
router.get("/", authenticateUser, getSubmissions);

// Wildcard param routes last
router.get("/:id", authenticateUser, getSubmissionById);
router.put("/:id", authenticateUser, updateSubmission);

module.exports = router;
