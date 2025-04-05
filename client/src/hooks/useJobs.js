import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  createJob,
  updateJob,
  closeJob,
  deleteJob,
} from "../services/jobService"
import { toast } from "react-hot-toast"

// Hook for fetching all jobs
export const useAllJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getAllJobs,
    onError: (error) => {
      console.error("Error fetching jobs:", error)
      toast.error("Failed to fetch jobs. Please try again later.")
    },
  })
}

// Hook for fetching a single job
export const useJob = (jobId) => {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
    enabled: !!jobId,
    onError: (error) => {
      console.error(`Error fetching job ${jobId}:`, error)
      toast.error("Failed to fetch job details. Please try again later.")
    },
  })
}

// Hook for fetching recruiter jobs
export const useRecruiterJobs = () => {
  return useQuery({
    queryKey: ["recruiterJobs"],
    queryFn: getRecruiterJobs,
    onError: (error) => {
      console.error("Error fetching recruiter jobs:", error)
      toast.error("Failed to fetch your posted jobs. Please try again later.")
    },
  })
}

// Hook for creating a job
export const useCreateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiterJobs"] })
      toast.success("Job created successfully")
    },
    onError: (error) => {
      console.error("Error creating job:", error)
      toast.error(error.response?.data?.message || "Failed to create job")
    },
  })
}

// Hook for updating a job
export const useUpdateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ jobId, jobData }) => updateJob(jobId, jobData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] })
      queryClient.invalidateQueries({ queryKey: ["recruiterJobs"] })
      toast.success("Job updated successfully")
    },
    onError: (error) => {
      console.error("Error updating job:", error)
      toast.error(error.response?.data?.message || "Failed to update job")
    },
  })
}

// Hook for closing a job
export const useCloseJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: closeJob,
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] })
      queryClient.invalidateQueries({ queryKey: ["recruiterJobs"] })
      toast.success("Job closed successfully")
    },
    onError: (error) => {
      console.error("Error closing job:", error)
      toast.error(error.response?.data?.message || "Failed to close job")
    },
  })
}

// Hook for deleting a job
export const useDeleteJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiterJobs"] })
      toast.success("Job deleted successfully")
    },
    onError: (error) => {
      console.error("Error deleting job:", error)
      toast.error(error.response?.data?.message || "Failed to delete job")
    },
  })
}

