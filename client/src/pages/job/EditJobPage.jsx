"use client"
import EditJobForm from "../../components/job/EditJobForm"
import { useAuth } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"

function EditJobPage() {
  const { isAuthenticated, user } = useAuth()

  // Redirect if not authenticated or not a recruiter
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (user.accountType !== "Recruiter") {
    return <Navigate to="/dashboard/jobseeker" />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <EditJobForm />
    </div>
  )
}

export default EditJobPage
