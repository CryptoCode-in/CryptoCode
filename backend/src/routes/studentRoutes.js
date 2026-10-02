const express = require("express");
const router = express.Router();

const { getStudents, registerStudent } = require("../controllers/studentController");
const { verifyAdmin } = require("../middleware/authMiddleware");

router.get("/", getStudents);
// Registering students requires ADMIN privileges
router.post("/register", verifyAdmin, registerStudent);

module.exports = router;