"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { HiArrowNarrowLeft  } from "react-icons/hi"

function CompanyProfilePage() {
  const { companyId } = useParams()
  const [company, setCompany] = useState(null)
  const [companyJobs, setCompanyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile/company/${companyId}`)
        setCompany(response.data.company)

        // Fetch jobs by this company
        const jobsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/company/${companyId}`)
        setCompanyJobs(jobsResponse.data.jobs)
      } catch (error) {
        console.error("Error fetching company profile:", error)
        toast.error("Failed to load company profile")
      } finally {
        setLoading(false)
      }
    }

    if (companyId) {
      fetchCompanyProfile()
    }
  }, [companyId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-700">Company not found</h3>
        <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
          Browse Jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Company Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-white flex items-center justify-center">
              <img
                src={company.companyLogo || "https://via.placeholder.com/150?text=Company"}
                alt={company.companyName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{company.companyName}</h1>
              <p className="mt-2">{company.additionalDetails?.industry || "Industry not specified"}</p>
              <div className="flex items-center gap-4 mt-2">
                <span>{company.additionalDetails?.location || "Location not specified"}</span>
                {company.additionalDetails?.companySize && (
                  <span>• {company.additionalDetails.companySize} employees</span>
                )}
                {company.additionalDetails?.foundedYear && (
                  <span>• Founded {company.additionalDetails.foundedYear}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="p-6">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About the Company</h2>
            <p className="text-gray-600">
              {company.additionalDetails?.companyDescription || "No company description available."}
            </p>
          </section>

          {company.additionalDetails?.website && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Website</h2>
              <a
                href={company.additionalDetails.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.additionalDetails.website}
              </a>
            </section>
          )}

          {/* Company Jobs */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Open Positions</h2>
            {companyJobs.length === 0 ? (
              <p className="text-gray-600">No open positions at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyJobs.map((job) => (
                  <div
                    key={job._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium text-lg text-gray-800">{job.title}</h3>
                    <p className="text-gray-600 mt-1">{job.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {job.jobType}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : job.status === "Deadline Ended"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <HiArrowNarrowLeft  size={16} />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfilePage
