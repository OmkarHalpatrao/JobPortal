const express = require("express")
const router = express.Router()
const { sendOTP, signup, login, refresh, logout } = require("../controllers/Auth")
const { authLimiter, otpLimiter } = require("../middleware/rateLimiter")

// Routes
router.post("/send-otp", otpLimiter, sendOTP)
router.post("/signup", authLimiter, signup)
router.post("/login", authLimiter, login)
router.post("/refresh", refresh)
router.post("/logout", logout)

module.exports = router

