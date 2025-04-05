"use client"

import { useState, useRef } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"

function RecruiterProfile({ user, profileData }) {
  const { token, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
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
    setFormData({
      ...formData,
      [name]: value,
    })
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

      // Remove the individual social profile fields
      delete updatedData.linkedin

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/profile`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })

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

  const handleLogoClick = () => {
    fileInputRef.current.click()
  }

  const handleLogoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG)")
      return
    }

    // Validate file size (max 2MB)
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
        // Update user in context
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
      <div className="p-6 bg-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Company Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="flex flex-col items-center">
              <div
                className="w-32 h-32 rounded-lg overflow-hidden mb-4 relative group cursor-pointer"
                onClick={handleLogoClick}
              >
                {logoLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <>
                    <img
                      src={companyLogo || "https://via.placeholder.com/150"}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Change Logo</span>
                    </div>
                  </>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
              </div>
              <h2 className="text-xl font-semibold">{user.companyName}</h2>
              <p className="text-gray-600">{user.email}</p>
              {!isEditing && (
                <>
                  <p className="mt-2 text-gray-600">{formData.location}</p>
                  {formData.website && (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-indigo-600 hover:text-indigo-800"
                    >
                      {formData.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {formData.linkedin && (
                    <a
                      href={formData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      LinkedIn
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="md:w-2/3">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">
                    Company Description
                  </label>
                  <textarea
                    id="companyDescription"
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                      Industry
                    </label>
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                      Company Size
                    </label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      id="foundedYear"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">About Us</h3>
                  <p className="mt-1 text-gray-600">
                    {formData.companyDescription || "No company description added yet"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                    <p className="mt-1 text-gray-900">{formData.industry || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Company Size</h3>
                    <p className="mt-1 text-gray-900">{formData.companySize || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Founded</h3>
                    <p className="mt-1 text-gray-900">{formData.foundedYear || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 text-gray-900">{formData.location || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1 text-gray-900">{formData.address || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                    <p className="mt-1 text-gray-900">{user.contactNumber || "Not specified"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecruiterProfile

