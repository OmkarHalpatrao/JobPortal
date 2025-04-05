import axios from "axios"

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally here
    console.error("API Error:", error)
    return Promise.reject(error)
  },
)

export default api

