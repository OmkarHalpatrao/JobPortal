import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import OtpInput from "react-otp-input"
import { HiOutlineArrowLeft, HiOutlineMailOpen, HiOutlineRefresh } from "react-icons/hi"

function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [signupData, setSignupData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const data = localStorage.getItem("signupData")
    if (!data) {
      navigate("/signup")
      return
    }
    setSignupData(JSON.parse(data))
  }, [navigate])

  const handleVerifyAndSignup = async (e) => {
    if (e) e.preventDefault()

    if (!signupData) {
      toast.error("Signup data not found")
      navigate("/signup")
      return
    }

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        ...signupData,
        otp,
      })

      if (response.data.success) {
        toast.success("Account verified! Welcome aboard.")
        localStorage.removeItem("signupData")
        navigate("/login")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    if (!signupData) return navigate("/signup")

    const toastId = toast.loading("Sending new code...")
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
        email: signupData.email,
      })

      if (response.data.success) {
        toast.success("Code resent to your inbox", { id: toastId })
      }
    } catch (error) {
      toast.error("Failed to resend code", { id: toastId })
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      
      {/* ── Top Navigation ── */}
      <div className="max-w-md w-full mx-auto mb-8">
        <button
          onClick={() => navigate("/signup")}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <HiOutlineArrowLeft className="w-5 h-5" />
          </div>
          Back to Signup
        </button>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-indigo-50/50 p-8 sm:p-10 text-center">
        {/* ── Icon Header ── */}
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <HiOutlineMailOpen className="w-10 h-10 text-indigo-600" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Verify Email</h1>
        <p className="text-gray-500 font-medium mb-10 text-sm leading-relaxed">
          We've sent a 6-digit code to <br />
          <span className="text-indigo-600 font-bold">{signupData?.email}</span>
        </p>

        <form onSubmit={handleVerifyAndSignup} className="space-y-8">
          {/* ── Custom Styled OTP Input ── */}
          <div className="flex justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="w-2 sm:w-3"></span>}
              renderInput={(props) => (
                <input
                  {...props}
                  className="!w-12 h-14 sm:!w-14 sm:h-16 text-center border-2 border-gray-100 rounded-2xl text-xl font-black text-indigo-600 bg-gray-50/50 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                />
              )}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 bg-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : (
              "Verify & Create Account"
            )}
          </button>
        </form>

        {/* ── Resend Logic ── */}
        <div className="mt-10 pt-6 border-t border-gray-50">
          <p className="text-sm font-bold text-gray-400 mb-4">
            Didn't receive the code?
          </p>
          <button 
            onClick={resendOTP} 
            className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase text-[11px] tracking-widest hover:text-indigo-700 transition-colors p-2 hover:bg-indigo-50 rounded-xl"
          >
            <HiOutlineRefresh className="w-4 h-4" />
            Resend New Code
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail