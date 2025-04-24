import { useState, useRef } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa" 


function JobSeekerProfile({ user, profileData }) {
  const { token, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    bio: profileData?.bio || "",
    gender: profileData?.gender || "",
    dateOfBirth: profileData?.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split("T")[0] : "",
    location: profileData?.location || "",
    address: profileData?.address || "",
    skills: profileData?.skills?.join(", ") || "",
    linkedin: profileData?.socialProfiles?.linkedin || "",
    github: profileData?.socialProfiles?.github || "",
    portfolio: profileData?.socialProfiles?.portfolio || "",
  })
  const [loading, setLoading] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto)
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
      // Convert skills string to array
      const updatedData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
        socialProfiles: {
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio,
        },
      }

      // Remove the individual social profile fields
      delete updatedData.linkedin
      delete updatedData.github
      delete updatedData.portfolio

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/profile`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        toast.success("Profile updated successfully")
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current.click()
  }

  const handlePhotoChange = async (e) => {
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

    setPhotoLoading(true)
    const formData = new FormData()
    formData.append("profilePhoto", file)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/profile/upload-photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setProfilePhoto(response.data.photoUrl)
        // Update user in context
        updateUser({ ...user, profilePhoto: response.data.photoUrl })
        toast.success("Profile photo updated successfully")
      }
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast.error(error.response?.data?.message || "Failed to upload photo")
    } finally {
      setPhotoLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 bg-blue-600 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50"
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
          className="w-32 h-32 rounded-full overflow-hidden mb-4 relative group cursor-pointer"
          onClick={handlePhotoClick}
        >
          {photoLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <img
                src={profilePhoto || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change Photo</span>
              </div>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
        <h2 className="text-xl font-semibold">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-600">{user.email}</p>
        {!isEditing && (
          <>
            <p className="mt-2 text-gray-600">{formData.location}</p>
            <div className="mt-4 flex gap-4 text-sm items-center">
              {formData.linkedin && (
                <a
                  href={formData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <FaLinkedin /> LinkedIn
                </a>
              )}
              {formData.github && (
                <a
                  href={formData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-800 hover:text-black"
                >
                  <FaGithub /> GitHub
                </a>
              )}
              {formData.portfolio && (
                <a
                  href={formData.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-green-600 hover:text-green-800"
                >
                  <FaGlobe /> Portfolio
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>


          <div className="md:w-2/3">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                    Skills (Comma separated)
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Bio</h3>
                  <p className="mt-1 text-gray-600">{formData.bio || "No bio added yet"}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                    <p className="mt-1 text-gray-900">{formData.gender || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                    <p className="mt-1 text-gray-900">
                      {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : "Not specified"}
                    </p>
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

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                  {formData.skills ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.skills.split(",").map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-600">No skills added yet</p>
                  )}
                </div>

                {profileData?.education && profileData.education.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Education</h3>
                    <div className="mt-2 space-y-4">
                      {profileData.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-medium text-gray-900">{edu.institution}</h4>
                          <p className="text-gray-600">
                            {edu.degree} in {edu.field}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(edu.startDate).getFullYear()} -{" "}
                            {edu.currentlyStudying ? "Present" : new Date(edu.endDate).getFullYear()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Education</h3>
                    <p className="mt-1 text-gray-600">No education details added yet</p>
                  </div>
                )}

                {profileData?.experience && profileData.experience.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                    <div className="mt-2 space-y-4">
                      {profileData.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-medium text-gray-900">{exp.position}</h4>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(exp.startDate).getFullYear()} -{" "}
                            {exp.currentlyWorking ? "Present" : new Date(exp.endDate).getFullYear()}
                          </p>
                          {exp.description && <p className="mt-1 text-gray-600">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                    <p className="mt-1 text-gray-600">No experience details added yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobSeekerProfile

