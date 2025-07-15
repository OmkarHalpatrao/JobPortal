const express = require("express");
const router = express.Router();
const cron = require('node-cron');
const axios = require('axios');
require("dotenv").config()
// Ping endpoint
router.get("/ping", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is active" });
});

// Self-ping using cron every 10 minutes
const BACKEND_URL = process.env.RENDER_BACKEND_URL;

cron.schedule('*/10 * * * *', async () => {
  try {
    await axios.get(`${BACKEND_URL}/api/v1/ping`);
    console.log('Pinged backend to keep it alive');
  } catch (err) {
    console.error('Ping failed:', err.message);
  }
});

module.exports = router;
