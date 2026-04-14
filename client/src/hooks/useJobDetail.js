import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getJobById, closeJob, reopenJob, deleteJob,updateJob } from "../services/jobService"
import { getUserApplications } from "../services/applicationService"

export const useJobDetail = () => {
  const { jobId } = useParams()
  const { user, isAuthenticated, token } = useAuth()

  // Job data
  const [jobState, setJobState] = useState({ job: null, loading: true, error: null })

  // Application state (for job seekers)
  const [applicationState, setApplicationState] = useState({
    hasApplied: false,
    loading: false,
    resumeFile: null,
    coverLetter: "",
  })

  // UI state (for saved jobs / reopen modal)
  const [uiState, setUIState] = useState({
    isSaved: false,
    reopenModalOpen: false,
    newDeadline: "",
  })

  // --- Fetch job details ---
  const fetchJobDetails = useCallback(async (signal) => {
  try {
    const data = await getJobById(jobId, signal);
    if (!signal || !signal.aborted) setJobState({ job: data.job, loading: false, error: null });
  } catch (e) {
    if (e.name !== 'AbortError') setJobState({ job: null, loading: false, error: e.message });
  }
}, [jobId]);

useEffect(() => {
  const controller = new AbortController();
  fetchJobDetails(controller.signal);
  return () => controller.abort();
}, [fetchJobDetails]);

  // --- Check if user has applied ---
  const checkApplicationStatus = useCallback(async () => {
    if (!isAuthenticated || user?.accountType !== "JobSeeker") return
    try {
      setApplicationState((prev) => ({ ...prev, loading: true }))
      const data = await getUserApplications(token)
      const applications = data.applications || []
      const hasApplied = applications.some((app) => app.job?._id === jobId)
      setApplicationState((prev) => ({ ...prev, hasApplied, loading: false }))
    } catch {
      setApplicationState((prev) => ({ ...prev, loading: false }))
    }
  }, [isAuthenticated, user?.accountType, jobId, token])

  // --- Close job (Recruiter) ---
  const handleCloseJob = async () => {
    if (!isAuthenticated || user?.accountType !== "Recruiter" || !jobState.job) return
    try {
      await closeJob(jobId, token)
      setJobState((prev) => ({
        ...prev,
        job: { ...prev.job, status: "Closed", isActive: false, isClosed: true },
      }))
    } catch (error) {
      console.error("Failed to close job:", error)
    }
  }

  // --- Reopen job (Recruiter) ---
  const handleReopenJob = async (newDeadline) => {
    if (!isAuthenticated || user?.accountType !== "Recruiter" || !jobState.job) return
    try {
      await reopenJob(jobId, newDeadline, token)
      setJobState((prev) => ({
        ...prev,
        job: { ...prev.job, status: "Reopened", isActive: true, isClosed: false, deadline: newDeadline },
      }))
      setUIState((prev) => ({ ...prev, reopenModalOpen: false, newDeadline: "" }))
    } catch (error) {
      console.error("Failed to reopen job:", error)
    }
  }

  // --- Delete job (Recruiter) ---
  const handleDeleteJob = async () => {
    if (!isAuthenticated || user?.accountType !== "Recruiter") return
    try {
      await deleteJob(jobId, token)
      return true // caller can navigate away
    } catch (error) {
      console.error("Failed to delete job:", error)
      return false
    }
  }

  // --- Toggle save job (Job Seeker) ---
  const toggleSaveJob = () => {
    if (!isAuthenticated || user?.accountType !== "JobSeeker" || !jobState.job) return
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")
    if (uiState.isSaved) {
      const updated = savedJobs.filter((saved) => saved._id !== jobState.job._id)
      localStorage.setItem("savedJobs", JSON.stringify(updated))
      setUIState((prev) => ({ ...prev, isSaved: false }))
    } else {
      savedJobs.push(jobState.job)
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs))
      setUIState((prev) => ({ ...prev, isSaved: true }))
    }
  }

  // --- Edit job (Recruiter) ---
  const handleEditJob = async (updatedData) => {
    if (!isAuthenticated || user?.accountType !== "Recruiter" || !jobState.job) return
    try {
      const payload = { ...updatedData }
      if (typeof payload.requirements === 'string') {
        payload.requirements = payload.requirements.split('\n').map(s => s.trim()).filter(Boolean)
      }
      if (typeof payload.responsibilities === 'string') {
        payload.responsibilities = payload.responsibilities.split('\n').map(s => s.trim()).filter(Boolean)
      }
      
      await updateJob(jobState.job._id, payload, token)
      await fetchJobDetails() // refresh job data after editing
    } catch (error) {
      console.error("Failed to update job:", error)
    }
  }

  useEffect(() => {
    checkApplicationStatus()
  }, [checkApplicationStatus])

  return {
    jobState,
    applicationState,
    uiState,
    setApplicationState,
    setUIState,
    fetchJobDetails,
    handleCloseJob,
    handleReopenJob,
    handleDeleteJob,
    toggleSaveJob,
    handleEditJob
  }
}
