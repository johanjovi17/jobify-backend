const asyncHandler = require("express-async-handler");
const Job = require("../models/jobSchema");

//@desc GET all jobs
//@route GET /api/jobs
//@access public
const getJobs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query._limit) || 0; // Default to no limit if _limit is not provided
  const jobs = await Job.find().limit(limit);

  res.status(200).json(jobs);
});
//@desc create a job
//@route PUT /api/jobs
//@access public
const createJob = asyncHandler(async (req, res) => {
  const { type, title, location, description, salary, company } = req.body;
  if (!type || !title || !location || !description || !salary || !company) {
    res.status(400);
    throw new Error("All fields must be filled!");
  }
  const job = await Job.create({
    type,
    title,
    location,
    description,
    salary,
    company,
  });
  res.status(200).json(job);
});
//@desc GET a job
//@route GET /api/jobs/:id
//@access public
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("contact not found");
  }
  res.status(200).json(job);
});
//@desc update a job
//@route PUT /api/jobs/:id
//@access public
const editJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found!");
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedJob);
});
//@desc delete a job
//@route DELETE /api/jobs/:id
//@access public
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("contact not found");
  }
  await Job.findByIdAndDelete(req.params.id);
  res.status(200).json("Job deleted successfully");
});

module.exports = { getJobs, createJob, editJob, getJob, deleteJob };
