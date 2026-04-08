import { Link, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { useAuth } from "../../context/AuthContext"
import { useUserApplications } from "../../hooks/useApplications"
import { 
  HiOutlineBriefcase, 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineSearch,
  HiOutlineArrowLeft,
  HiOutlineChevronRight,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineCalendar
} from "react-icons/hi"

function JobSeekerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: applicationsData, isLoading: applicationsLoading } = useUserApplications()
  const applications = applicationsData?.applications || []

  if (applicationsLoading) return <DashboardSkeleton />

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 animate-in fade-in duration-700">
      
      {/* ── Top Navigation ── */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/jobs")}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <HiOutlineArrowLeft className="w-5 h-5" />
          </div>
          Back to Search
        </button>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 font-medium">Welcome back, {user.firstName}.</p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total" value={applications.length} icon={HiOutlineBriefcase} color="indigo" />
        <StatCard 
          label="Shortlisted" 
          value={applications.filter(app => ["Shortlisted", "Hired"].includes(app.status)).length} 
          icon={HiOutlineCheckCircle} 
          color="indigo" 
        />
        <StatCard 
          label="Pending" 
          value={applications.filter(app => ["Pending", "Reviewing"].includes(app.status)).length} 
          icon={HiOutlineClock} 
          color="indigo" 
        />
      </div>

      {/* ── Applications Container ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
          <Link to="/jobs" className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-xl transition-colors md:hidden">
            <HiOutlineSearch className="w-6 h-6" />
          </Link>
          <Link
            to="/jobs"
            className="hidden md:flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            <HiOutlineSearch className="w-4 h-4" />
            Find More Jobs
          </Link>
        </div>

        {applications.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {/* ── Desktop View (Table) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Applied</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map((app) => (
                    <tr key={app._id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <Link to={`/jobs/${app.job._id}`} className="font-bold text-gray-900 block mb-1">{app.job.title}</Link>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <HiOutlineOfficeBuilding className="w-3.5 h-3.5" />
                          {app.job.company}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                        {format(new Date(app.appliedDate), "MMM dd, yyyy")}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusStyles(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link to={`/jobs/${app.job._id}`} className="p-2 text-gray-400 hover:text-indigo-600 inline-block transition-colors">
                          <HiOutlineChevronRight className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile View (Cards - No Horizontal Scroll) ── */}
            <div className="md:hidden divide-y divide-gray-100">
              {applications.map((app) => (
                <div key={app._id} className="p-5 active:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="max-w-[70%]">
                      <Link to={`/jobs/${app.job._id}`} className="font-bold text-gray-900 block truncate">
                        {app.job.title}
                      </Link>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <HiOutlineOfficeBuilding className="w-3.5 h-3.5" />
                        {app.job.company}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border ${getStatusStyles(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                      <span className="flex items-center gap-1">
                        <HiOutlineCalendar className="w-3.5 h-3.5" />
                        {format(new Date(app.appliedDate), "MMM dd")}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                        {app.job.location}
                      </span>
                    </div>
                    <Link to={`/jobs/${app.job._id}`} className="text-indigo-600 font-bold text-xs flex items-center gap-0.5">
                      Details
                      <HiOutlineChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── UI Components ──

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-gray-900">{value}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</div>
        </div>
      </div>
    </div>
  )
}

function getStatusStyles(status) {
  const map = {
    Pending: "bg-blue-50 text-blue-600 border-blue-100",
    Reviewing: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Shortlisted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Rejected: "bg-gray-50 text-gray-400 border-gray-100",
    Hired: "bg-indigo-600 text-white border-indigo-600",
  }
  return map[status] || "bg-gray-50 text-gray-500 border-gray-100"
}

function EmptyState() {
  return (
    <div className="py-20 text-center px-6">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <HiOutlineBriefcase className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">No applications yet</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-[240px] mx-auto">Start applying to jobs to track your progress here.</p>
      <Link to="/jobs" className="mt-6 inline-block text-sm font-bold text-indigo-600 hover:underline">
        Explore open roles →
      </Link>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 w-40 bg-gray-200 rounded-lg mb-8" />
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="h-24 bg-gray-100 rounded-2xl" />
        <div className="h-24 bg-gray-100 rounded-2xl" />
        <div className="h-24 bg-gray-100 rounded-2xl" />
      </div>
      <div className="h-96 bg-gray-50 rounded-3xl" />
    </div>
  )
}

export default JobSeekerDashboard