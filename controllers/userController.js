const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    res.status(400);
    throw new Error("All fields are required!");
  }

  // Check if the user already exists
  const availableUser = await User.findOne({ email });
  if (availableUser) {
    res.status(400);
    throw new Error("User already exists");
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
    res.status(201).json({ _id: user.id, email: user.email, role: user.role });
  } else {
    res.status(400);
    throw new Error("User data not valid");
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

    res
      .status(200)
      .json({
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

module.exports = { registerUser, loginUser, logoutUser };
