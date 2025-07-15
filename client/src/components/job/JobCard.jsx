import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { formatDistance } from "date-fns"
import { useAuth } from "../../context/AuthContext"
import { toast } from "react-hot-toast"

function JobCard({ job, isApplied, isSaved: propIsSaved, toggleSaveJob, savedMode = false }) {
  const { isAuthenticated, user } = useAuth()
  const [localIsSaved, setLocalIsSaved] = useState(propIsSaved)

  useEffect(() => {
    setLocalIsSaved(propIsSaved)
  }, [propIsSaved])

  const handleToggleSaveJob = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated || user.accountType !== "JobSeeker") return
    setLocalIsSaved((prev) => !prev)
    const newSavedState = toggleSaveJob(job)
    toast[newSavedState ? "success" : "info"](newSavedState ? "Job saved successfully!" : "Job unsaved.")
  }

  const recruiterInfo = job.recruiter && typeof job.recruiter === "object" ? job.recruiter : { _id: job.recruiter }
  const companyId = recruiterInfo?._id
  const companyLogo = recruiterInfo.companyLogo || "https://via.placeholder.com/150?text=Company"

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative p-5 flex flex-col justify-between h-full">
        {/* Posted label */}
        <div className="absolute top-3 right-4 text-xs text-gray-400 font-medium">
          Posted {formatDistance(new Date(job.postedDate), new Date(), { addSuffix: true })}
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-4 mt-2">
          <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={companyLogo}
              alt={job.company}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://via.placeholder.com/150?text=Company"
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 leading-snug line-clamp-2">
              {job.title}
            </h3>
            {job.company && (
              <div className="text-sm text-blue-700 mt-1 truncate">
                {companyId ? (
                  <Link to={`/company/${companyId}`} className="hover:underline">
                    {job.company}
                  </Link>
                ) : (
                  job.company
                )}
              </div>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="text-sm text-gray-700 space-y-1 mb-5">
          {job.location && (
            <div className="flex items-center gap-1">
              <span role="img" aria-label="location">📍</span> {job.location}
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-1">
              <span role="img" aria-label="salary">💰</span> {job.salary}
            </div>
          )}
          {job.jobType && (
            <div className="flex items-center gap-1">
              <span role="img" aria-label="type">🧭</span> {job.jobType}
            </div>
          )}
          {isApplied && (
            <div className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-100">
              Applied
            </div>
          )}
          {job.isClosed && (
            <div className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-100">
              Closed
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between gap-3 flex-wrap">
          {isAuthenticated && user.accountType === "JobSeeker" && (
            <>
              {!savedMode && !localIsSaved && (
                <button
                  onClick={handleToggleSaveJob}
                  className="text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  Save Job
                </button>
              )}
              {savedMode && (
                <button
                  onClick={handleToggleSaveJob}
                  className="text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  Remove
                </button>
              )}
            </>
          )}
          <Link
            to={`/jobs/${job._id}`}
            className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all active:scale-95"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobCard
