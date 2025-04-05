const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
  // For JobSeeker: firstName and lastName
  // For Recruiter: companyName
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["JobSeeker", "Recruiter"],
    required: true,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
  resume: {
    type: String, // URL to resume file
  },
  profilePhoto: {
    type: String, // URL to profile photo
  },
  companyLogo: {
    type: String, // URL to company logo
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

module.exports = mongoose.model("User", UserSchema)

