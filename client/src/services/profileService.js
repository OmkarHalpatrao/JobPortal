import api from "./api"

// Get user profile
export const getProfile = async () => {
  const response = await api.get("/profile")
  return response.data
}

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await api.put("/profile", profileData)
  return response.data
}

// Upload profile photo
export const uploadProfilePhoto = async (formData) => {
  const response = await api.post("/profile/upload-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

// Upload company logo
export const uploadCompanyLogo = async (formData) => {
  const response = await api.post("/profile/upload-logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

