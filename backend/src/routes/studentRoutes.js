const express = require("express");

const router = express.Router();

const {
    getStudents,
    getStudentById,
    getStudentAnalytics,
    registerStudent
} = require("../controllers/studentController");

const { verifyAdmin } = require("../middleware/authMiddleware");


// Get all students
router.get("/", getStudents);

// Admin registers student
router.post("/register", verifyAdmin, registerStudent);

// Get per-student analytics (submission trend, language usage, status distribution)
router.get("/:id/analytics", getStudentAnalytics);

// Get single student profile with computed metrics
router.get("/:id", getStudentById);

module.exports = router;
