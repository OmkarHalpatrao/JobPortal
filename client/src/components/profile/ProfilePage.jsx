"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import JobSeekerProfile from "./JobSeekerProfile"
import RecruiterProfile from "./RecruiterProfile"

function ProfilePage() {
  const { user, token, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success) {
          setProfileData(response.data.profile)
        } else {
          toast.error("Failed to load profile data")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [isAuthenticated, token, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {user.accountType === "JobSeeker" ? (
        <JobSeekerProfile user={user} profileData={profileData} />
      ) : (
        <RecruiterProfile user={user} profileData={profileData} />
      )}
    </div>
  )
}

export default ProfilePage

