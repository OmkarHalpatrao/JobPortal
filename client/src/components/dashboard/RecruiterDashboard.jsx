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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Job Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Posted Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applications
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{format(new Date(job.postedDate), "MMM dd, yyyy")}</div>
                      {job.deadline && (
                        <div className="text-sm text-gray-500">
                          Deadline: {format(new Date(job.deadline), "MMM dd, yyyy")}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.applications.length} applications</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.isClosed ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {job.isClosed ? "Closed" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/jobs/${job._id}`} className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>
                        <Link
                          to={`/dashboard/applications?jobId=${job._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Applications
                        </Link>
                        {!job.isClosed && (
                          <button
                            onClick={() => handleCloseJob(job._id)}
                            disabled={closeJobMutation.isPending}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Close
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          disabled={deleteJobMutation.isPending}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecruiterDashboard

