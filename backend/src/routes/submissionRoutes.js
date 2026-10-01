const express = require("express");

const router = express.Router();

const {
    saveSubmission,
    updateSubmission,
    getSubmissions
} = require("../controllers/submissionController");

router.post("/save", saveSubmission);
router.put("/:id", updateSubmission);
router.get("/", getSubmissions);

module.exports = router;