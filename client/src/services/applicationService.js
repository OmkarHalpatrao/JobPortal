import api from "./api"

// Apply for a job
export const applyForJob = async (jobId, formData) => {
  const response = await api.post(`/applications/job/${jobId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

// Get applications for a job (recruiter only)
export const getJobApplications = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`)
  return response.data
}

// Get user applications (job seeker only)
export const getUserApplications = async () => {
  console.log("Fetching user applications from API")
  const response = await api.get("/applications/user")
  console.log("User applications response:", response.data)
  return response.data
}

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.put(`/applications/${applicationId}`, { status })
  return response.data
}

