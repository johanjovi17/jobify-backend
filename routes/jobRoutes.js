const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const employer = require("../middleware/employer");
const {
  getJobs,
  createJob,
  editJob,
  getJob,
  deleteJob,
  getJobLecture,
  createJobLecture,
} = require("../controllers/jobController.js");

router.use(validateToken); // Apply validateToken middleware to the routes below
router.route("/").get(getJobs);
// router.use(employer); // Apply employer check middleware to the routes below
router.route("/").post(createJob);
router.route("/:id").get(getJob).put(editJob).delete(deleteJob);
router.route("/:id/materials").get(getJobLecture).post(createJobLecture);

module.exports = router;
