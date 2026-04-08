import api from "./api"

// Get all jobs
export const getAllJobs = async () => {
  const res = await api.get("/jobs/all")
  return res.data
}

// Get job by ID
export const getJobById = async (jobId) => {
  const res = await api.get(`/jobs/${jobId}`)
  return res.data
}

// Get jobs posted by recruiter
export const getRecruiterJobs = async () => {
  const res = await api.get("/jobs/recruiter/jobs")
  return res.data
}

// Create a new job
export const createJob = async (jobData) => {
  const res = await api.post("/jobs/create", jobData)
  return res.data
}

// Update a job
export const updateJob = async (jobId, jobData) => {
  const res = await api.put(`/jobs/edit/${jobId}`, jobData)
  return res.data
}

// Close a job
export const closeJob = async (jobId) => {
  const res = await api.put(`/jobs/${jobId}/close`, {})
  return res.data
}

//reopenJob
export const reopenJob = async (jobId) => {
  const res = await api.put(`/jobs/${jobId}/reopen`, {})
  return res.data
}

// Delete a job
export const deleteJob = async (jobId) => {
  const res = await api.delete(`/jobs/delete/${jobId}`)
  return res.data
}
