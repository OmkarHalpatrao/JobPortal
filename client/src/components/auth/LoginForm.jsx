"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"

function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Loading state
  const [loading, setLoading] = useState(false)

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false)

  // Destructure form data
  const { email, password } = formData

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

    setLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData, {
        withCredentials: true,
      })

      if (response.data.success) {
        // Update auth context
        login(response.data.user, response.data.token)

        toast.success("Logged in successfully")

        // Redirect based on account type
        if (response.data.user.accountType === "JobSeeker") {
          navigate("/dashboard/jobseeker")
        } else {
          navigate("/dashboard/recruiter")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h2>

      <form onSubmit={handleOnSubmit} className="space-y-4">
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button onClick={() => navigate("/signup")} className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </button>
      </p>
    </div>
  )
}

export default LoginForm

