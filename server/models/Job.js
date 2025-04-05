const mongoose = require("mongoose")

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
    required: true,
  },
  salary: {
    type: String,
    trim: true,
  },
  requirements: [
    {
      type: String,
    },
  ],
  responsibilities: [
    {
      type: String,
    },
  ],
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  postedDate: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model("Job", JobSchema)

