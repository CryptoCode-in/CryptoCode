const express = require("express");
const router = express.Router();
const {
    getNotifications,
    addNotification,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

router.get("/", getNotifications);
router.post("/", addNotification);
router.post("/login", addNotification);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

module.exports = router;
