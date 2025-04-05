"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { format } from "date-fns"

function JobApplications({ jobId }) {
  const { token } = useAuth()
  const [applications, setApplications] = useState([])
  const [jobDetails, setJobDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/applications/job/${jobId}/applications`, {
          headers: { Authorization: `Bearer ${token}` },
          
        })

        setApplications(response.data.applications)
        setJobDetails(response.data.applications[0]?.job || null)
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast.error("Failed to fetch applications")
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchApplications()
    }
  }, [jobId, token])

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/applications/${applicationId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.success) {
        // Update the local state
        setApplications(applications.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app)))

        toast.success(`Application status updated to ${newStatus}`)
      }
    } catch (error) {
      console.error("Error updating application status:", error)
      toast.error("Failed to update application status")
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
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-medium text-gray-700">No applications yet</h3>
        <p className="text-gray-500 mt-2">There are no applications for this job posting yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Applications for {jobDetails?.title || "Job"}</h2>
      </div>

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
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Resume
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-600">{format(new Date(application.appliedDate), "MMM dd, yyyy")}</td>
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
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
    </div>
  )
}

export default JobApplications

