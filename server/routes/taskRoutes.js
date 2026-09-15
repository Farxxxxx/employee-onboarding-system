const express = require("express");
const router = express.Router();
const {
    createTask,
    getTasksByEmployee,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

router.post("/", createTask);
router.get("/employee/:employeeId", getTasksByEmployee);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;