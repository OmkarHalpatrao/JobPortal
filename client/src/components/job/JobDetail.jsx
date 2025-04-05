"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { format } from "date-fns"
import { useAuth } from "../../context/AuthContext"
import { BookmarkIcon } from "./Icons"

function JobDetail() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useAuth()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applyLoading, setApplyLoading] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [hasApplied, setHasApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`)
        setJob(response.data.job)
      } catch (error) {
        console.error("Error fetching job details:", error)
        toast.error("Failed to fetch job details")
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  // Check if user has already applied for this job
  useEffect(() => {
    if (isAuthenticated && user.accountType === "JobSeeker") {
      const checkApplicationStatus = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/applications/user`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const hasAppliedToJob = response.data.applications.some((app) => app.job._id === jobId)

          setHasApplied(hasAppliedToJob)
        } catch (error) {
          console.error("Error checking application status:", error)
        }
      }

      checkApplicationStatus()
    }
  }, [isAuthenticated, token, jobId, user])

  // Check if job is saved
  useEffect(() => {
    if (isAuthenticated && user.accountType === "JobSeeker" && job) {
      const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")
      setIsSaved(savedJobs.some((savedJob) => savedJob._id === job._id))
    }
  }, [isAuthenticated, user, job])

  const handleApplyJob = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error("Please login to apply for this job")
      navigate("/login")
      return
    }

    if (!resumeFile) {
      toast.error("Please upload your resume")
      return
    }

    if (user.accountType !== "JobSeeker") {
      toast.error("Only job seekers can apply for jobs")
      return
    }

    setApplyLoading(true)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append("resume", resumeFile)
      formData.append("coverLetter", coverLetter)

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/applications/apply/${jobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        toast.success("Application submitted successfully")
        setResumeFile(null)
        setCoverLetter("")
        setHasApplied(true)
      }
    } catch (error) {
      console.error("Error applying for job:", error)
      toast.error(error.response?.data?.message || "Failed to submit application")
    } finally {
      setApplyLoading(false)
    }
  }

  const handleResumeChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file")
        return
      }
      setResumeFile(file)
    }
  }

  const toggleSaveJob = () => {
    if (!isAuthenticated || user.accountType !== "JobSeeker" || !job) {
      return
    }

    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")

    if (isSaved) {
      // Remove job from saved jobs
      const updatedSavedJobs = savedJobs.filter((savedJob) => savedJob._id !== job._id)
      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
      setIsSaved(false)
      toast.success("Job removed from saved jobs")
    } else {
      // Add job to saved jobs
      savedJobs.push(job)
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs))
      setIsSaved(true)
      toast.success("Job saved successfully")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-700">Job not found</h3>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Back to Jobs
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      {/* Job Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
            <div className="mt-2 flex items-center text-gray-600">
              <span className="mr-4">{job.company}</span>
              <span className="mr-4">{job.location}</span>
              <span>{job.jobType}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
              {job.salary ? job.salary : "Salary not disclosed"}
            </span>
            {hasApplied && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">Applied</span>
            )}
            {job.isClosed && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">Closed</span>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Posted on {format(new Date(job.postedDate), "MMM dd, yyyy")}
            {job.deadline && <span> • Application deadline: {format(new Date(job.deadline), "MMM dd, yyyy")}</span>}
          </div>
          {isAuthenticated && user.accountType === "JobSeeker" && (
            <button
              onClick={toggleSaveJob}
              className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                isSaved
                  ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BookmarkIcon filled={isSaved} />
              <span>{isSaved ? "Saved" : "Save Job"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="p-6">
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Description</h2>
          <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
        </section>

        {job.requirements && job.requirements.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </section>
        )}

        {job.responsibilities && job.responsibilities.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </section>
        )}

        {job.skills && job.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Apply Now Form */}
        {user?.accountType === "JobSeeker" && !hasApplied && !job.isClosed && (
          <section className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Apply for this Job</h2>
            <form onSubmit={handleApplyJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
                {resumeFile && <p className="mt-1 text-sm text-gray-500">Selected file: {resumeFile.name}</p>}
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Tell the employer why you're a good fit for this role..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={applyLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {applyLoading ? "Submitting..." : "Apply Now"}
              </button>
            </form>
          </section>
        )}

        {user?.accountType === "JobSeeker" && hasApplied && (
          <section className="mt-8 border-t border-gray-200 pt-6">
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Application Submitted</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>You have already applied for this job. You can check the status in your dashboard.</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <button
                        onClick={() => navigate("/dashboard/jobseeker")}
                        className="px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        View Applications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {user?.accountType === "JobSeeker" && job.isClosed && !hasApplied && (
          <section className="mt-8 border-t border-gray-200 pt-6">
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Job Closed</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>This job is no longer accepting applications.</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <button
                        onClick={() => navigate("/jobs")}
                        className="px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Browse Other Jobs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default JobDetail

