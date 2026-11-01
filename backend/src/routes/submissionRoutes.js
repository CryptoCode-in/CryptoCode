const express = require("express");

const router = express.Router();

const {
    saveSubmission,
    updateSubmission,
    getSubmissions,
    getSubmissionById,
    getSubmissionAnalytics
} = require("../controllers/submissionController");

// Specific named routes first (before /:id wildcard)
router.post("/save", saveSubmission);
router.get("/analytics", getSubmissionAnalytics);
router.get("/", getSubmissions);

// Wildcard param routes last
router.get("/:id", getSubmissionById);
router.put("/:id", updateSubmission);

module.exports = router;
