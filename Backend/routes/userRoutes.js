const express = require("express");
const {
  registerUser,
  getUsers,
  deleteUser,
  updateUserDetails,
  loginUser,
  logoutUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/users").get(getUsers);
router.route("/users/:id").put(updateUserDetails).delete(deleteUser);

module.exports = router;