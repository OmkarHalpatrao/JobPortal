import { Link } from "react-router-dom"
import { format } from "date-fns"
import { useAuth } from "../../context/AuthContext"
import { useUserApplications } from "../../hooks/useApplications"

function JobSeekerDashboard() {
  const { user } = useAuth()

  // Fetch user applications using React Query
  const { data: applicationsData, isLoading: applicationsLoading, error: applicationsError } = useUserApplications()

  // Extract applications from the response
  const applications = applicationsData?.applications || []

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Reviewing":
        return "bg-blue-100 text-blue-800"
      case "Shortlisted":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Hired":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (applicationsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Job Seeker Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user.firstName} {user.lastName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl font-bold text-indigo-600">{applications.length}</div>
          <div className="text-gray-600 mt-1">Total Applications</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl font-bold text-green-600">
            {applications.filter((app) => app.status === "Shortlisted" || app.status === "Hired").length}
          </div>
          <div className="text-gray-600 mt-1">Shortlisted/Hired</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl font-bold text-yellow-600">
            {applications.filter((app) => app.status === "Pending" || app.status === "Reviewing").length}
          </div>
          <div className="text-gray-600 mt-1">Pending/Reviewing</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Applications</h2>
          <Link
            to="/jobs"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Browse More Jobs
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-700">No applications yet</h3>
            <p className="text-gray-500 mt-2">You haven't applied to any jobs yet</p>
            <Link
              to="/jobs"
              className="mt-4 inline-block px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
            >
              Find Jobs
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Job</th>
                  <th className="px-6 py-3 text-left font-medium">Company</th>
                  <th className="px-6 py-3 text-left font-medium">Applied Date</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{application.job.title}</div>
                      <div className="text-sm text-gray-500">{application.job.location}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{application.job.company}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {format(new Date(application.appliedDate), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(application.status)}`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/jobs/${application.job._id}`} className="text-indigo-600 hover:text-indigo-800">
                        View Job
                      </Link>
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

export default JobSeekerDashboard

