"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import OtpInput from "react-otp-input"

function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [signupData, setSignupData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get signup data from local storage
    const data = localStorage.getItem("signupData")
    if (!data) {
      navigate("/signup")
      return
    }

    setSignupData(JSON.parse(data))
  }, [navigate])

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault()

    if (!signupData) {
      toast.error("Signup data not found")
      navigate("/signup")
      return
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid OTP")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        ...signupData,
        otp,
      })

      if (response.data.success) {
        toast.success("Account created successfully")
        localStorage.removeItem("signupData")
        navigate("/login")
      }
    } catch (error) {
      console.error("Verification error:", error)
      toast.error(error.response?.data?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const resendOTP = async () => {
    if (!signupData) {
      toast.error("Signup data not found")
      navigate("/signup")
      return
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
        email: signupData.email,
      })

      if (response.data.success) {
        toast.success("OTP resent successfully")
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      toast.error(error.response?.data?.message || "Failed to resend OTP")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify Email</h1>

        <p className="text-center text-gray-600 mb-6">
          A verification code has been sent to {signupData?.email}. Enter the code below to verify your email.
        </p>

        <form onSubmit={handleVerifyAndSignup} className="space-y-6">
          <div className="flex justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="w-2"></span>}
              renderInput={(props) => (
                <input
                  {...props}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button onClick={resendOTP} className="font-medium text-indigo-600 hover:text-indigo-500">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail

