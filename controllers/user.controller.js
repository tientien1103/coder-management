const { sendResponse, AppError } = require("../helpers/utils.js");
const mongoose = require("mongoose");
const User = require("../models/User.js");
const Task = require("../models/Task.js");
const ObjectId = require("mongoose").Types.ObjectId;

const userController = {};

userController.createUser = async (req, res, next) => {
  const info = req.body;
  try {
    if (!info.name)
      throw new AppError(406, "Bad request", "Field name is required");

    const employeeExisted = await User.findOne({ name: info.name });
    if (employeeExisted) {
      throw new AppError(400, "Bad request", "Task is existed");
    }

    const created = await User.create(info);
    sendResponse(
      res,
      200,
      true,
      { user: created },
      null,
      "Create user Successfully!"
    );
  } catch (err) {
    next(err);
  }
};

userController.getAllUsers = async (req, res, next) => {
  try {
    let filter = { isDeleted: false };
    let { name, tasks, page, limit, ...filterQuery } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!filterQuery[key] && filterQuery[key] !== 0) delete filterQuery[key];
    });
    if (name) {
      const regExp = new RegExp(name, "i");
      filter = { name: regExp };
    }
    const listOfFound = await User.find(filter)
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    sendResponse(
      res,
      200,
      true,
      { data: listOfFound },
      null,
      "Found list of users success"
    );
  } catch (err) {
    next(err);
  }
};

userController.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!ObjectId.isValid(id))
      throw new AppError(400, "Invalid ObjectId", "Bad request");

    const userById = await User.findById(id);
    if (!userById) {
      throw new AppError(400, "Bad request", " Not Found Employee");
    }
    const foundTask = await Task.find({ assignee: id });
    if (!foundTask && foundTask.length === 0) {
      return;
      sendResponse(
        res,
        200,
        true,
        { data: userById },
        null,
        "Found user successfully!"
      );
    } else {
      sendResponse(
        res,
        200,
        true,
        { user: userById, tasks: foundTask },
        null,
        "Found user successfully!"
      );
    }
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
