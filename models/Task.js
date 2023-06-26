const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "working", "review", "done", "archive"],
      default: "pending",
      required: true,
    },
    assignee: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("tasks", taskSchema);
module.exports = Task;
