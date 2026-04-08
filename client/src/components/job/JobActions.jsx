import { useState } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { JobStorageService } from "../../utils/jobStorage"
import { applyForJob as apiApplyForJob } from "../../services/applicationService"
import { closeJob as apiCloseJob } from "../../services/jobService"

function JobActions({ job, user, applicationState, uiState }) {
  const { isAuthenticated, token } = useAuth()
  const [applyLoading, setApplyLoading] = useState(false)
  const { hasApplied, resumeFile, coverLetter } = applicationState
  const { reopenModalOpen, newDeadline } = uiState

  const isSaved = JobStorageService.isJobSaved(job._id)

  const toggleSaveJob = () => {
    if (!isAuthenticated || user?.accountType !== "JobSeeker") return
    if (isSaved) {
      JobStorageService.unsaveJob(job._id)
      toast.success("Job removed from saved jobs")
    } else {
      JobStorageService.saveJob(job)
      toast.success("Job saved successfully")
    }
  }

  const handleApplyJob = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job")
      return
    }
    if (user?.accountType !== "JobSeeker") {
      toast.error("Only job seekers can apply for jobs")
      return
    }
    try {
      setApplyLoading(true)
      const formData = new FormData()
      if (!resumeFile) {
        toast.error("Please upload your resume")
        return
      }
      formData.append("resume", resumeFile)
      formData.append("coverLetter", coverLetter || "")
      await apiApplyForJob(job._id, formData)
      toast.success("Application submitted successfully")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit application")
    } finally {
      setApplyLoading(false)
    }
  }

  const handleCloseJob = async () => {
    if (!isAuthenticated || user?.accountType !== "Recruiter") return
    try {
      await apiCloseJob(job._id)
      toast.success("Job closed successfully")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to close job")
    }
  }

  return (
    <div className="p-4 sm:p-6 border-t border-gray-200">
      <div className="flex items-center justify-between">
        {isAuthenticated && user?.accountType === "JobSeeker" && (
          <div className="flex gap-2">
            <button
              onClick={toggleSaveJob}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                isSaved ? "bg-yellow-50 text-yellow-600" : "bg-gray-50 text-gray-600"
              }`}
              aria-pressed={isSaved}
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? "Saved" : "Save Job"}
            </button>
          </div>
        )}

        {user?.accountType === "Recruiter" && job.recruiter?._id === user._id && (
          <div className="flex gap-2">
            {job.status !== "Closed" && (
              <button onClick={handleCloseJob} className="px-3 py-1 text-sm font-medium rounded-md bg-red-50 text-red-600">
                Close Job
              </button>
            )}
          </div>
        )}
      </div>

      {user?.accountType === "JobSeeker" && !hasApplied && job.status === "Active" && (
        <form onSubmit={handleApplyJob} className="mt-6 space-y-4" aria-label="Apply for this job">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF)</label>
            <input type="file" accept=".pdf" aria-required onChange={() => {}} className="block w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
            <textarea rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
          <button type="submit" disabled={applyLoading} className="w-full py-2 px-4 rounded-md text-sm text-white bg-blue-600">
            {applyLoading ? "Submitting..." : "Apply Now"}
          </button>
        </form>
      )}
    </div>
  )
}

export default JobActions


