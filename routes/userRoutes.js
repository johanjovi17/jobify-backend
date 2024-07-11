const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  updateProfileDetails,
} = require("../controllers/userController.js");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/profile").post(updateProfileDetails);

module.exports = router;
