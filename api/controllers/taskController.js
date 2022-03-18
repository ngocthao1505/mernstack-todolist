const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

// @desc      Get tasks
// @route    Get /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json(tasks);
});

// @desc      Get task by Id
// @route    Get /api/tasks
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(400);
    throw new Error("Task not found.");
  }
  res.status(200).json(task);
});

// @desc      Get tasks by task title
// @route    Get /api/tasks
const searchTasksByTitle = asyncHandler(async (req, res) => {
  if (req.params.keyWord && req.params.keyWord.length > 0) {
    const keyWord = req.params.keyWord.trim();
    const tasks = await Task.find({
      taskTitle: { $regex: keyWord, $options: "$i" },
    });
    res.status(200).json(tasks);
  }
});

// @desc      add task
// @route    POST /api/tasks
const addTasks = asyncHandler(async (req, res) => {
  if (!req.body.taskTitle) {
    res.status(400);
    throw new Error("Please add a task title field.");
  }

  const task = await Task.create({
    taskTitle: req.body.taskTitle,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
  });

  res.status(200).json(task);
});

// @desc      Update tasks
// @route    PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  console.log("eq.params.id", req.params.id);
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(400);
    throw new Error("Task not found.");
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedTask);
});

// @desc      DELETE a task
// @route    DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(400);
    throw new Error("Task not found.");
  }

  await task.remove();
  res.status(200).json({ message: `Deleted id: ${req.params.id}` });
});

// @desc      DELETE tasks
// @route    DELETE /api/tasks/:id
const deleteMultiTasks = asyncHandler(async (req, res) => {
  const IdArray = req.params.id.split(",");
  await Task.deleteMany({ _id: IdArray });

  res.status(200).json({ message: `Deleted successfully` });
});

module.exports = {
  getTasks,
  addTasks,
  updateTask,
  deleteMultiTasks,
  searchTasksByTitle,
  deleteTask,
  getTaskById,
};
