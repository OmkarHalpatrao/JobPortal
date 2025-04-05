const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const app = express()
const allowedOrigins = [
  process.env.CLIENT_URL,               
  "http://localhost:5173",              
]

// Middleware
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      } else {
        return callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

// Import routes
const authRoutes = require("./routes/auth")
const jobRoutes = require("./routes/job")
const applicationRoutes = require("./routes/application")
const profileRoutes = require("./routes/profile")

// Mount routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/jobs", jobRoutes)
app.use("/api/v1/applications", applicationRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1", pingRoutes)

// Connect to database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

