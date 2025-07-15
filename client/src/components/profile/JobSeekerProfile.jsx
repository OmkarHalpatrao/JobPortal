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
      {/* Gradient Header */}
      <div className="relative p-0 sm:p-0 bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500">
        {/* Edit button at top right of header */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 right-4 z-20 px-5 py-2 rounded-full bg-white text-blue-700 font-bold shadow-lg hover:bg-blue-50 border border-blue-200 transition"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
        <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-8">
          <div className="relative mb-2">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
              <img
                src={profilePhoto || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={handlePhotoClick}>
                <span className="text-white text-xs font-medium">Change Photo</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
        </div>
          <h2 className="text-2xl font-bold text-white mt-2">{user.firstName} {user.lastName}</h2>
          <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-white text-blue-700 shadow">Job Seeker</span>
          <p className="text-white/90 mt-2 text-center break-words">{user.email}</p>
          {formData.location && <p className="text-white/80 text-sm mt-1">{formData.location}</p>}
          {/* Social Links */}
          <div className="flex gap-3 mt-4">
              {formData.linkedin && (
              <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="bg-white text-blue-700 hover:bg-blue-100 rounded-full p-2 shadow transition">
                <FaLinkedin size={20} />
                </a>
              )}
              {formData.github && (
              <a href={formData.github} target="_blank" rel="noopener noreferrer" title="GitHub" className="bg-white text-gray-800 hover:bg-gray-200 rounded-full p-2 shadow transition">
                <FaGithub size={20} />
                </a>
              )}
              {formData.portfolio && (
              <a href={formData.portfolio} target="_blank" rel="noopener noreferrer" title="Portfolio" className="bg-white text-green-700 hover:bg-green-100 rounded-full p-2 shadow transition">
                <FaGlobe size={20} />
                </a>
              )}
            </div>
      </div>
      </div>
      {/* Main Content */}
      <div className="p-4 sm:p-8 space-y-6 bg-gray-50">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Add your edit form fields here, similar to the original edit form */}
            {/* Example: */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
            {/* Add other fields for gender, dateOfBirth, location, address, skills, linkedin, github, portfolio, etc. */}
            <button type="submit" disabled={loading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <>
            {/* Bio Card */}
            <div className="bg-white rounded-xl shadow p-5 flex items-start gap-3">
              <span className="text-blue-500 mt-1"><FaGlobe /></span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bio</h3>
                <p className="mt-1 text-gray-700">{formData.bio || 'No bio added yet'}</p>
              </div>
            </div>
            {/* Skills Card */}
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
              {formData.skills ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.split(',').map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 shadow-sm">{skill.trim()}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No skills added yet</p>
              )}
            </div>
            {/* Education Card */}
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
              {profileData?.education && profileData.education.length > 0 ? (
                <ol className="relative border-l-2 border-blue-200 ml-2">
                  {profileData.education.map((edu, idx) => (
                    <li key={idx} className="mb-6 ml-4">
                      <div className="absolute w-3 h-3 bg-blue-400 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                      <h4 className="font-medium text-gray-900">{edu.institution}</h4>
                      <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                      <p className="text-sm text-gray-500">{new Date(edu.startDate).getFullYear()} - {edu.currentlyStudying ? 'Present' : new Date(edu.endDate).getFullYear()}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-600">No education details added yet</p>
              )}
            </div>
            {/* Experience Card */}
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
              {profileData?.experience && profileData.experience.length > 0 ? (
                <ol className="relative border-l-2 border-blue-200 ml-2">
                  {profileData.experience.map((exp, idx) => (
                    <li key={idx} className="mb-6 ml-4">
                      <div className="absolute w-3 h-3 bg-blue-400 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                      <h4 className="font-medium text-gray-900">{exp.position}</h4>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{new Date(exp.startDate).getFullYear()} - {exp.currentlyWorking ? 'Present' : new Date(exp.endDate).getFullYear()}</p>
                      {exp.description && <p className="mt-1 text-gray-600">{exp.description}</p>}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-600">No experience details added yet</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default JobSeekerProfile

