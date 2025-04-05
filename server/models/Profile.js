const mongoose = require("mongoose")

const ProfileSchema = new mongoose.Schema({
  // Common fields
  bio: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },

  // JobSeeker specific fields
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  dateOfBirth: {
    type: Date,
  },
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  experience: [
    {
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      currentlyWorking: Boolean,
      description: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      currentlyStudying: Boolean,
    },
  ],

  // Recruiter specific fields
  companyDescription: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  companySize: {
    type: String,
    trim: true,
  },
  foundedYear: {
    type: Number,
  },
  website: {
    type: String,
    trim: true,
  },

  // Social profiles for both
  socialProfiles: {
    linkedin: String,
    github: String,
    portfolio: String,
  },
})

module.exports = mongoose.model("Profile", ProfileSchema)

