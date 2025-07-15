import api from "./api"

// Get all jobs with better error handling
export const getAllJobs = async () => {
  console.log("getAllJobs called")
  try {
    const response = await api.get("/jobs/all")
    return response.data
  } catch (error) {
    console.error("Error in getAllJobs:", error)
    throw error
  }
}

// Get job by ID
export const getJobById = async (jobId) => {
  console.log("getJobById called", { jobId })
  try {
    const response = await api.get(`/jobs/${jobId}`)
    return response.data
  } catch (error) {
    console.error("Error in getJobById:", error)
    throw error
  }
}

// Get jobs posted by recruiter
export const getRecruiterJobs = async () => {
  console.log("getRecruiterJobs called")
  try {
    const response = await api.get("/jobs/recruiter/jobs")
    return response.data
  } catch (error) {
    console.error("Error in getRecruiterJobs:", error)
    throw error
  }
}

// Create a new job
export const createJob = async (jobData) => {
  console.log("createJob called", { jobData })
  try {
    const response = await api.post("/jobs/create", jobData)
    return response.data
  } catch (error) {
    console.error("Error in createJob:", error)
    throw error
  }
}

// Update a job
export const updateJob = async (jobId, jobData) => {
  console.log("updateJob called", { jobId, jobData })
  try {
    const response = await api.put(`/jobs/edit/${jobId}`, jobData)
    return response.data
  } catch (error) {
    console.error("Error in updateJob:", error)
    throw error
  }
}

// Close a job
export const closeJob = async (jobId) => {
  console.log("closeJob called", { jobId })
  try {
    const response = await api.put(`/jobs/${jobId}/close`, {})
    return response.data
  } catch (error) {
    console.error("Error in closeJob:", error)
    throw error
  }
}

// Delete a job
export const deleteJob = async (jobId) => {
  console.log("deleteJob called", { jobId })
  try {
    const response = await api.delete(`/jobs/delete/${jobId}`)
    return response.data
  } catch (error) {
    console.error("Error in deleteJob:", error)
    throw error
  }
}
