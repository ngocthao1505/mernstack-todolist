const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: [true, "Please add a task title field'"],
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
    },
    dueDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
