import { useState, useRef, useCallback } from "react"
import api from "../../services/api"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom" // Added for navigation
import { useAuth } from "../../context/AuthContext"
import { FaLinkedin } from "react-icons/fa"
import {
  HiOutlineGlobe,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlinePencil,
  HiOutlineCamera,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlinePhone,
  HiArrowLeft, // Added Back Icon
} from "react-icons/hi"

// ─── Enhanced Helpers ─────────────────────────────────────────────────────────

function InfoRow({ label, value, isLink = false, icon: Icon }) {
  if (!value) return null
  return (
    <div className="group">
      <dt className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 font-semibold">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {value.replace(/^https?:\/\//, "")}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

function RecruiterProfile({ user, profileData }) {
  const { token, updateUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)
  const [companyLogo, setCompanyLogo] = useState(user.companyLogo || null)
  const [logoLoading, setLogoLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    companyName: user.companyName || "",
    companyDescription: profileData?.companyDescription || "",
    industry: profileData?.industry || "",
    companySize: profileData?.companySize || "",
    foundedYear: profileData?.foundedYear || "",
    website: profileData?.website || "",
    location: profileData?.location || "",
    address: profileData?.address || "",
    linkedin: profileData?.socialProfiles?.linkedin || "",
  })

  // Handlers (kept your existing logic, focusing on UI polish)
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setErrors({})
  }, [])

  const handleLogoChange = useCallback(
    async (e) => {
      const file = e.target.files[0]
      if (!file) return
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Please upload JPEG or PNG image")
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be smaller than 2MB")
        return
      }
      setLogoLoading(true)
      const fd = new FormData()
      fd.append("companyLogo", file)
      try {
        const response = await api.post(
          `/profile/upload-logo`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.data.success) {
          setCompanyLogo(response.data.logoUrl)
          updateUser({ ...user, companyLogo: response.data.logoUrl })
          toast.success("Company logo updated")
        }
      } catch (err) {
        if (err.response?.status === 413) {
          toast.error("File is too large for Cloudinary (Max 2MB)")
        } else {
          toast.error(err.response?.data?.message || "Failed to upload logo")
        }
      } finally {
        setLogoLoading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    },
    [token, updateUser, user]
  )

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (!formData.companyName?.trim()) {
        toast.error("Company Name is required")
        return
      }
      setLoading(true)
      try {
        if (formData.companyName !== user.companyName) {
           await api.put(`/profile/company-name`, { companyName: formData.companyName }, { headers: { Authorization: `Bearer ${token}` } })
        }
        
        const updatedData = {
          companyDescription: formData.companyDescription,
          industry: formData.industry,
          companySize: formData.companySize,
          foundedYear: formData.foundedYear,
          website: formData.website,
          location: formData.location,
          address: formData.address,
          socialProfiles: {
            linkedin: formData.linkedin,
          },
        }

        const response = await api.put(`/profile`, updatedData, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.data.success) {
          toast.success("Profile updated successfully")
          setIsEditing(false)
          updateUser({ ...user, companyName: formData.companyName })
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update profile")
      } finally {
        setLoading(false)
      }
    },
    [formData, token, user, updateUser]
  )

  const fallbackLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    formData.companyName || "C"
  )}&background=4f46e5&color=fff&size=128`

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 animate-in fade-in duration-500">
      
      {/* ── Top Navigation Row ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </div>
          Back to Dashboard
        </button>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-all"
          >
            <HiOutlinePencil className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* ── Profile Header Card ────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Banner with subtle pattern overlay */}
          <div className="h-40 sm:h-48 bg-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          </div>

          <div className="px-6 sm:px-10 pb-8">
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">
              {/* Logo with better border and shadow */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-[6px] border-white shadow-2xl bg-white">
                  <img
                    src={companyLogo || fallbackLogo}
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={logoLoading}
                  className="absolute bottom-2 right-2 p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                  title="Update Logo"
                >
                  {logoLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  ) : (
                    <HiOutlineCamera className="w-5 h-5" />
                  )}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleLogoChange} accept="image/jpeg,image/png,image/jpg" />
              </div>

              {/* Title Info */}
              <div className="flex-1 text-center sm:text-left mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {formData.companyName || "Company Name"}
                  </h1>
                  <span className="inline-flex self-center px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100 uppercase tracking-wider">
                    Verified Recruiter
                  </span>
                </div>
                <p className="text-gray-500 font-medium mt-1">{user.email}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                    <HiOutlineGlobe className="w-4 h-4 text-indigo-500" />
                    {formData.industry || "Industry not set"}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                    <HiOutlineLocationMarker className="w-4 h-4 text-indigo-500" />
                    {formData.location || "Remote / Global"}
                  </div>
                </div>
              </div>

              {/* Quick Action Socials */}
              <div className="flex gap-2 sm:mb-2">
                {formData.website && (
                  <SocialLink href={formData.website} icon={HiOutlineGlobe} color="indigo" />
                )}
                {formData.linkedin && (
                  <SocialLink href={formData.linkedin} icon={FaLinkedin} color="blue" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ──────────────────────────────────────────────── */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-50 pb-5">
              <h2 className="text-xl font-bold text-gray-900">Edit Company Information</h2>
              <div className="flex items-center gap-3">
                 <button type="button" onClick={handleCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                 <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-60">
                   {loading ? "Saving..." : "Save Changes"}
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <RecField label="Company Name" required><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={rInputClass()} /></RecField>
                <RecField label="Industry"><input type="text" name="industry" value={formData.industry} onChange={handleChange} className={rInputClass()} /></RecField>
                <div className="md:col-span-2">
                    <RecField label="Company Description"><textarea rows={4} name="companyDescription" value={formData.companyDescription} onChange={handleChange} className={rInputClass()} /></RecField>
                </div>
                {/* ... other fields ... */}
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About Section - Spans 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HiOutlineOfficeBuilding className="text-indigo-500" />
                  About the Company
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {formData.companyDescription || "No description provided yet."}
                </p>
              </section>

              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Company Snapshot</h3>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
                  <InfoRow label="Industry" value={formData.industry} />
                  <InfoRow label="Company Size" value={formData.companySize} />
                  <InfoRow label="Founded" value={formData.foundedYear} />
                  <InfoRow label="Location" value={formData.location} />
                  <InfoRow label="Website" value={formData.website} isLink />
                </dl>
              </section>
            </div>

            {/* Sidebar Contact Card */}
            <div className="lg:col-span-1">
              <section className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl sticky top-6">
                <h3 className="text-lg font-bold mb-6">Direct Contact</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Official Email</p>
                    <p className="font-medium truncate">{user.email}</p>
                  </div>
                  {user.contactNumber && (
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Phone Number</p>
                      <div className="flex items-center gap-2 font-medium">
                        <HiOutlinePhone className="text-indigo-400" />
                        {user.contactNumber}
                      </div>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Headquarters</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {formData.address || "Address not specified"}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared Small Components ──────────────────────────────────────────────────

function SocialLink({ href, icon: Icon, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-600",
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-600",
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${colors[color]} p-2.5 rounded-xl transition-all hover:text-white hover:-translate-y-1 shadow-sm`}
    >
      <Icon className="w-5 h-5" />
    </a>
  )
}

function rInputClass(hasError = false) {
  return `mt-1.5 block w-full px-4 py-3 rounded-xl text-sm border transition-all focus:ring-4 focus:ring-indigo-50 ${
    hasError 
      ? "border-red-300 bg-red-50 focus:border-red-500" 
      : "border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-500"
  }`
}

function RecField({ label, required, children }) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

export default RecruiterProfile