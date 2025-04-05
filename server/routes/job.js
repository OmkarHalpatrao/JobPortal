const express = require("express")
const router = express.Router()
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  closeJob,
} = require("../controllers/Job")
const { auth, isRecruiter } = require("../middleware/auth")

// Routes
router.post("/create", auth, isRecruiter, createJob)
router.get("/all", getAllJobs)
router.get("/:jobId", getJobById)
router.put("/:jobId", auth, isRecruiter, updateJob)
router.put("/:jobId/close", auth, isRecruiter, closeJob)
router.delete("/:jobId", auth, isRecruiter, deleteJob)
router.get("/recruiter/jobs", auth, isRecruiter, getRecruiterJobs)

module.exports = router

