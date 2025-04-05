"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
      // Set default axios auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`
    }

    setLoading(false)
  }, [])

  // Login function
  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
    // Set default axios auth header
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`
  }

  // Logout function - MODIFIED to preserve saved jobs
  const logout = () => {
    // We don't remove savedJobs from localStorage anymore
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    // Remove axios auth header
    delete axios.defaults.headers.common["Authorization"]
  }

  // Update user function
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem("user", JSON.stringify(updatedUserData))
  }

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token

  // Auth context value
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

