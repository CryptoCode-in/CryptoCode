const express = require("express");

const router = express.Router();

const {
    getStudents,
    getStudentById,
    getStudentAnalytics,
    registerStudent
} = require("../controllers/studentController");

const { authenticateUser, requireTeacher, verifyAdmin } = require("../middleware/authMiddleware");

// Get all students (Scoped to Teacher's college; Admin can view all)
router.get("/", authenticateUser, requireTeacher, getStudents);

// Admin registers student
router.post("/register", verifyAdmin, registerStudent);

// Get per-student analytics (Scoped to Teacher's college; Admin can view all)
router.get("/:id/analytics", authenticateUser, requireTeacher, getStudentAnalytics);

// Get single student profile with computed metrics (Scoped to Teacher's college; Admin can view all)
router.get("/:id", authenticateUser, requireTeacher, getStudentById);

module.exports = router;
