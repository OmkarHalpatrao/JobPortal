const express = require("express")
const router = express.Router()
const {
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
  getUserApplications,
} = require("../controllers/Application")
const { auth, isJobSeeker, isRecruiter } = require("../middleware/auth")
const { resumeUpload } = require("../config/cloudinary")

// Routes
router.post("/apply/:jobId", auth, isJobSeeker, resumeUpload.single("resume"), applyForJob)
router.get("/applicants/:jobId", auth, isRecruiter, getJobApplications)
router.put("/:applicationId", auth, isRecruiter, updateApplicationStatus)
router.get("/user", auth, isJobSeeker, getUserApplications)

module.exports = router

