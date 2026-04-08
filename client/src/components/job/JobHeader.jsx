import { Link } from "react-router-dom"
import { format } from "date-fns"
import { getStatusBadgeColor } from "../../constants/jobStatus"

function JobHeader({ job, user }) {
  const recruiterInfo = job.recruiter || {}
  const companyLogo = recruiterInfo.companyLogo || "https://via.placeholder.com/150?text=Company"

  return (
    <header className="border-b border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
        <Link
          to={`/profile/${recruiterInfo._id}`}
          className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0"
          aria-label={`View ${job.company} profile`}
        >
          <img
            src={companyLogo}
            alt={`${job.company} logo`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/150?text=Company"
            }}
          />
        </Link>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{job.title}</h1>
              <div className="mt-2 text-gray-600">
                <Link to={`/profile/${recruiterInfo._id}`} className="hover:text-blue-600">
                  {job.company}
                </Link>
                <span className="mx-2">•</span>
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <span>{job.jobType}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 mt-3 sm:mt-0">
              {job.status && (
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(job.status)}`}>
                  {job.status}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Posted on {format(new Date(job.postedDate), "MMM dd, yyyy")}
            {job.deadline && (
              <>
                <span className="mx-2">•</span>
                Application deadline: {format(new Date(job.deadline), "MMM dd, yyyy")}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default JobHeader


