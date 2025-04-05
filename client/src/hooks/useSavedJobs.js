"use client"

import { useState, useEffect } from "react"

// Custom hook for managing saved jobs
export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Load saved jobs from localStorage
  useEffect(() => {
    const loadSavedJobs = () => {
      try {
        const savedJobsData = JSON.parse(localStorage.getItem("savedJobs") || "[]")
        setSavedJobs(savedJobsData)
      } catch (error) {
        console.error("Error loading saved jobs:", error)
        setSavedJobs([])
      } finally {
        setLoading(false)
      }
    }

    loadSavedJobs()
  }, [])

  // Check if a job is saved
  const isJobSaved = (jobId) => {
    return savedJobs.some((job) => job._id === jobId)
  }

  // Save a job
  const saveJob = (job) => {
    const updatedSavedJobs = [...savedJobs, job]
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
    setSavedJobs(updatedSavedJobs)
  }

  // Unsave a job
  const unsaveJob = (jobId) => {
    const updatedSavedJobs = savedJobs.filter((job) => job._id !== jobId)
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
    setSavedJobs(updatedSavedJobs)
  }

  // Toggle save/unsave
  const toggleSaveJob = (job) => {
    if (isJobSaved(job._id)) {
      unsaveJob(job._id)
      return false // Job is now unsaved
    } else {
      saveJob(job)
      return true // Job is now saved
    }
  }

  return {
    savedJobs,
    loading,
    isJobSaved,
    saveJob,
    unsaveJob,
    toggleSaveJob,
  }
}

