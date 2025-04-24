"use client"

import { Link } from "react-router-dom"
import { formatDistance } from "date-fns"
import { useAuth } from "../../context/AuthContext"
import { BookmarkIcon } from "./Icons"
import { useSavedJobs } from "../../hooks/useSavedJobs"
import { toast } from "react-hot-toast"

function JobCard({ job, isApplied, isSaved: propIsSaved, onUnsave }) {
  const { isAuthenticated, user } = useAuth()
  const { toggleSaveJob, isJobSaved } = useSavedJobs()

  // Use the prop if provided, otherwise use the hook
  const isSaved = propIsSaved !== undefined ? propIsSaved : isJobSaved(job._id)

  const handleToggleSaveJob = (e) => {
    e.preventDefault() // Prevent navigating to job details
    e.stopPropagation() // Prevent event bubbling

    if (!isAuthenticated || user.accountType !== "JobSeeker") {
      return
    }

    const newSavedState = toggleSaveJob(job)

    // Show a toast message when the job is saved or unsaved
    if (newSavedState) {
      toast.success("Job saved successfully!")
    } else {
      toast.info("Job unsaved.")
    }

    // If a callback was provided, call it
    if (onUnsave && !newSavedState) {
      onUnsave(job._id)
    }
  }

  // Get recruiter info if available
  const recruiterInfo = job.recruiter || {}
  const companyLogo = recruiterInfo.companyLogo || "https://via.placeholder.com/150?text=Company"

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="relative p-6">
        <div className="absolute top-2 right-2">
          {isAuthenticated && user.accountType === "JobSeeker" && (
            <button
              onClick={handleToggleSaveJob}
              className={`p-1 rounded-full focus:outline-none ${
                isSaved
                  ? "text-yellow-500" // Yellow color when saved
                  : "text-gray-400 hover:text-gray-500"
              } transition-colors duration-200`} // Apply transition for smooth color change
              title={isSaved ? "Unsave Job" : "Save Job"}
            >
              <BookmarkIcon filled={isSaved} />
            </button>
          )}
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={companyLogo || "/placeholder.svg"}
              alt={job.company}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://via.placeholder.com/150?text=Company"
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{job.title}</h3>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {job.jobType}
                </span>
                {isApplied && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Applied
                  </span>
                )}
                {job.isClosed && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Closed</span>
                )}
              </div>
            </div>

            <div className="text-gray-900 mb-4">
              <div className="flex items-center mb-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
                <span>
                  <strong>{job.company}</strong>
                </span>
              </div>

              <div className="flex items-center mb-1">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span>{job.location}</span>
              </div>

              {job.salary && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>{job.salary}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Posted {formatDistance(new Date(job.postedDate), new Date(), { addSuffix: true })}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  to={`/jobs/${job._id}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobCard
