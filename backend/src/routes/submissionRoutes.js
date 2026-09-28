const express = require("express");

const router = express.Router();

const {
    saveSubmission,
    getSubmissions
} = require("../controllers/submissionController");

router.post("/save", saveSubmission);
router.get("/", getSubmissions);

module.exports = router;