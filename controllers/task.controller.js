const { sendResponse, AppError } = require("../helpers/utils.js");
const mongoose = require("mongoose");
const User = require("../models/User.js");
const Task = require("../models/Task.js");
const ObjectId = require("mongoose").Types.ObjectId;

const taskController = {};

//createTask
taskController.createTask = async (req, res, next) => {
  const info = req.body;
  try {
    if (!info.name || !info.description)
      throw new AppError(406, "Bad request", "Missing required data");
    const taskExisted = await Task.findOne({ name: info.name });
    if (taskExisted) {
      throw new AppError(400, "Bad request", "Task is existed");
    }

    const created = await Task.create(info);
    sendResponse(
      res,
      200,
      true,
      { task: created },
      null,
      "Create Task Successfully!"
    );
  } catch (err) {
    next(err);
  }
};

// getAllTasks
taskController.getAllTasks = async (req, res, next) => {
  let filter = { isDeleted: false };
  let { name, status, page, limit, ...filterQuery } = req.query;
  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;
  try {
    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!filterQuery[key] && filterQuery[key] !== 0) delete filterQuery[key];
    });
    if (name) {
      const regExp = new RegExp(name, "i");
      filter = { name: regExp, isDeleted: false };
    }
    if (status) {
      filter = { status: status, isDeleted: false };
    }
    const listOfFound = await Task.find(filter)
      .populate("assignee")
      .sort({ createAt: -1, updateAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of tasks success"
    );
  } catch (error) {
    next(error);
  }
};

// getTaskById
taskController.getTaskById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!ObjectId.isValid(id))
      throw new AppError(400, "Invalid ObjectId", "Bad request");

    const taskById = await Task.findById(id);
    if (!taskById) throw new AppError(400, "Bad request", " Not Found Task");

    sendResponse(
      res,
      200,
      true,
      { data: taskById },
      null,
      "Found task successfully!"
    );
  } catch (err) {
    next(err);
  }
};
// updateTask
taskController.updateTask = async (req, res, next) => {
  const { id } = req.params;
  let update = req.body;
  const { status, assignee } = update;
  const allowUpdate = ["pending", "working", "review", "done", "archive"];
  try {
    if (!ObjectId.isValid(id))
      throw new AppError(400, "Invalid ObjectId", "Bad request");
    if (assignee) {
      update.assignee = assignee;
    }
    const oldTask = await Task.findById(id);
    if (oldTask.status === "done" && update.status !== "archive") {
      throw new AppError(
        400,
        "Bad Request",
        "Can only set status from done to archive"
      );
    } else if (oldTask.status === "archive") {
      throw new AppError(
        402,
        "Bad Request",
        "This task is already archived and cannot be changed"
      );
    } else {
      const newUpdate = await Task.findByIdAndUpdate(id, update, {
        new: true,
      });
      sendResponse(
        res,
        200,
        true,
        { data: newUpdate },
        null,
        `Update Task Success`
      );
    }
  } catch (err) {
    next(err);
  }
};

// deleteTask
taskController.deleteTask = async (req, res, next) => {
  const targetId = req.params.id;
  console.log(targetId);
  const options = { new: true };
  try {
    if (!ObjectId.isValid(targetId))
      throw new AppError(400, "Invalid ObjectId", "Bad request");
    const deleted = await Task.findByIdAndUpdate(
      targetId,
      { isDeleted: true },
      options
    );
    sendResponse(
      res,
      200,
      true,
      { data: "oke" },
      null,
      "Delete Task  Successfully!"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
