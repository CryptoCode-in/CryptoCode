const express = require("express");
const router = express.Router();
const {
    signup,
    login,
    updateProfile,
    changePassword
} = require("../controllers/authController");
const { adminLogin } = require("../controllers/adminController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.put("/profile", updateProfile);
router.post("/change-password", changePassword);
router.put("/change-password", changePassword);
module.exports = router;