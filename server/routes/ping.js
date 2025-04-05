const express = require("express")
const router = express.Router()

// Simple ping endpoint to keep the server warm
router.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is active" })
})

module.exports = router

