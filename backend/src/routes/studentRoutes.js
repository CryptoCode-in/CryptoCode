const express = require("express");

const router = express.Router();

const {
    getStudents,
    getStudentById
} = require("../controllers/studentController");

router.get("/", getStudents);

router.get("/:id", getStudentById);

module.exports = router;