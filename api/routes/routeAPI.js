const express = require("express");
const router = express.Router();
const {
  getTasks,
  addTasks,
  updateTask,
  deleteMultiTasks,
  searchTasksByTitle,
  getTaskById,
} = require("../controllers/taskController");

router.route("/").get(getTasks).post(addTasks);

router.route("/:id").get(getTaskById).put(updateTask).delete(deleteMultiTasks);

router.route("/searchTasks/:keyWord").get(searchTasksByTitle);

module.exports = router;
