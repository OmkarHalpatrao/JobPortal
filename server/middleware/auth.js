const jwt = require("jsonwebtoken")
require("dotenv").config()

// Middleware to authenticate user from token
exports.auth = async (req, res, next) => {
  try {
    // Get token from cookies or authorization header
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "")

    // If token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Token missing",
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Invalid token",
      })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

// Middleware to check if user is job seeker
exports.isJobSeeker = async (req, res, next) => {
  try {
    if (req.user.accountType !== "JobSeeker") {
      return res.status(403).json({
        success: false,
        message: "This route is only accessible to job seekers",
      })
    }
    next()
  } catch (error) {
    console.error("isJobSeeker middleware error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

// Middleware to check if user is recruiter
exports.isRecruiter = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Recruiter") {
      return res.status(403).json({
        success: false,
        message: "This route is only accessible to recruiters",
      })
    }
    next()
  } catch (error) {
    console.error("isRecruiter middleware error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

