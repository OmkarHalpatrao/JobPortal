import api from "./api"

// Apply for a job
export const applyForJob = async (jobId, formData) => {
  try {
    console.log(`Applying for job ${jobId}`)
    const response = await api.post(`/applications/apply/${jobId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    console.log("Apply for job response:", response.data)
    return response.data
  } catch (error) {
    console.error(`Error applying for job ${jobId}:`, error)
    throw error
  }
}

// Get applications for a job (recruiter only)
export const getJobApplications = async (jobId) => {
  try {
    console.log(`Fetching applications for job ${jobId}`)
    const response = await api.get(`/applications/applicants/${jobId}`)
    console.log("Job applications response:", response.data)
    return response.data
  } catch (error) {
    console.error(`Error fetching applications for job ${jobId}:`, error)
    throw error
  }
}

// Get user applications (job seeker only)
export const getUserApplications = async () => {
  try {
    console.log("Fetching user applications")
    const response = await api.get("/applications/user")
    console.log("User applications response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching user applications:", error)
    throw error
  }
}

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    console.log(`Updating application ${applicationId} status to ${status}`)
    const response = await api.put(`/applications/${applicationId}`, { status })
    console.log("Update application status response:", response.data)
    return response.data
  } catch (error) {
    console.error(`Error updating application ${applicationId} status:`, error)
    throw error
  }
}

