const express = require("express");

const router = express.Router();

const {
    getStudents,
    getStudentById,
    registerStudent
} = require("../controllers/studentController");

const { verifyAdmin } = require("../middleware/authMiddleware");


// Get all students
router.get("/", getStudents);

// Admin registers student
router.post("/register", verifyAdmin, registerStudent);

// Get single student profile
router.get("/:id", getStudentById);

module.exports = router;