/**
 * JobSeekerProfile.jsx — Redesigned
 *
 * What changed and why:
 *  1. Edit form was incomplete — only had a bio field + a comment saying
 *     "add other fields". All fields are now implemented.
 *  2. Photo overlay was broken: the overlay div was a sibling inside the
 *     rounded-full container but the img was a direct child — the overlay
 *     never showed on hover. Fixed with proper positioning.
 *  3. formData is used as view source AND edit source. This means editing
 *     live updates the view (e.g. location in the header). This is correct
 *     behaviour but the original profile only showed bio & skills — all other
 *     sections (personal details, social links) were missing from the view.
 *     Now we properly display everything.
 *  4. Added client-side form validation.
 *  5. Full mobile responsive layout.
 *  6. Semantic HTML, ARIA labels, keyboard accessible.
 */

import { useState, useRef, useCallback } from "react"
import api from "../../services/api"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa"
import {
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlinePencil,
  HiOutlineCamera,
  HiOutlineX,
  HiOutlineCheck,
} from "react-icons/hi"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatYear(dateStr) {
  if (!dateStr) return ""
  return new Date(dateStr).getFullYear()
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      {/* <dd className="mt-0.5 text-sm text-gray-800 font-medium">{value}</dd> */}
      <dd className="mt-0.5 text-sm text-gray-800 font-medium break-all overflow-hidden">{value}</dd>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

function JobSeekerProfile({ user, profileData }) {
  const { token, updateUser } = useAuth()
  const fileInputRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto || null)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    bio: profileData?.bio || "",
    gender: profileData?.gender || "",
    dateOfBirth: profileData?.dateOfBirth
      ? new Date(profileData.dateOfBirth).toISOString().split("T")[0]
      : "",
    location: profileData?.location || "",
    address: profileData?.address || "",
    skills: Array.isArray(profileData?.skills)
      ? profileData.skills.join(", ")
      : profileData?.skills || "",
    linkedin: profileData?.socialProfiles?.linkedin || "",
    github: profileData?.socialProfiles?.github || "",
    portfolio: profileData?.socialProfiles?.portfolio || "",
    experience: profileData?.experience || [],
    education: profileData?.education || [],
  })

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = useCallback(() => {
    const errs = {}
    if (formData.linkedin && !/^https?:\/\//.test(formData.linkedin)) {
      errs.linkedin = "Must be a valid URL starting with http:// or https://"
    }
    if (formData.github && !/^https?:\/\//.test(formData.github)) {
      errs.github = "Must be a valid URL starting with http:// or https://"
    }
    if (formData.portfolio && !/^https?:\/\//.test(formData.portfolio)) {
      errs.portfolio = "Must be a valid URL starting with http:// or https://"
    }
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth)
      const now = new Date()
      const age = now.getFullYear() - dob.getFullYear()
      if (age < 16 || age > 80) {
        errs.dateOfBirth = "Please enter a valid date of birth"
      }
    }
    return errs
  }, [formData])

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const handleCancel = useCallback(() => {
    // Reset form to saved values
    setFormData({
      bio: profileData?.bio || "",
      gender: profileData?.gender || "",
      dateOfBirth: profileData?.dateOfBirth
        ? new Date(profileData.dateOfBirth).toISOString().split("T")[0]
        : "",
      location: profileData?.location || "",
      address: profileData?.address || "",
      skills: Array.isArray(profileData?.skills)
        ? profileData.skills.join(", ")
        : profileData?.skills || "",
      linkedin: profileData?.socialProfiles?.linkedin || "",
      github: profileData?.socialProfiles?.github || "",
      portfolio: profileData?.socialProfiles?.portfolio || "",
      experience: profileData?.experience || [],
      education: profileData?.education || [],
    })
    setErrors({})
    setIsEditing(false)
  }, [profileData])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const errs = validate()
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        toast.error("Please fix the errors before saving")
        return
      }
      setLoading(true)
      try {
        const updatedData = {
          bio: formData.bio,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth || undefined,
          location: formData.location,
          address: formData.address,
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          experience: formData.experience,
          education: formData.education,
          socialProfiles: {
            linkedin: formData.linkedin,
            github: formData.github,
            portfolio: formData.portfolio,
          },
        }
        const response = await api.put(
          `${import.meta.env.VITE_API_URL}/profile`,
          updatedData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.data.success) {
          toast.success("Profile updated successfully")
          setIsEditing(false)
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update profile")
      } finally {
        setLoading(false)
      }
    },
    [formData, validate, token]
  )

  const handlePhotoChange = useCallback(
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
      setPhotoLoading(true)
      const fd = new FormData()
      fd.append("profilePhoto", file)
      try {
        const response = await api.post(
          `${import.meta.env.VITE_API_URL}/profile/upload-photo`,
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.data.success) {
          setProfilePhoto(response.data.photoUrl)
          updateUser({ ...user, profilePhoto: response.data.photoUrl })
          toast.success("Photo updated")
        }
      } catch (err) {
        if (err.response?.status === 413) {
          toast.error("File is too large for Cloudinary (Max 2MB)")
        } else if (err.response?.status === 415) {
           toast.error("Invalid file format. Please upload JPG/PNG")
        } else if (err.message === "Network Error") {
           toast.error("Network failure. Could not reach image server.")
        } else {
          toast.error(err.response?.data?.message || err.message || "Failed to upload file")
        }
      } finally {
        setPhotoLoading(false)
      }
    },
    [token, updateUser, user]
  )

  const skillsArray = formData.skills
    ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-10">
      {/* ── Profile Header Card ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-500 relative">
          {/* Edit button */}
          <button
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-blue-700 text-sm font-semibold shadow hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
            aria-label={isEditing ? "Cancel editing profile" : "Edit your profile"}
          >
            {isEditing ? (
              <>
                <HiOutlineX className="w-4 h-4" /> Cancel
              </>
            ) : (
              <>
                <HiOutlinePencil className="w-4 h-4" /> Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Avatar + name */}
        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
            {/* Photo */}
            <div className="relative flex-shrink-0 self-center sm:self-auto">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                <img
                  src={
                    profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${user.firstName} ${user.lastName}`
                    )}&background=3b82f6&color=fff&size=128`
                  }
                  alt={`${user.firstName} ${user.lastName} profile photo`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Camera button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={photoLoading}
                aria-label="Change profile photo"
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60"
              >
                {photoLoading ? (
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <HiOutlineCamera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={handlePhotoChange}
                aria-label="Upload profile photo"
              />
            </div>

            {/* Name / role / social */}
            <div className="flex-1 text-center sm:text-left pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  Job Seeker
                </span>
                {formData.location && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                    {formData.location}
                  </span>
                )}
              </div>
              {/* Social links */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                {formData.linkedin && (
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaLinkedin size={15} />
                  </a>
                )}
                {formData.github && (
                  <a
                    href={formData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <FaGithub size={15} />
                  </a>
                )}
                {formData.portfolio && (
                  <a
                    href={formData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Portfolio website"
                    className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <FaGlobe size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Form ─────────────────────────────────────────────────────────── */}
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Edit profile form"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6"
        >
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
            Edit Profile
          </h2>

          {/* Bio */}
          <Field label="Bio" htmlFor="bio">
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="A short intro about yourself..."
              className={inputClass()}
            />
          </Field>

          {/* Personal details row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Gender" htmlFor="gender">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass()}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </Field>
            <Field
              label="Date of Birth"
              htmlFor="dateOfBirth"
              error={errors.dateOfBirth}
            >
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className={inputClass(errors.dateOfBirth)}
              />
            </Field>
            <Field label="City / Location" htmlFor="location">
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Maharashtra"
                className={inputClass()}
              />
            </Field>
            <Field label="Full Address" htmlFor="address">
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, City, PIN"
                className={inputClass()}
              />
            </Field>
          </div>

          {/* Skills */}
          <Field
            label="Skills"
            htmlFor="skills"
            hint="Comma-separated, e.g. React, Node.js, PostgreSQL"
          >
            <input
              id="skills"
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, PostgreSQL"
              className={inputClass()}
            />
          </Field>

          {/* Social links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Social Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="LinkedIn URL" htmlFor="linkedin" error={errors.linkedin}>
                <input
                  id="linkedin"
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourname"
                  className={inputClass(errors.linkedin)}
                />
              </Field>
              <Field label="GitHub URL" htmlFor="github" error={errors.github}>
                <input
                  id="github"
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/yourname"
                  className={inputClass(errors.github)}
                />
              </Field>
              <Field label="Portfolio URL" htmlFor="portfolio" error={errors.portfolio}>
                <input
                  id="portfolio"
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  className={inputClass(errors.portfolio)}
                />
              </Field>
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Work Experience</h3>
              <button type="button" onClick={() => setFormData(prev => ({...prev, experience: [...prev.experience, { company: "", position: "", startDate: "", endDate: "", description: "" }]}))} className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors">+ Add Experience</button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 bg-gray-50/50 rounded-xl space-y-4 relative">
                <button type="button" onClick={() => setFormData(prev => ({...prev, experience: prev.experience.filter((_, i) => i !== index)}))} className="absolute top-4 right-4 p-1 rounded-md text-red-400 hover:text-red-600 transition-colors"><HiOutlineX className="w-5 h-5"/></button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-6">
                  <Field label="Company" htmlFor={`exp-company-${index}`}>
                    <input type="text" value={exp.company} onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].company = e.target.value;
                      setFormData(prev => ({...prev, experience: newExp}));
                    }} className={inputClass()} placeholder="Company Name" />
                  </Field>
                  <Field label="Position" htmlFor={`exp-position-${index}`}>
                    <input type="text" value={exp.position} onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].position = e.target.value;
                      setFormData(prev => ({...prev, experience: newExp}));
                    }} className={inputClass()} placeholder="Job Title" />
                  </Field>
                  <Field label="Start Date" htmlFor={`exp-start-${index}`}>
                    <input type="date" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ""} onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].startDate = e.target.value;
                      setFormData(prev => ({...prev, experience: newExp}));
                    }} className={inputClass()} />
                  </Field>
                  <Field label="End Date" htmlFor={`exp-end-${index}`}>
                    <input type="date" value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ""} onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].endDate = e.target.value;
                      setFormData(prev => ({...prev, experience: newExp}));
                    }} className={inputClass()} />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Education</h3>
              <button type="button" onClick={() => setFormData(prev => ({...prev, education: [...prev.education, { institution: "", degree: "", field: "", startDate: "", endDate: "" }]}))} className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors">+ Add Education</button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-gray-200 bg-gray-50/50 rounded-xl space-y-4 relative">
                <button type="button" onClick={() => setFormData(prev => ({...prev, education: prev.education.filter((_, i) => i !== index)}))} className="absolute top-4 right-4 p-1 rounded-md text-red-400 hover:text-red-600 transition-colors"><HiOutlineX className="w-5 h-5"/></button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-6">
                  <Field label="Institution" htmlFor={`edu-inst-${index}`}>
                    <input type="text" value={edu.institution} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].institution = e.target.value;
                      setFormData(prev => ({...prev, education: newEdu}));
                    }} className={inputClass()} placeholder="College/University Name" />
                  </Field>
                  <Field label="Degree" htmlFor={`edu-deg-${index}`}>
                    <input type="text" value={edu.degree} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].degree = e.target.value;
                      setFormData(prev => ({...prev, education: newEdu}));
                    }} className={inputClass()} placeholder="e.g. B.Tech, B.Sc" />
                  </Field>
                   <Field label="Start Date" htmlFor={`edu-start-${index}`}>
                    <input type="date" value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ""} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].startDate = e.target.value;
                      setFormData(prev => ({...prev, education: newEdu}));
                    }} className={inputClass()} />
                  </Field>
                  <Field label="End Date" htmlFor={`edu-end-${index}`}>
                    <input type="date" value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ""} onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].endDate = e.target.value;
                      setFormData(prev => ({...prev, education: newEdu}));
                    }} className={inputClass()} />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2.5 px-5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              aria-disabled={loading}
              className="flex-1 py-2.5 px-5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <HiOutlineCheck className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ── Profile View ─────────────────────────────────────────────────────── */}
      {!isEditing && (
        <>
          {/* Bio */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
              <HiOutlineUser className="w-5 h-5 text-blue-500" />
              About
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {formData.bio || (
                <span className="text-gray-400 italic">No bio added yet. Click Edit Profile to add one.</span>
              )}
            </p>
          </section>

          {/* Personal Info */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Personal Details</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Gender" value={formData.gender} />
              <InfoRow
                label="Date of Birth"
                value={
                  formData.dateOfBirth
                    ? new Date(formData.dateOfBirth).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : null
                }
              />
              <InfoRow label="Location" value={formData.location} />
              <InfoRow label="Address" value={formData.address} />
              <InfoRow label="Contact" value={user.contactNumber} />
            </dl>
          </section>

          {/* Skills */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Skills</h2>
            {skillsArray.length > 0 ? (
              <div className="flex flex-wrap gap-2" role="list">
                {skillsArray.map((skill, i) => (
                  <span
                    key={i}
                    role="listitem"
                    className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No skills added yet.</p>
            )}
          </section>

          {/* Education */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
              <HiOutlineAcademicCap className="w-5 h-5 text-blue-500" />
              Education
            </h2>
            {profileData?.education?.length > 0 ? (
              <ol className="relative border-l-2 border-blue-100 ml-3 space-y-6">
                {profileData.education.map((edu, i) => (
                  <li key={i} className="ml-5">
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-[7px] mt-1 border-2 border-white" />
                    <p className="font-semibold text-gray-900 text-sm">{edu.institution}</p>
                    <p className="text-gray-600 text-sm">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {formatYear(edu.startDate)} –{" "}
                      {edu.currentlyStudying ? "Present" : formatYear(edu.endDate)}
                    </p>
                    {edu.grade && (
                      <p className="text-gray-500 text-xs mt-0.5">Grade: {edu.grade}</p>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-400 text-sm italic">No education details added yet.</p>
            )}
          </section>

          {/* Experience */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
              <HiOutlineBriefcase className="w-5 h-5 text-blue-500" />
              Work Experience
            </h2>
            {profileData?.experience?.length > 0 ? (
              <ol className="relative border-l-2 border-blue-100 ml-3 space-y-6">
                {profileData.experience.map((exp, i) => (
                  <li key={i} className="ml-5">
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full -left-[7px] mt-1 border-2 border-white" />
                    <p className="font-semibold text-gray-900 text-sm">{exp.position}</p>
                    <p className="text-gray-600 text-sm">{exp.company}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {formatYear(exp.startDate)} –{" "}
                      {exp.currentlyWorking ? "Present" : formatYear(exp.endDate)}
                    </p>
                    {exp.description && (
                      <p className="mt-1.5 text-gray-600 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-400 text-sm italic">No experience details added yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}

// ── Shared form helpers ───────────────────────────────────────────────────────

function inputClass(hasError = false) {
  const base =
    "mt-1 block w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  return hasError
    ? `${base} border-red-300 bg-red-50 focus:ring-red-500`
    : `${base} border-gray-200 bg-white hover:border-gray-300`
}

function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default JobSeekerProfile