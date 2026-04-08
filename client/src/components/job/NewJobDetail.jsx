/**
 * JobDetail.jsx — Fixed & Redesigned
 *
 * ROOT CAUSE FIX: The original component only rendered job.description.
 * All other fields (salary, deadline, requirements, benefits, skills,
 * experience, applications count, etc.) were completely absent from the JSX.
 *
 * Additional improvements:
 *  - Full job detail layout: metadata chips, salary, deadline, requirements,
 *    responsibilities, benefits, skills tags, apply form, save button
 *  - Application form shown inline (no separate page needed)
 *  - Recruiter actions clean, not floating oddly
 *  - Proper loading skeleton instead of a spinner
 *  - Mobile-first responsive layout
 *  - Semantic HTML + ARIA
 *  - No unnecessary re-renders (stable handlers)
 */

import { useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { useJobDetail } from "../../hooks/useJobDetail"
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlinePencil,
  HiOutlineX,
} from "react-icons/hi"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "N/A"
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function isExpired(deadline) {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Chip({ icon: Icon, label, color = "gray" }) {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${colors[color]}`}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {label}
    </span>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
      {children}
    </h2>
  )
}

function SkeletonLoader() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse" aria-busy="true" aria-label="Loading job details">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-slate-200 to-slate-100" />
        <div className="p-6 space-y-4">
          <div className="h-7 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-full w-24" />
            ))}
          </div>
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

function JobDetail() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    jobState,
    applicationState,
    uiState,
    setApplicationState,
    setUIState,
    toggleSaveJob,
    handleCloseJob,
    handleReopenJob,
    handleEditJob,
  } = useJobDetail()

  const { job, loading, error } = jobState
  const { hasApplied, resumeFile, coverLetter, loading: applyLoading } = applicationState
  const { isSaved, reopenModalOpen, newDeadline } = uiState

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    jobType: "",
  })
  const [showApplyForm, setShowApplyForm] = useState(false)

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenEditModal = useCallback(() => {
    setEditFormData({
      title: job.title || "",
      description: job.description || "",
      salary: job.salary || "",
      location: job.location || "",
      jobType: job.jobType || "",
    })
    setEditModalOpen(true)
  }, [job])

  const handleEditSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      try {
        await handleEditJob(editFormData)
        toast.success("Job updated successfully")
        setEditModalOpen(false)
      } catch {
        toast.error("Failed to update job")
      }
    },
    [editFormData, handleEditJob]
  )

  const handleResumeChange = useCallback(
    (e) => {
      const file = e.target.files[0]
      if (!file) return
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file")
        return
      }
      setApplicationState((prev) => ({ ...prev, resumeFile: file }))
    },
    [setApplicationState]
  )

  const handleApplyJob = useCallback(
    async (e) => {
      e.preventDefault()
      if (!user) {
        toast.error("Please login to apply")
        navigate("/login")
        return
      }
      if (!resumeFile) {
        toast.error("Please upload your resume")
        return
      }
      try {
        const formData = new FormData()
        formData.append("resume", resumeFile)
        formData.append("coverLetter", coverLetter)

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/applications/apply/${job._id}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${user.token}` },
            body: formData,
          }
        )
        const data = await response.json()
        if (data.success) {
          toast.success("Application submitted successfully!")
          setApplicationState((prev) => ({
            ...prev,
            hasApplied: true,
            resumeFile: null,
            coverLetter: "",
          }))
          setShowApplyForm(false)
        } else {
          toast.error(data.message || "Failed to submit application")
        }
      } catch {
        toast.error("Network error. Please try again.")
      }
    },
    [user, resumeFile, coverLetter, job, navigate, setApplicationState]
  )

  // ── Render states ─────────────────────────────────────────────────────────

  if (loading) return <SkeletonLoader />

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineX className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {error || "Job not found"}
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            This job may have been removed or the link is invalid.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    )
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const recruiterInfo = job.recruiter || {}
  const companyLogo =
    recruiterInfo.companyLogo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || "C")}&background=3b82f6&color=fff&size=128`

  const isRecruiterOwner =
    user?.accountType === "Recruiter" && user._id === recruiterInfo._id

  const isJobSeeker = user?.accountType === "JobSeeker"
  const expired = isExpired(job.deadline)

  const skillsArray = Array.isArray(job.skillsRequired)
    ? job.skillsRequired
    : typeof job.skillsRequired === "string"
    ? job.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean)
    : []

  const requirementsList = Array.isArray(job.requirements)
    ? job.requirements
    : typeof job.requirements === "string"
    ? job.requirements.split("\n").filter(Boolean)
    : []

  const responsibilitiesList = Array.isArray(job.responsibilities)
    ? job.responsibilities
    : typeof job.responsibilities === "string"
    ? job.responsibilities.split("\n").filter(Boolean)
    : []

  const benefitsList = Array.isArray(job.benefits)
    ? job.benefits
    : typeof job.benefits === "string"
    ? job.benefits.split("\n").filter(Boolean)
    : []

  // ── Layout ────────────────────────────────────────────────────────────────

  return (
    <main className="max-w-4xl mx-auto space-y-4 pb-10" aria-label="Job details">
      {/* ── Card: Header ─────────────────────────────────────────────────── */}
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Color bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

        <div className="p-5 sm:p-8">
          {/* Top row: logo + title + save/recruiter actions */}
          <div className="flex items-start gap-4">
            <Link
              to={`/company/${recruiterInfo._id}`}
              className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
              aria-label={`View ${job.company} company profile`}
            >
              <img
                src={companyLogo}
                alt={job.company || "Company logo"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200 shadow-sm"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    job.company || "C"
                  )}&background=3b82f6&color=fff&size=128`
                }}
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    {job.title}
                  </h1>
                  <Link
                    to={`/company/${recruiterInfo._id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-0.5 inline-block transition-colors"
                  >
                    {job.company}
                  </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Save button for job seekers */}
                  {isJobSeeker && (
                    <button
                      onClick={toggleSaveJob}
                      aria-label={isSaved ? "Unsave this job" : "Save this job"}
                      className="p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {isSaved ? (
                        <HiBookmark className="w-5 h-5 text-blue-600" />
                      ) : (
                        <HiOutlineBookmark className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  )}

                  {/* Recruiter controls */}
                  {isRecruiterOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleOpenEditModal}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                        Edit
                      </button>
                      {!job.isClosed ? (
                        <button
                          onClick={handleCloseJob}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Close
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setUIState((prev) => ({ ...prev, reopenModalOpen: true }))
                          }
                          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status badges */}
          {(job.isClosed || expired) && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-700 border border-red-100">
                {job.isClosed ? "Job Closed" : "Application Deadline Passed"}
              </span>
            </div>
          )}

          {/* Metadata chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {job.location && (
              <Chip icon={HiOutlineLocationMarker} label={job.location} color="gray" />
            )}
            {job.jobType && (
              <Chip icon={HiOutlineBriefcase} label={job.jobType} color="blue" />
            )}
            {job.workMode && (
              <Chip icon={HiOutlineClock} label={job.workMode} color="blue" />
            )}
            {job.experienceLevel && (
              <Chip icon={HiOutlineUsers} label={job.experienceLevel} color="amber" />
            )}
            {job.salary && (
              <Chip icon={HiOutlineCurrencyRupee} label={job.salary} color="green" />
            )}
            {job.deadline && (
              <Chip
                icon={HiOutlineCalendar}
                label={`Apply by ${formatDate(job.deadline)}`}
                color={expired ? "red" : "gray"}
              />
            )}
            {job.openings != null && (
              <Chip
                icon={HiOutlineUsers}
                label={`${job.openings} opening${job.openings !== 1 ? "s" : ""}`}
                color="gray"
              />
            )}
          </div>
        </div>
      </article>

      {/* ── Two-column layout on desktop ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Left: main content ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          {job.description && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <SectionHeading>About this Role</SectionHeading>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {job.description}
              </p>
            </section>
          )}

          {/* Responsibilities */}
          {responsibilitiesList.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <SectionHeading>Responsibilities</SectionHeading>
              <ul className="space-y-2" role="list">
                {responsibilitiesList.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-gray-700 text-sm sm:text-base">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {requirementsList.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <SectionHeading>Requirements</SectionHeading>
              <ul className="space-y-2" role="list">
                {requirementsList.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-gray-700 text-sm sm:text-base">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Benefits */}
          {benefitsList.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <SectionHeading>Benefits & Perks</SectionHeading>
              <ul className="space-y-2" role="list">
                {benefitsList.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-gray-700 text-sm sm:text-base">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills */}
          {skillsArray.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <SectionHeading>Required Skills</SectionHeading>
              <div className="flex flex-wrap gap-2" role="list">
                {skillsArray.map((skill, i) => (
                  <span
                    key={i}
                    role="listitem"
                    className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Apply form (job seekers only) */}
          {isJobSeeker && !hasApplied && !job.isClosed && !expired && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <SectionHeading>Apply for this Position</SectionHeading>
              {!showApplyForm ? (
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                >
                  Apply Now
                </button>
              ) : (
                <form onSubmit={handleApplyJob} className="space-y-4" noValidate>
                  <div>
                    <label
                      htmlFor="resume-upload"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Resume <span className="text-red-500" aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <div className="relative">
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeChange}
                        required
                        aria-describedby="resume-hint"
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p id="resume-hint" className="mt-1 text-xs text-gray-500">
                      PDF only, max 5MB
                    </p>
                    {resumeFile && (
                      <p className="mt-1.5 text-sm text-green-700 font-medium">
                        ✓ {resumeFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="cover-letter"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Cover Letter{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="cover-letter"
                      rows={4}
                      value={coverLetter}
                      onChange={(e) =>
                        setApplicationState((prev) => ({
                          ...prev,
                          coverLetter: e.target.value,
                        }))
                      }
                      placeholder="Tell the recruiter why you're a great fit..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applyLoading}
                      aria-disabled={applyLoading}
                      className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                    >
                      {applyLoading ? "Submitting…" : "Submit Application"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

          {/* Already applied */}
          {isJobSeeker && hasApplied && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
              <p className="text-green-700 font-semibold">
                ✓ You've already applied for this position
              </p>
            </div>
          )}

          {/* Job closed / expired for job seekers */}
          {isJobSeeker && !hasApplied && (job.isClosed || expired) && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
              <p className="text-gray-600 font-medium">
                This job is no longer accepting applications.
              </p>
            </div>
          )}
        </div>

        {/* ── Right: sidebar ──────────────────────────────────────────────── */}
        <aside className="space-y-4" aria-label="Job summary">
          {/* Quick facts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Job Overview
            </h2>
            <dl className="space-y-3">
              {[
                { label: "Job Type", value: job.jobType },
                { label: "Work Mode", value: job.workMode },
                { label: "Experience", value: job.experienceLevel },
                { label: "Salary", value: job.salary },
                { label: "Location", value: job.location },
                {
                  label: "Deadline",
                  value: job.deadline ? formatDate(job.deadline) : null,
                },
                {
                  label: "Openings",
                  value: job.openings != null ? `${job.openings}` : null,
                },
                {
                  label: "Posted",
                  value: job.createdAt ? formatDate(job.createdAt) : null,
                },
              ]
                .filter((f) => f.value)
                .map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-2">
                    <dt className="text-xs font-medium text-gray-500 flex-shrink-0">{label}</dt>
                    <dd className="text-sm text-gray-800 font-medium text-right">{value}</dd>
                  </div>
                ))}
            </dl>
          </div>

          {/* Company card */}
          {recruiterInfo._id && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                About the Company
              </h2>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={companyLogo}
                  alt={job.company}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{job.company}</p>
                  {recruiterInfo.industry && (
                    <p className="text-xs text-gray-500">{recruiterInfo.industry}</p>
                  )}
                </div>
              </div>
              <Link
                to={`/company/${recruiterInfo._id}`}
                className="block w-full text-center py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                View Company Profile
              </Link>
            </div>
          )}

          {/* CTA for logged-out visitors */}
          {!user && (
            <div className="bg-blue-600 rounded-2xl p-5 text-white text-center">
              <p className="font-semibold mb-1">Interested in this role?</p>
              <p className="text-blue-100 text-sm mb-4">
                Sign in to apply and track your application.
              </p>
              <Link
                to="/login"
                className="block w-full py-2.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Sign In to Apply
              </Link>
            </div>
          )}
        </aside>
      </div>

      {/* ── Edit Job Modal ──────────────────────────────────────────────────── */}
      {editModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 id="edit-modal-title" className="text-lg font-semibold text-gray-900">
                Edit Job Details
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                aria-label="Close edit modal"
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <HiOutlineX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {[
                { label: "Job Title", key: "title", required: true, as: "input" },
                { label: "Description", key: "description", as: "textarea" },
                { label: "Location", key: "location", as: "input" },
                { label: "Salary", key: "salary", as: "input" },
                { label: "Job Type", key: "jobType", as: "input" },
              ].map(({ label, key, required, as: Tag }) => (
                <div key={key}>
                  <label
                    htmlFor={`edit-${key}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {label}
                    {required && (
                      <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                    )}
                  </label>
                  {Tag === "textarea" ? (
                    <textarea
                      id={`edit-${key}`}
                      rows={4}
                      value={editFormData[key]}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  ) : (
                    <input
                      id={`edit-${key}`}
                      type="text"
                      required={required}
                      value={editFormData[key]}
                      onChange={(e) =>
                        setEditFormData((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reopen Modal ─────────────────────────────────────────────────────── */}
      {reopenModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reopen-modal-title"
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 id="reopen-modal-title" className="text-lg font-semibold text-gray-900 mb-4">
              Reopen Job
            </h3>
            <label htmlFor="new-deadline" className="block text-sm font-medium text-gray-700 mb-1.5">
              New Application Deadline
            </label>
            <input
              id="new-deadline"
              type="date"
              value={newDeadline}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setUIState((prev) => ({ ...prev, newDeadline: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUIState((prev) => ({ ...prev, reopenModalOpen: false }))}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReopenJob(newDeadline)}
                disabled={!newDeadline}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Reopen Job
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default JobDetail