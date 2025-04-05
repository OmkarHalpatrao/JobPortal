const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const emailTemplate = require("../utils/emailTemplate")

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // The document will be automatically deleted after 5 minutes
  },
})

// Function to send verification email
async function sendVerificationEmail(email, otp) {
  try {
    const subject = "Email Verification for Job Portal"
    const message = emailTemplate(otp)
    const mailResponse = await mailSender(email, subject, message)
    console.log("Email sent successfully:", mailResponse)
  } catch (error) {
    console.error("Error occurred while sending mail:", error)
    throw error
  }
}

// Pre-save middleware to send an email before saving OTP
OTPSchema.pre("save", async function (next) {
  try {
    await sendVerificationEmail(this.email, this.otp)
    next()
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model("OTP", OTPSchema)

