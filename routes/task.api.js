const express = require("express");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");
const router = express.Router();

/**
 * @route GET api/tasks
 * @description Get a list of tasks
 * @access private
 * @allowedQueries: name
 */
router.get("/", getAllTasks);

/**
 * @route GET api/tasks/:id
 * @description Get task by id
 * @access public
 */

router.get("/:id", getTaskById);

/**
 * @route POST api/tasks
 * @description Create a new task
 * @access private, manager
 * @requiredBody: name
 */
router.post("/", createTask);

/**
 * @route PUT api/tasks/:id
 * @description Updated task
 * @access public
 */

router.put("/:id", updateTask);

/**
 * @route DELETE api/tasks/:id
 * @description Delete task
 * @access public
 */

router.put("/:id", deleteTask);

module.exports = router;
