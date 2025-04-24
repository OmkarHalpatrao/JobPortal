const Application = require("../models/Application")
const Job = require("../models/Job")
const User = require("../models/User")
const { cloudinary } = require("../config/cloudinary")
const mailSender = require("../utils/mailSender")
const applicationEmailTemplate = require("../utils/applicationEmailTemplate")
const recruiterNotificationTemplate = require("../utils/recruiterNotificationTemplate")
const statusUpdateTemplate = require("../utils/statusUpdateTemplate")

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

    try {
      const applicantName = `${user.firstName} ${user.lastName}`
      const emailContent = applicationEmailTemplate(applicantName, job.title, job.company)
      await mailSender(user.email, "Job Application Confirmation", emailContent)

      // Send email notification to recruiter
      // const recruiter = job.recruiter
      // const recruiterName =
      //   recruiter.accountType === "Recruiter" ? recruiter.companyName : `${recruiter.firstName} ${recruiter.lastName}`
      // const recruiterEmailContent = recruiterNotificationTemplate(recruiterName, applicantName, job.title)
      // await mailSender(recruiter.email, "New Job Application Received", recruiterEmailContent)

    } catch (emailError) {
      console.error("Error sending email notification:", emailError)
      // Continue with the application process even if email fails
    }

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
      .populate("applicant")
      .populate({
        path: "job",
        populate: {
          path: "recruiter",
        },
      })

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

    const oldStatus = application.status

    // Update application
    application.status = status
    if (notes) {
      application.notes = notes
    }
    await application.save()

    if (oldStatus !== status) {
      try {
        const applicant = application.applicant
        const applicantName = `${applicant.firstName} ${applicant.lastName}`
        const emailContent = statusUpdateTemplate(applicantName, job.title, job.company, status)

        await mailSender(applicant.email, "Application Status Update", emailContent)
      } catch (emailError) {
        console.error("Error sending status update email:", emailError)
        // Continue with the status update even if email fails
      }
    }

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

exports.getApplicantProfile = async (req, res) => {
  try {
    const { applicantId } = req.params
    const userId = req.user.id

    // Check if user is a recruiter
    const recruiter = await User.findById(userId)
    if (!recruiter || recruiter.accountType !== "Recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can view applicant profiles",
      })
    }

    // Find applicant
    const applicant = await User.findById(applicantId).populate("additionalDetails")
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      })
    }

    // Check if recruiter has received an application from this applicant
    const applications = await Application.find({
      applicant: applicantId,
      job: { $in: await Job.find({ recruiter: userId }).select("_id") },
    })

    if (applications.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You can only view profiles of applicants who applied to your jobs",
      })
    }

    // Remove sensitive information
    applicant.password = undefined
    applicant.token = undefined

    return res.status(200).json({
      success: true,
      applicant,
    })
  } catch (error) {
    console.error("Error in getApplicantProfile:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicant profile",
      error: error.message,
    })
  }
}


