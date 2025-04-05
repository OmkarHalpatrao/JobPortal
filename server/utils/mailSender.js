const nodemailer = require("nodemailer")
require("dotenv").config()

const mailSender = async (email, subject, html) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    // Send mail
    const info = await transporter.sendMail({
      from: "Job Portal <noreply@jobportal.com>",
      to: email,
      subject: subject,
      html: html,
    })

    return info
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

module.exports = mailSender

