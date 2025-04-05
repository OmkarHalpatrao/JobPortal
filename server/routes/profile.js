const express = require("express")
const router = express.Router()
const { getProfile, updateProfile, uploadProfilePhoto, uploadCompanyLogo } = require("../controllers/Profile")
const { auth } = require("../middleware/auth")
const { cloudinary } = require("../config/cloudinary")
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

// Set up storage for profile photos
const profilePhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job-portal/profile-photos",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
})

// Set up storage for company logos
const companyLogoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job-portal/company-logos",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
})

// Initialize multer upload
const profilePhotoUpload = multer({
  storage: profilePhotoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true)
    } else {
      cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false)
    }
  },
})

// Initialize multer upload for company logos
const companyLogoUpload = multer({
  storage: companyLogoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true)
    } else {
      cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false)
    }
  },
})

// Routes
router.get("/", auth, getProfile)
router.put("/", auth, updateProfile)
router.post("/upload-photo", auth, profilePhotoUpload.single("profilePhoto"), uploadProfilePhoto)
router.post("/upload-logo", auth, companyLogoUpload.single("companyLogo"), uploadCompanyLogo)

module.exports = router

