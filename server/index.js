const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const morgan = require("morgan");
const helmet = require("helmet");

require("dotenv").config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5000",
  "http://localhost:4173",
];

// Core Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      withCredentials: true,
    },
  })
);

// Routes
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/job");
const applicationRoutes = require("./routes/application");
const profileRoutes = require("./routes/profile");

const {
  generateCsrfToken,
  doubleCsrfProtection,
} = require("./middleware/csrf");

// Health
app.get("/health", (req, res) => {
  res.send("OK");
});

// Public CSRF route
app.get("/api/v1/csrf-token", (req, res) => {
  const token = generateCsrfToken(req, res);
  res.status(200).json({ success: true, csrfToken: token });
});

// Public Auth routes
app.use("/api/v1/auth", authRoutes);

// Protected routes
app.use(doubleCsrfProtection);

app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/profile", profileRoutes);

// Error Handler
const { errorHandler } = require("./middleware/errorHandler");
app.use(errorHandler);

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});