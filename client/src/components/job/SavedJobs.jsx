"use client"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import JobCard from "./JobCard"
import { useUserApplications } from "../../hooks/useApplications"
import { useSavedJobs } from "../../hooks/useSavedJobs"

function SavedJobs() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Get saved jobs using our custom hook
  const { savedJobs, loading: savedJobsLoading, toggleSaveJob } = useSavedJobs()

  // Fetch user applications to show "Applied" badge
  const { data: applicationsData, isLoading: applicationsLoading } = useUserApplications({
    enabled: isAuthenticated && user?.accountType === "JobSeeker",
  })

  // Extract applied job IDs
  const appliedJobs = applicationsData?.applications?.map((app) => app.job._id) || []

  // Function to handle when a job is unsaved
  const handleJobUnsaved = (jobId) => {
    toggleSaveJob({ _id: jobId })
  }

  if (!isAuthenticated || user?.accountType !== "JobSeeker") {
    navigate("/login")
    return null
  }

  if (savedJobsLoading || applicationsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Saved Jobs</h1>
        <p className="text-gray-600 mt-1">Jobs you've saved for later</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700">No saved jobs</h3>
          <p className="text-gray-500 mt-2">You haven't saved any jobs yet</p>
          <button
            onClick={() => navigate("/jobs")}
            className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isApplied={appliedJobs.includes(job._id)}
              isSaved={true}
              onUnsave={() => handleJobUnsaved(job._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedJobs

