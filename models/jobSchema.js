const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  type: {
    type: String,
    required: [true, "This field is required!"],
  },
  title: {
    type: String,
    required: [true, "This field is required!"],
  },
  location: {
    type: String,
    required: [true, "This field is required!"],
  },
  description: {
    type: String,
    required: [true, "This field is required!"],
  },
  salary: {
    type: String,
    required: [true, "This field is required!"],
  },
  company: {
    name: {
      type: String,
      required: [true, "This field is required!"],
    },
    description: {
      type: String,
      required: [true, "This field is required!"],
    },
    contactEmail: {
      type: String,
      required: [true, "This field is required!"],
    },
    contactPhone: {
      type: String,
      required: [true, "This field is required!"],
    },
  },
});

module.exports = mongoose.model("Job", jobSchema);
