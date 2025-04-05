const express = require("express")
const router = express.Router()
const { sendOTP, signup, login } = require("../controllers/Auth")

// Routes
router.post("/send-otp", sendOTP)
router.post("/signup", signup)
router.post("/login", login)

module.exports = router

