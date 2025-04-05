import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  applyForJob,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus,
} from "../services/applicationService"
import { toast } from "react-hot-toast"

// Hook for fetching user applications
export const useUserApplications = () => {
  return useQuery({
    queryKey: ["userApplications"],
    queryFn: getUserApplications,
    onError: (error) => {
      console.error("Error fetching user applications:", error)
      toast.error("Failed to fetch your applications. Please try again later.")
    },
  })
}

// Hook for fetching job applications (for recruiters)
export const useJobApplications = (jobId) => {
  return useQuery({
    queryKey: ["jobApplications", jobId],
    queryFn: () => getJobApplications(jobId),
    enabled: !!jobId,
    onError: (error) => {
      console.error(`Error fetching applications for job ${jobId}:`, error)
      toast.error("Failed to fetch applications. Please try again later.")
    },
  })
}

// Hook for applying to a job
export const useApplyForJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ jobId, formData }) => applyForJob(jobId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userApplications"] })
      toast.success("Application submitted successfully")
    },
    onError: (error) => {
      console.error("Error applying for job:", error)
      toast.error(error.response?.data?.message || "Failed to submit application")
    },
  })
}

// Hook for updating application status
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicationId, status }) => updateApplicationStatus(applicationId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] })
      toast.success(`Application status updated to ${variables.status}`)
    },
    onError: (error) => {
      console.error("Error updating application status:", error)
      toast.error(error.response?.data?.message || "Failed to update application status")
    },
  })
}

