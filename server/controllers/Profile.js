const User = require("../models/User")
const Profile = require("../models/Profile")
const { cloudinary } = require("../config/cloudinary")

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    // Find user with profile details
    const user = await User.findById(userId).populate("additionalDetails")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    return res.status(200).json({
      success: true,
      profile: user.additionalDetails,
      user,
    })
  } catch (error) {
    console.error("Error in getProfile:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Find profile
    const profile = await Profile.findById(user.additionalDetails)
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      })
    }

    // Update profile fields
    const updateData = req.body

    // Update profile
    Object.keys(updateData).forEach((key) => {
      if (key !== "socialProfiles") {
        profile[key] = updateData[key]
      }
    })

    // Update social profiles if provided
    if (updateData.socialProfiles) {
      profile.socialProfiles = {
        ...profile.socialProfiles,
        ...updateData.socialProfiles,
      }
    }

    await profile.save()

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    })
  } catch (error) {
    console.error("Error in updateProfile:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    })
  }
}

// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update user's profile photo
    user.profilePhoto = req.file.path
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      photoUrl: user.profilePhoto,
    })
  } catch (error) {
    console.error("Error in uploadProfilePhoto:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile photo",
      error: error.message,
    })
  }
}

// Upload company logo
exports.uploadCompanyLogo = async (req, res) => {
  try {
    const userId = req.user.id

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if user is a recruiter
    if (user.accountType !== "Recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can upload company logos",
      })
    }

    // Update user's company logo
    user.companyLogo = req.file.path
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Company logo uploaded successfully",
      logoUrl: user.companyLogo,
    })
  } catch (error) {
    console.error("Error in uploadCompanyLogo:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to upload company logo",
      error: error.message,
    })
  }
}

