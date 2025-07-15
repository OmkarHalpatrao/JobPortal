import { useState, useRef } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"

function RecruiterProfile({ user, profileData }) {
  const { token, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
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
  const [loading, setLoading] = useState(false)
  const [logoLoading, setLogoLoading] = useState(false)
  const [companyLogo, setCompanyLogo] = useState(user.companyLogo)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedData = {
        ...formData,
        socialProfiles: {
          linkedin: formData.linkedin,
        },
      }

      delete updatedData.linkedin

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/profile`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (formData.companyName && formData.companyName !== user.companyName) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/profile/company-name`,
          { companyName: formData.companyName },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        updateUser({ ...user, companyName: formData.companyName }) // update in context
      }


      if (response.data.success) {
        toast.success("Company profile updated successfully")
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleLogoClick = () => fileInputRef.current.click()

  const handleLogoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG)")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB")
      return
    }

    setLogoLoading(true)
    const formData = new FormData()
    formData.append("companyLogo", file)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/profile/upload-logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setCompanyLogo(response.data.logoUrl)
        updateUser({ ...user, companyLogo: response.data.logoUrl })
        toast.success("Company logo updated successfully")
      }
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast.error(error.response?.data?.message || "Failed to upload logo")
    } finally {
      setLogoLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative p-0 sm:p-0 bg-gradient-to-r from-indigo-500 via-blue-400 to-blue-600">
        <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-8">
          <div className="relative mb-2">
            <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-white">
              <img
                src={companyLogo || "https://via.placeholder.com/150"}
                alt="Company Logo"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleLogoClick}
              >
                <span className="text-white text-xs font-medium">Change Logo</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
          </div>
          <h2 className="text-2xl font-bold text-white mt-2">{user.companyName}</h2>
          <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-white text-indigo-700 shadow">
            Recruiter
          </span>
          <p className="text-white/90 mt-2 text-center break-words">{user.email}</p>
          {formData.location && <p className="text-white/80 text-sm mt-1">{formData.location}</p>}
          <div className="flex gap-3 mt-4">
            {formData.website && (
              <a
                href={formData.website}
                target="_blank"
                rel="noopener noreferrer"
                title="Website"
                className="bg-white text-indigo-700 hover:bg-indigo-100 rounded-full p-2 shadow transition"
              >
                🌐
              </a>
            )}
            {formData.linkedin && (
              <a
                href={formData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="bg-white text-blue-700 hover:bg-blue-100 rounded-full p-2 shadow transition"
              >
                in
              </a>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="fixed sm:absolute bottom-6 right-6 sm:top-6 sm:right-6 z-20 px-5 py-3 rounded-full bg-white text-indigo-700 font-bold shadow-lg hover:bg-indigo-50 border border-indigo-200 transition sm:static sm:rounded-md sm:px-4 sm:py-2 sm:ml-auto sm:mr-0"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-6 bg-gray-50">
        <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ""}
                  onChange={handleChange}
                  className="mt-1 px-3 py-2 border rounded w-full text-sm"
                  placeholder="Enter company name"
                />
              ) : (
                <p className="mt-1 text-gray-900">{user.companyName || "Not specified"}</p>
              )}
            </div>
          <label className="font-semibold text-gray-900">Company Description</label>
          {isEditing ? (
            <textarea
              name="companyDescription"
              rows={4}
              value={formData.companyDescription}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full text-sm"
              placeholder="Enter company description"
            />
          ) : (
            <p className="text-gray-700">{formData.companyDescription || "No description added yet"}</p>
          )}
        </div>


        <div className="bg-white rounded-xl shadow p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Industry", "industry"],
            ["Company Size", "companySize"],
            ["Founded Year", "foundedYear", "number"],
            ["Location", "location"],
            ["Address", "address"],
            ["Website", "website"],
            ["LinkedIn", "linkedin"],
          ].map(([label, name, type = "text"]) => (
            <div key={name}>
              <h3 className="text-sm font-medium text-gray-500">{label}</h3>
              {isEditing ? (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 px-3 py-2 border rounded w-full text-sm"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData[name] || "Not specified"}</p>
              )}
            </div>
          ))}

          <div>
            <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
            <p className="mt-1 text-gray-900">{user.contactNumber || "Not specified"}</p>
          </div>
        </div>

        {isEditing && (
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default RecruiterProfile
