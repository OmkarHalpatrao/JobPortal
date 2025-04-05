const Application = require("../models/Application")
const Job = require("../models/Job")
const User = require("../models/User")
const { cloudinary } = require("../config/cloudinary")

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const userId = req.user.id
    const { coverLetter } = req.body

    // Resume URL from Cloudinary (uploaded via multer middleware)
    const resumeUrl = req.file ? req.file.path : null

    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      })
    }

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if job is active
    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      })
    }

    // Check if user is a job seeker
    const user = await User.findById(userId)
    if (!user || user.accountType !== "JobSeeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can apply for jobs",
      })
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    })

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      })
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      resume: resumeUrl,
      coverLetter,
    })

    // Update job with application
    job.applications.push(application._id)
    await job.save()

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    })
  } catch (error) {
    console.error("Error in applyForJob:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    })
  }
}

// Get all applications for a job (recruiter only)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params
    const userId = req.user.id

    // Find job
    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if user is the recruiter who posted the job
    if (job.recruiter.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these applications",
      })
    }

    // Get applications
    const applications = await Application.find({ job: jobId })
      .populate("applicant", "firstName lastName email")
      .populate("job", "title company")

    return res.status(200).json({
      success: true,
      applications,
    })
  } catch (error) {
    console.error("Error in getJobApplications:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    })
  }
}

// Update application status (recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params
    const userId = req.user.id
    const { status, notes } = req.body

    // Find application
    const application = await Application.findById(applicationId)

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      })
    }

    // Find job
    const job = await Job.findById(application.job)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check if user is the recruiter who posted the job
    if (job.recruiter.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application",
      })
    }

    // Update application
    application.status = status
    if (notes) {
      application.notes = notes
    }
    await application.save()

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    })
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    })
  }
}

// Get user's applications (job seeker only)
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id

    // Check if user is a job seeker
    const user = await User.findById(userId)
    if (!user || user.accountType !== "JobSeeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can view their applications",
      })
    }

    // Get applications
    const applications = await Application.find({ applicant: userId })
      .populate("job", "title company location salary jobType deadline")
      .sort({ appliedDate: -1 })

    return res.status(200).json({
      success: true,
      applications,
    })
  } catch (error) {
    console.error("Error in getUserApplications:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    })
  }
}

