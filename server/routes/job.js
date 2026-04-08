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
  getJobsByRecruiterId,
  reopenJob
} = require("../controllers/Job")
const { auth, isRecruiter } = require("../middleware/auth")

/**
 * @swagger
 * /jobs/create:
 *   post:
 *     summary: Create a new job posting
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       201:
 *         description: Job created successfully
 *       401:
 *         description: Unauthorized
 */
// Routes
router.post("/create", auth, isRecruiter, createJob)
router.get("/all", getAllJobs)
router.get("/:jobId", getJobById)
router.put("/edit/:jobId", auth, isRecruiter, updateJob)
router.put("/:jobId/close", auth, isRecruiter, closeJob)
router.put("/:jobId/reopen", auth, isRecruiter, reopenJob)
router.delete("/delete/:jobId", auth, isRecruiter, deleteJob)
router.get("/recruiter/jobs", auth, isRecruiter, getRecruiterJobs)
// Get public jobs by recruiter ID
router.get('/company/:recruiterId', getJobsByRecruiterId)

module.exports = router

