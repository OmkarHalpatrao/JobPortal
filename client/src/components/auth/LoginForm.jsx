"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff, 
  HiOutlineArrowLeft 
} from "react-icons/hi"

function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData, {
        withCredentials: true,
      })

      if (response.data.success) {
        login(response.data.user, response.data.token)
        toast.success("Welcome back!")
        if (response.data.user.accountType === "JobSeeker") {
          navigate("/dashboard/jobseeker")
        } else {
          navigate("/dashboard/recruiter")
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      
      {/* ── Top Navigation ── */}
      {/* <div className="max-w-md w-full mx-auto mb-8">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <HiOutlineArrowLeft className="w-5 h-5" />
          </div>
          Back to Home
        </button>
      </div> */}

      <div className="max-w-md w-full mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-indigo-50/50 p-8 sm:p-10">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 font-medium mt-2">Enter your details to access your portal</p>
        </div>

        <form onSubmit={handleOnSubmit} className="space-y-6">
          {/* ── Email Field ── */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleOnChange}
                required
                placeholder="name@company.com"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-slate-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* ── Password Field ── */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-widest text-gray-400">
                Password
              </label>
              <button type="button" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                <HiOutlineLockClosed className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handleOnChange}
                required
                placeholder="••••••••"
                className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-slate-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ── Options ── */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-200 rounded-lg cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm font-bold text-gray-500 cursor-pointer">
              Stay logged in
            </label>
          </div>

          {/* ── Submit Button ── */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-4 bg-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* ── Footer Link ── */}
        <p className="mt-8 text-center text-sm font-bold text-gray-400">
          New here?{" "}
          <button 
            onClick={() => navigate("/signup")} 
            className="text-indigo-600 hover:text-indigo-700 transition-colors underline underline-offset-4 decoration-2"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginForm