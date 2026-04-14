"use client"

import { createContext, useState, useContext, useEffect } from "react"
import api, { setAccessToken } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
      // Proactively refresh token to secure the session in memory
      api.post('/auth/refresh').then(res => {
        setToken(res.data.accessToken);
        setAccessToken(res.data.accessToken);
      }).catch(err => {
        // Refresh token invalid or missing, clear the unauthenticated user
        setUser(null)
        setToken(null)
        setAccessToken(null)
        localStorage.removeItem("user")
      }).finally(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }

    const handleForceLogout = () => {
      setUser(null)
      setToken(null)
      setAccessToken(null)
      localStorage.removeItem("user")
    };
    
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, [])

  // Login function
  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    setAccessToken(authToken)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error("Logout request failed or ignored:", e);
    }
    setUser(null)
    setToken(null)
    setAccessToken(null)
    localStorage.removeItem("user")
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


