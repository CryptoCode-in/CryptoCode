const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getRankings,
  getAdminStudents,
  getAdminTeachers,
  getAdminSubjects
} = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

// Public admin login endpoint (username & password check)
router.post("/login", adminLogin);

// Protected admin endpoints (Requires valid Admin Bearer token)
router.get("/rankings", verifyAdmin, getRankings);
router.get("/students", verifyAdmin, getAdminStudents);
router.get("/teachers", verifyAdmin, getAdminTeachers);
router.get("/subjects", verifyAdmin, getAdminSubjects);

module.exports = router;
