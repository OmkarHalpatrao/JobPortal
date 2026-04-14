import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import { toast } from "react-hot-toast"
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff, 
  HiOutlineArrowLeft,
  HiOutlineOfficeBuilding,
  HiOutlinePhone
} from "react-icons/hi"

const ACCOUNT_TYPE = {
  JobSeeker: "JobSeeker",
  Recruiter: "Recruiter",
}

function SignupForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.JobSeeker)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { firstName, lastName, companyName, email, password, confirmPassword, contactNumber } = formData

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const response = await api.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, { email })
      if (response.data.success) {
        localStorage.setItem("signupData", JSON.stringify({ ...formData, accountType }))
        toast.success("OTP sent! Please verify your email.")
        navigate("/verify-email")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700 bg-slate-50/30">
      
      {/* ── Top Navigation ── */}
      {/* <div className="max-w-xl w-full mx-auto mb-8">
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

      <div className="max-w-xl w-full mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-indigo-50/50 p-8 sm:p-12">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 font-medium mt-2">Join our community of professionals</p>
        </div>

        {/* ── Account Type Switcher ── */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-10 relative">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0 ${
              accountType === ACCOUNT_TYPE.Recruiter ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            onClick={() => setAccountType(ACCOUNT_TYPE.JobSeeker)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors ${
              accountType === ACCOUNT_TYPE.JobSeeker ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            Job Seeker
          </button>
          <button
            onClick={() => setAccountType(ACCOUNT_TYPE.Recruiter)}
            className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors ${
              accountType === ACCOUNT_TYPE.Recruiter ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            Recruiter
          </button>
        </div>

        <form onSubmit={handleOnSubmit} className="space-y-6">
          {/* ── Dynamic Fields ── */}
          {accountType === ACCOUNT_TYPE.JobSeeker ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="First Name" name="firstName" value={firstName} onChange={handleOnChange} icon={HiOutlineUser} placeholder="John" />
              <InputField label="Last Name" name="lastName" value={lastName} onChange={handleOnChange} icon={HiOutlineUser} placeholder="Doe" />
            </div>
          ) : (
            <InputField label="Company Name" name="companyName" value={companyName} onChange={handleOnChange} icon={HiOutlineOfficeBuilding} placeholder="Acme Inc." />
          )}

          <InputField label="Email Address" type="email" name="email" value={email} onChange={handleOnChange} icon={HiOutlineMail} placeholder="john@example.com" />
          <InputField label="Contact Number" type="tel" name="contactNumber" value={contactNumber} onChange={handleOnChange} icon={HiOutlinePhone} placeholder="+1 (555) 000-0000" />

          {/* ── Password Fields ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField 
              label="Password" 
              name="password" 
              value={password} 
              onChange={handleOnChange} 
              icon={HiOutlineLockClosed} 
              type={showPassword ? "text" : "password"}
              isPassword
              show={showPassword}
              toggleShow={() => setShowPassword(!showPassword)}
            />
            <InputField 
              label="Confirm Password" 
              name="confirmPassword" 
              value={confirmPassword} 
              onChange={handleOnChange} 
              icon={HiOutlineLockClosed} 
              type={showConfirmPassword ? "text" : "password"}
              isPassword
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-gray-400">
          Already a member?{" "}
          <button onClick={() => navigate("/login")} className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-2">
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}

// ── Reusable Input Sub-component ──

function InputField({ label, icon: Icon, isPassword, show, toggleShow, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <input
          {...props}
          required
          className="block w-full pl-11 pr-11 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-slate-900 font-medium placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={toggleShow}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-slate-600 transition-colors"
          >
            {show ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  )
}

export default SignupForm