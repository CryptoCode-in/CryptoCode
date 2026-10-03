const express = require("express");

const router = express.Router();

const {
    saveSubmission,
    updateSubmission,
    getSubmissions,
    getSubmissionById,
    getSubmissionAnalytics
} = require("../controllers/submissionController");

router.post("/save", saveSubmission);
router.get("/analytics", getSubmissionAnalytics);
router.get("/:id", getSubmissionById);
router.put("/:id", updateSubmission);
router.get("/", getSubmissions);

module.exports = router;