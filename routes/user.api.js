const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
} = require("../controllers/user.controller.js");
const router = express.Router();

/**
 * @route GET api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name
 */
router.get("/", getAllUsers);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */

router.get("/:id", getUserById);

/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */
router.post("/", createUser);

module.exports = router;
