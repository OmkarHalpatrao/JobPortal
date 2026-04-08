const Job = require("../models/Job")
const User = require("../models/User")
const Application = require("../models/Application")

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const { title, description, location, jobType, salary, requirements, responsibilities, skills, deadline } =
      req.body

    // Get recruiter from request
    const recruiterId = req.user.id

    // Validate recruiter
    const recruiter = await User.findById(recruiterId)
    if (!recruiter || recruiter.accountType !== "Recruiter") {
      return res.status(401).json({
        success: false,
        message: "Only recruiters can post jobs",
      })
    }
    console.log('Recruiter:', recruiter.companyName)
    const companyName = recruiter.companyName
    if (!companyName) {
      return res.status(400).json({ success: false, message: 'Recruiter profile missing company name' })
    }
    // Create job
    const job = await Job.create({
      title,
      description,
      company:companyName,
      location,
      jobType,
      salary,
      requirements,
      responsibilities,
      skills,
      recruiter: recruiterId,
      deadline,
    })

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    })
  }
}

// Get all jobs
exports.getAllJobs = async (req, res) => {
  
  try {
    // Check if there are any jobs in the database
    const jobCount = await Job.countDocuments()

    // Get all active and non-closed jobs
    const jobs = await Job.find({ isActive: true, isClosed: false }).populate(
      "recruiter",
      "firstName lastName companyName companyLogo email contactNumber",
    )

    // If no jobs are found, check if there are any jobs at all
    if (jobs.length === 0) {
      const allJobs = await Job.find()

      if (allJobs.length > 0) {
      }
    }

    return res.status(200).json({
      success: true,
      jobs,
    })
  } catch (error) {
    console.error("[Job] Error in getAllJobs:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    })
  }
}

// Get job by ID
exports.getJobById = async (req, res) => {
  
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId)
      .populate("recruiter", "firstName lastName companyName companyLogo email contactNumber")
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
          select: "firstName lastName email profilePhoto",
        },
      })

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    return res.status(200).json({
      success: true,
      job,
    })
  } catch (error) {
    console.error("[Job] Error in getJobById:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    })
  }
}

// Update job
exports.updateJob = async (req, res) => {
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
        message: "You are not authorized to update this job",
      })
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true,
      runValidators: true,
    })

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    })
  }
}

// Close job
exports.closeJob = async (req, res) => {
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
        message: "You are not authorized to close this job",
      })
    }

    // Close job
    job.isClosed = true
    await job.save()

    return res.status(200).json({
      success: true,
      message: "Job closed successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to close job",
      error: error.message,
    })
  }
}

//reopen job
exports.reopenJob = async (req, res) => {
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
        message: "You are not authorized to close this job",
      })
    }

    // Reopen job
    job.isClosed = false
    job.isActive = true
    const { newDeadline } = req.body;
    await job.save()

    return res.status(200).json({
      success: true,
      message: "Job closed successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to close job",
      error: error.message,
    })
  }
}
// Delete job
exports.deleteJob = async (req, res) => {
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
        message: "You are not authorized to delete this job",
      })
    }

    // Delete all applications for this job
    await Application.deleteMany({ job: jobId })

    // Delete job
    await Job.findByIdAndDelete(jobId)

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    })
  }
}

// Get jobs posted by a recruiter
exports.getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id

    const jobs = await Job.find({ recruiter: recruiterId }).populate({
      path: "applications",
      populate: {
        path: "applicant",
        select: "firstName lastName email profilePhoto",
      },
    })

    return res.status(200).json({
      success: true,
      jobs,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter jobs",
      error: error.message,
    })
  }
}

// ✅ Get jobs by recruiter ID (public access)
exports.getJobsByRecruiterId = async (req, res) => {
  try {
    const recruiterId = req.params.recruiterId

    const jobs = await Job.find({ recruiter: recruiterId, isActive: true })
      .sort({ postedDate: -1 }) // Optional: latest first

    return res.status(200).json({
      success: true,
      jobs,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs for this company",
      error: error.message,
    })
  }
}
