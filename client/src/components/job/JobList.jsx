import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import JobCard from "./JobCard"
import { useAllJobs } from "../../hooks/useJobs"
import { useUserApplications } from "../../hooks/useApplications"
import { useSavedJobs } from "../../hooks/useSavedJobs"

function JobList() {
  const [filteredJobs, setFilteredJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    salary: "",
  })

  const { user, isAuthenticated } = useAuth()

  // Fetch jobs using React Query
  const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useAllJobs()

  // Fetch user applications if user is a job seeker
  const { data: applicationsData, isLoading: applicationsLoading } = useUserApplications({
    enabled: isAuthenticated && user?.accountType === "JobSeeker",
  })

  // Get saved jobs
  const { isJobSaved } = useSavedJobs()

  // Extract jobs array from the response
  const jobs = jobsData?.jobs || []

  // Extract applied job IDs
  const appliedJobs = applicationsData?.applications?.map((app) => app.job._id) || []

  // Filter jobs based on search term and filters
  useEffect(() => {
    let result = jobs

    // Filter by search term (title, company, or skills)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.skills.some((skill) => skill.toLowerCase().includes(term)),
      )
    }

    // Apply additional filters
    if (filters.jobType) {
      result = result.filter((job) => job.jobType === filters.jobType)
    }

    if (filters.location) {
      result = result.filter((job) => job.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    if (filters.salary) {
      result = result.filter((job) => job.salary && job.salary.includes(filters.salary))
    }

    setFilteredJobs(result)
  }, [searchTerm, filters, jobs])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      jobType: "",
      location: "",
      salary: "",
    })
  }

  // Show error if jobs fetch failed
  if (jobsError) {
    toast.error("Failed to fetch jobs. Please try again later.")
  }

  if (jobsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Dream Job</h2>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by job title, company, or skills..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="salary"
              placeholder="Salary"
              value={filters.salary}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button onClick={clearFilters} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
          </h3>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-700">No jobs found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isApplied={appliedJobs.includes(job._id)}
                isSaved={isJobSaved(job._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobList

