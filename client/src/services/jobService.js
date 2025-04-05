import api from "./api"

// Get all jobs
export const getAllJobs = async () => {
  console.log("Fetching all jobs from API")
  const response = await api.get("/jobs/all")
  console.log("All jobs response:", response.data)
  return response.data
}

// Get job by ID
export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`)
  return response.data
}

// Get jobs posted by recruiter
export const getRecruiterJobs = async () => {
  const response = await api.get("/jobs/recruiter/jobs")
  return response.data
}

// Create a new job
export const createJob = async (jobData) => {
  const response = await api.post("/jobs/create", jobData)
  return response.data
}

// Update a job
export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/jobs/${jobId}`, jobData)
  return response.data
}

// Close a job
export const closeJob = async (jobId) => {
  const response = await api.put(`/jobs/${jobId}/close`, {})
  return response.data
}

// Delete a job
export const deleteJob = async (jobId) => {
  const response = await api.delete(`/jobs/${jobId}`)
  return response.data
}

