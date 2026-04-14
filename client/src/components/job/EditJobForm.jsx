import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { HiArrowNarrowLeft } from "react-icons/hi"

function EditJobForm() {
  const { jobId } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    responsibilities: "",
    skills: "",
    deadline: "",
  })

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setFetchLoading(true)
        console.log(`Fetching job details for job ID: ${jobId}`)
        const response = await api.get(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const job = response.data.job
        console.log("Fetched job details:", job)

        // Check if the logged-in user is the recruiter who posted this job
        if (job.recruiter._id !== user._id) {
          toast.error("You are not authorized to edit this job")
          navigate("/dashboard/recruiter")
          return
        }

        // Format requirements, responsibilities, and skills arrays back to comma-separated strings
        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          jobType: job.jobType || "Full-time",
          salary: job.salary || "",
          description: job.description || "",
          requirements: job.requirements ? job.requirements.join(", ") : "",
          responsibilities: job.responsibilities ? job.responsibilities.join(", ") : "",
          skills: job.skills ? job.skills.join(", ") : "",
          deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
        })
      } catch (error) {
        console.error("Error fetching job details:", error)
        toast.error("Failed to fetch job details")
        navigate("/dashboard/recruiter")
      } finally {
        setFetchLoading(false)
      }
    }

    if (jobId && token) {
      fetchJobDetails()
    }
  }, [jobId, token, user._id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Convert comma-separated strings to arrays
    const jobData = {
      ...formData,
      requirements: formData.requirements
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
      responsibilities: formData.responsibilities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
      skills: formData.skills
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    }

    setLoading(true)

    try {
      console.log(`Updating job ${jobId} with data:`, jobData)
      const response = await api.put(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        toast.success("Job updated successfully")
        navigate(`/jobs/${jobId}`)
      }
    } catch (error) {
      console.error("Error updating job:", error)
      toast.error(error.response?.data?.message || "Failed to update job")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-blue-600">
        <h2 className="text-xl font-bold text-white">Edit Job</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Salary (Optional)
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. $50,000 - $70,000"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Application Deadline (Optional)
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="mt-6">
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
            Requirements (Comma separated)
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={3}
            placeholder="Bachelor's degree in Computer Science, 3+ years of experience, etc."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="mt-6">
          <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">
            Responsibilities (Comma separated)
          </label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            rows={3}
            placeholder="Develop and maintain web applications, Collaborate with team members, etc."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="mt-6">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Required Skills (Comma separated)
          </label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows={2}
            placeholder="JavaScript, React, Node.js, etc."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/jobs/${jobId}`)}
            className="flex items-center gap-2 mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <HiArrowNarrowLeft className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Job"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditJobForm
