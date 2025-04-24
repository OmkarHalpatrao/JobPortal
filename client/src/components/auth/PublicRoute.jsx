"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If user is authenticated, redirect based on user type
  if (isAuthenticated) {
    if (user.accountType === "JobSeeker") {
      return <Navigate to="/dashboard/jobseeker" />
    } else {
      return <Navigate to="/dashboard/recruiter" />
    }
  }

  // If not authenticated, show the requested page
  return children
}

export default PublicRoute
