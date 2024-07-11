const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    res.status(400);
    res.json("All fields are required!");
  }

  // Check if the user already exists
  const availableUser = await User.findOne({ email });
  if (availableUser) {
    res.status(400);
    res.json("User already exists");
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  //check if user creation was successful
  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      role: user.role,
      message: "Account created successfully",
    });
  } else {
    res.status(400);
    res.json({ message: "User data not valid" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  //get the user
  const user = await User.findOne({ email });

  //check if user exists
  if (!user) {
    res.status(401);
    throw new Error("You dont have an account");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          role: user.role,
        },
      },

      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    res.status(200).json({
      success: true,
      message: "login successfully",
      accessToken,
      user,
    });
  } else {
    res.status(401);
    throw new Error("Email or Password not valid");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

//get profile details
const getProfileDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password"); // Excluding password field
  res.json(user);
});

//update profile details
const updateProfileDetails = asyncHandler(async (req, res) => {
  const { username, email, experience, age, location, bio } = req.body;
  // res.json(req.user);
  const user = await User.findOne({ email });
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.experience = req.body.experience || user.experience;
    user.role = req.body.role || user.role;
    user.age = req.body.age || user.age;
    user.location = req.body.location || user.location;
    user.bio = req.body.bio || user.bio;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      experience: updatedUser.experience,
      role: updatedUser.role,
      age: updatedUser.age,
      location: updatedUser.location,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfileDetails,
  updateProfileDetails,
};
