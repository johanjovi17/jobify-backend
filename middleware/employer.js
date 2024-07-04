const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const employer = asyncHandler(async (req, res, next) => {
  console.log("youre an employer");
  if (req.user && req.user.role === "employer") {
    next();
  } else {
    res.status(403);
    throw new Error("User does not have employer privileges");
  }
});

module.exports = employer;
