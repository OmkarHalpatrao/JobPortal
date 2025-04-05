const mongoose = require("mongoose")

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: String, // URL to resume file
    required: true,
  },
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewing", "Shortlisted", "Rejected", "Hired"],
    default: "Pending",
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
})

module.exports = mongoose.model("Application", ApplicationSchema)

