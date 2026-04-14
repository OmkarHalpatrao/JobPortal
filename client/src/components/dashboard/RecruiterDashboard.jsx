import { Link, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { useAuth } from "../../context/AuthContext"
import { useRecruiterJobs, useCloseJob, useDeleteJob } from "../../hooks/useJobs"
import { 
  HiOutlinePlus, 
  HiOutlineUsers, 
  HiOutlineLocationMarker, 
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineLockClosed,
  HiOutlineArrowLeft,
  HiOutlineChevronRight
} from "react-icons/hi"

function RecruiterDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: jobsData, isLoading: jobsLoading,isError } = useRecruiterJobs()
  const closeJobMutation = useCloseJob()
  const deleteJobMutation = useDeleteJob()
  
  const jobs = jobsData?.jobs || []
  
  const handleCloseJob = async (jobId) => {
    if (!confirm("Close this job? It will no longer accept applications.")) return
    closeJobMutation.mutate(jobId)
  }
  
  const handleDeleteJob = async (jobId) => {
    if (!confirm("Delete this job permanently? This cannot be undone.")) return
    deleteJobMutation.mutate(jobId)
  }
  
  if (jobsLoading) return <LoadingSkeleton />
  if (isError) return <div className="text-center py-20 text-red-500 font-bold">Failed to load dashboard data.</div>

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 animate-in fade-in duration-700">
      
     

      {/* ── Header Section ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Recruiter Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">
            Managing positions for <span className="text-indigo-600 font-bold">{user.companyName}</span>
          </p>
        </div>
        <Link
          to="/jobs/create"
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      {/* ── Main Content ── */}
      {jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${
                    job.isClosed ? "bg-gray-50 text-gray-400 border-gray-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                  }`}>
                    {job.isClosed ? "Closed" : "Active"}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400 font-bold">
                    <HiOutlineUsers className="w-4 h-4" />
                    <span className="text-xs">{job.applications?.length || 0}</span>
                  </div>
                </div>

                <Link to={`/jobs/${job._id}`} className="block mb-4">
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {job.title}
                  </h3>
                </Link>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <HiOutlineLocationMarker className="text-indigo-400 w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    <HiOutlineCalendar className="w-4 h-4" />
                    {format(new Date(job.postedDate), "MMM dd, yyyy")}
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-2 text-[11px] text-indigo-400 font-bold uppercase tracking-wider">
                      <HiOutlineClock className="w-4 h-4" />
                      Expires {format(new Date(job.deadline), "MMM dd")}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Action Bar (Responsive Design) ── */}
              <div className="pt-6 border-t border-gray-50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/dashboard/applications?jobId=${job._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white text-xs font-extrabold uppercase tracking-tighter rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    View Applicants
                    <HiOutlineChevronRight className="w-4 h-4" />
                  </Link>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    {!job.isClosed && (
                      <button
                        onClick={() => handleCloseJob(job._id)}
                        disabled={closeJobMutation.isPending}
                        className="flex-1 sm:flex-none p-3 text-gray-400 bg-gray-50 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all border border-transparent hover:border-amber-100"
                        title="Close Listing"
                      >
                        <HiOutlineLockClosed className="w-5 h-5 mx-auto" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      disabled={deleteJobMutation.isPending}
                      className="flex-1 sm:flex-none p-3 text-gray-400 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                      title="Delete Listing"
                    >
                      <HiOutlineTrash className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sub-components ──

function EmptyState() {
  return (
    <div className="py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm text-center px-6">
      <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <HiOutlinePlus className="w-10 h-10 text-indigo-300" />
      </div>
      <h3 className="text-xl font-black text-gray-900">No active postings</h3>
      <p className="text-gray-500 mt-2 max-w-xs mx-auto font-medium">
        You haven't posted any job openings yet. Start hiring by creating your first listing.
      </p>
      <Link
        to="/jobs/create"
        className="mt-8 inline-flex px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
      >
        Post Your First Job
      </Link>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 w-48 bg-gray-100 rounded-xl mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-80 bg-gray-50 rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  )
}

export default RecruiterDashboard