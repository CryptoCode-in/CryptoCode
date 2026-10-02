const express = require("express");
const router = express.Router();
const {
    signup,
    login,
    updateProfile
} = require("../controllers/authController");
const { adminLogin } = require("../controllers/adminController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.put("/profile", updateProfile);
module.exports = router;