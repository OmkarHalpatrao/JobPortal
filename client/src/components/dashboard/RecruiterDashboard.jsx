import { Link } from "react-router-dom"
import { format } from "date-fns"
import { useAuth } from "../../context/AuthContext"
import { useRecruiterJobs, useCloseJob, useDeleteJob } from "../../hooks/useJobs"

function RecruiterDashboard() {
  const { user } = useAuth()

  // Fetch recruiter jobs using React Query
  const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useRecruiterJobs()

  // Mutations for job actions
  const closeJobMutation = useCloseJob()
  const deleteJobMutation = useDeleteJob()

  // Extract jobs from the response
  const jobs = jobsData?.jobs || []

  const handleCloseJob = async (jobId) => {
    if (!confirm("Are you sure you want to close this job? It will no longer accept applications.")) {
      return
    }

    closeJobMutation.mutate(jobId)
  }

  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return
    }

    deleteJobMutation.mutate(jobId)
  }

  if (jobsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Recruiter Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user.companyName}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Job Postings</h2>
          <Link
            to="/jobs/create"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-700">You haven't posted any jobs yet</h3>
            <p className="text-gray-500 mt-2">Start by posting your first job opening</p>
            <Link
              to="/jobs/create"
              className="mt-4 inline-block px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job._id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col justify-between h-full">
                <div>
                  <Link to={`/jobs/${job._id}`} className="text-lg font-bold text-blue-700 hover:underline block mb-1 truncate">
                    {job.title}
                  </Link>
                  <div className="text-sm text-gray-500 mb-2">{job.location}</div>
                  <div className="text-xs text-gray-400 mb-2">Posted: {format(new Date(job.postedDate), "MMM dd, yyyy")}</div>
                  {job.deadline && (
                    <div className="text-xs text-gray-400 mb-2">Deadline: {format(new Date(job.deadline), "MMM dd, yyyy")}</div>
                  )}
                  <div className="text-sm text-gray-700 mb-2">{job.applications.length} applications</div>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mb-2 ${
                      job.isClosed ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {job.isClosed ? "Closed" : "Active"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link
                    to={`/dashboard/applications?jobId=${job._id}`}
                    className="px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    Applications
                  </Link>
                  {!job.isClosed && (
                    <button
                      onClick={() => handleCloseJob(job._id)}
                      disabled={closeJobMutation.isPending}
                      className="px-3 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    disabled={deleteJobMutation.isPending}
                    className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecruiterDashboard

