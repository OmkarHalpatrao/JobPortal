import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { format } from "date-fns"
import * as XLSX from "xlsx"
import { useRecruiterJobs } from "../../hooks/useJobs"
import { useJobApplications, useUpdateApplicationStatus } from "../../hooks/useApplications"

function ApplicationsTab() {
  const [searchParams] = useSearchParams()
  const jobIdParam = searchParams.get("jobId")

  const [selectedJob, setSelectedJob] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)

  // Fetch recruiter jobs
  const { data: jobsData, isLoading: jobsLoading } = useRecruiterJobs()

  // Extract jobs from the response
  const jobs = jobsData?.jobs || []

  // Fetch applications for the selected job
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useJobApplications(selectedJob)

  // Extract applications from the response
  const applications = applicationsData?.applications || []

  // Mutation for updating application status
  const updateStatusMutation = useUpdateApplicationStatus()

  // Set selected job based on URL param or first job
  useEffect(() => {
    if (jobIdParam) {
      setSelectedJob(jobIdParam)
    } else if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]._id)
    }
  }, [jobIdParam, jobs, selectedJob])

  const handleStatusChange = async (applicationId, newStatus) => {
    updateStatusMutation.mutate({ applicationId, status: newStatus })
  }

  const exportToExcel = () => {
    if (applications.length === 0) {
      toast.error("No applications to export")
      return
    }

    setExportLoading(true)

    try {
      const selectedJobData = jobs.find((job) => job._id === selectedJob)

      // Prepare data for export
      const exportData = applications.map((app) => ({
        "Applicant Name": `${app.applicant.firstName} ${app.applicant.lastName}`,
        Email: app.applicant.email,
        Status: app.status,
        "Applied Date": format(new Date(app.appliedDate), "MMM dd, yyyy"),
        "Resume Link": app.resume,
        "Cover Letter": app.coverLetter || "N/A",
        Notes: app.notes || "N/A",
      }))

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Applications")

      // Generate file name
      const fileName = `${selectedJobData.title.replace(/\s+/g, "_")}_Applications_${format(new Date(), "yyyy-MM-dd")}.xlsx`

      // Export to file
      XLSX.writeFile(wb, fileName)

      toast.success("Applications exported successfully")
    } catch (error) {
      console.error("Error exporting applications:", error)
      toast.error("Failed to export applications")
    } finally {
      setExportLoading(false)
    }
  }

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
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (jobsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
        <p className="text-gray-600 mt-1">Manage applications for your job postings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Job Postings</h2>

            {jobs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">You haven't posted any jobs yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => setSelectedJob(job._id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedJob === job._id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.applications?.length || 0} application(s)</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {job.isClosed ? (
                        <span className="text-red-600">Closed</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedJob ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Applications for {jobs.find((job) => job._id === selectedJob)?.title || "Job"}
                </h2>
                <button
                  onClick={exportToExcel}
                  disabled={exportLoading || applications.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {exportLoading ? "Exporting..." : "Export to Excel"}
                </button>
              </div>

              {applicationsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-gray-700">No applications yet</h3>
                  <p className="text-gray-500 mt-2">There are no applications for this job posting yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-gray-600 text-sm">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium">Applicant</th>
                        <th className="px-6 py-3 text-left font-medium">Resume</th>
                        <th className="px-6 py-3 text-left font-medium">Applied Date</th>
                        <th className="px-6 py-3 text-left font-medium">Status</th>
                        <th className="px-6 py-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {applications.map((application) => (
                        <tr key={application._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-800">
                                {application.applicant.firstName} {application.applicant.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{application.applicant.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View Resume
                            </a>
                          </td>
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
                            <select
                              value={application.status}
                              onChange={(e) => handleStatusChange(application._id, e.target.value)}
                              className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              disabled={updateStatusMutation.isPending}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewing">Reviewing</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Hired">Hired</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-medium text-gray-700">No job selected</h3>
              <p className="text-gray-500 mt-2">Select a job from the list to view applications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationsTab

