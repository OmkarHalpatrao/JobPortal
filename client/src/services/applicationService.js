import api from "./api"

// Apply for a job
export const applyForJob = async (jobId, formData) => {
  console.log("applyForJob called", { jobId, formData })
  try {
    const response = await api.post(`/applications/apply/${jobId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error in applyForJob:", error)
    throw error
  }
}

// Get applications for a job (recruiter only)
export const getJobApplications = async (jobId) => {
  console.log("getJobApplications called", { jobId })
  try {
    const response = await api.get(`/applications/applicants/${jobId}`)
    return response.data
  } catch (error) {
    console.error("Error in getJobApplications:", error)
    throw error
  }
}

// Get user applications (job seeker only)
export const getUserApplications = async () => {
  console.log("getUserApplications called")
  try {
    const response = await api.get("/applications/user")
    return response.data
  } catch (error) {
    console.error("Error in getUserApplications:", error)
    throw error
  }
}

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  console.log("updateApplicationStatus called", { applicationId, status })
  try {
    const response = await api.put(`/applications/${applicationId}`, { status })
    return response.data
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error)
    throw error
  }
}

