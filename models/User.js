const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    // tasks: { type: mongoose.SchemaTypes.ObjectId, ref: "tasks" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
