"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"

// Account type constants
const ACCOUNT_TYPE = {
  JobSeeker: "JobSeeker",
  Recruiter: "Recruiter",
}

function SignupForm() {
  const navigate = useNavigate()

  // Account type state
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.JobSeeker)

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
  })

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Destructure form data
  const { firstName, lastName, companyName, email, password, confirmPassword, contactNumber } = formData

  // Handle input changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle form submission
  const handleOnSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    // Validate required fields based on account type
    if (accountType === ACCOUNT_TYPE.JobSeeker && (!firstName || !lastName)) {
      toast.error("First name and last name are required for job seekers")
      return
    }

    if (accountType === ACCOUNT_TYPE.Recruiter && !companyName) {
      toast.error("Company name is required for recruiters")
      return
    }

    try {
      // Send OTP request
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
        email,
      })

      // If OTP sent successfully, store form data in local storage and navigate to OTP verification page
      if (response.data.success) {
        localStorage.setItem(
          "signupData",
          JSON.stringify({
            ...formData,
            accountType,
          }),
        )

        toast.success("OTP sent successfully")
        navigate("/verify-email")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error(error.response?.data?.message || "Failed to send OTP")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

      {/* Account Type Tabs */}
      <div className="flex mb-6 border rounded-md overflow-hidden">
        <button
          onClick={() => setAccountType(ACCOUNT_TYPE.JobSeeker)}
          className={`flex-1 py-3 text-center ${
            accountType === ACCOUNT_TYPE.JobSeeker ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Job Seeker
        </button>
        <button
          onClick={() => setAccountType(ACCOUNT_TYPE.Recruiter)}
          className={`flex-1 py-3 text-center ${
            accountType === ACCOUNT_TYPE.Recruiter ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Recruiter
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleOnSubmit} className="space-y-4">
        {accountType === ACCOUNT_TYPE.JobSeeker ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={handleOnChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={handleOnChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={companyName}
              onChange={handleOnChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={contactNumber}
            onChange={handleOnChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={handleOnChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button onClick={() => navigate("/login")} className="font-medium text-indigo-600 hover:text-indigo-500">
          Log in
        </button>
      </p>
    </div>
  )
}

export default SignupForm

