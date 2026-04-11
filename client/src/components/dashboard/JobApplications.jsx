import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { format } from "date-fns"
import { 
  HiArrowLeft, 
  HiOutlineExternalLink, 
  HiOutlineInbox, 
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineDownload, // New Icon
  HiOutlineCloudDownload // New Icon
} from "react-icons/hi"

// ── Helpers ──────────────────────────────────────────────────────────────────

const getEmbedSafeUrl = (url) => {
  if (!url) return null;
  const safeUrl = url.replace("http://", "https://");
  return `https://docs.google.com/viewer?url=${encodeURIComponent(safeUrl)}&embedded=true`;
};

const getDownloadUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", "/upload/fl_attachment/");
};

const getStatusStyles = (status) => {
  const map = {
    Pending: "bg-blue-50 text-blue-700 ring-blue-100",
    Reviewing: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    Shortlisted: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Rejected: "bg-rose-50 text-rose-700 ring-rose-100",
    Hired: "bg-gray-900 text-white ring-gray-900",
  };
  return map[status] || "bg-gray-50 text-gray-700 ring-gray-100";
};

// ── Component ────────────────────────────────────────────────────────────────

function JobApplications({ jobId, onBack }) {
  const { token } = useAuth()
  const [applications, setApplications] = useState([])
  const [jobDetails, setJobDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [iframeLoading, setIframeLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/applications/${jobId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setApplications(res.data.applications)
        if (res.data.applications.length > 0) {
          setJobDetails(res.data.applications[0]?.job)
        }
      } catch (error) {
        toast.error("Failed to load applicants")
      } finally {
        setLoading(false)
      }
    }
    if (jobId) fetchApplications()
  }, [jobId, token])

  useEffect(() => {
    document.body.style.overflow = previewUrl ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [previewUrl]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/applications/${applicationId}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data.success) {
        setApplications(prev => prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app))
        toast.success(`Candidate: ${newStatus}`)
      }
    } catch (error) {
      toast.error("Update failed")
    }
  }

  if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-indigo-600 font-bold uppercase tracking-widest text-xs">Syncing Data...</div>

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-indigo-50/50 overflow-hidden">
      
      {/* ── Header ── */}
      <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <HiArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{jobDetails?.title || "Job Details"}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{applications.length} Candidates</p>
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-4">
        {applications.length === 0 ? (
          <div className="py-24 text-center">
            <HiOutlineInbox className="w-12 h-12 text-indigo-100 mx-auto mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Candidates Found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                    <th className="px-8 py-4">Candidate</th>
                    <th className="px-8 py-4">Documents</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map((app) => (
                    <tr key={app._id} className="group hover:bg-indigo-50/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                            {app.applicant.firstName[0]}
                          </div>
                          <div>
                            <Link to={`/dashboard/applicantProfile/${app.applicant._id}`} className="font-bold text-gray-900 hover:text-indigo-600 block transition-colors leading-tight">
                              {app.applicant.firstName} {app.applicant.lastName}
                            </Link>
                            <span className="text-xs text-gray-400 font-medium">{app.applicant.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { setPreviewUrl(app.resume); setIframeLoading(true); }}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all"
                          >
                            <HiOutlineSearch className="w-4 h-4" /> Preview
                          </button>
                          {/* Force Download Link */}
                          <a 
                            href={getDownloadUrl(app.resume)} 
                            download 
                            className="p-1.5 text-gray-300 hover:text-emerald-600 transition-colors"
                            title="Download Resume"
                          >
                             <HiOutlineDownload className="w-5 h-5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-gray-500">
                        {format(new Date(app.appliedDate), "MMM dd")}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className={`text-[10px] font-black uppercase tracking-tight px-3 py-1.5 rounded-xl border-none ring-1 ring-inset cursor-pointer transition-all ${getStatusStyles(app.status)}`}
                        >
                          {["Pending", "Reviewing", "Shortlisted", "Rejected", "Hired"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {applications.map((app) => (
                <div key={app._id} className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {app.applicant.firstName[0]}
                      </div>
                      <div className="min-w-0">
                        <Link to={`/dashboard/applicantProfile/${app.applicant._id}`} className="font-bold text-gray-900 block truncate">
                          {app.applicant.firstName} {app.applicant.lastName}
                        </Link>
                        <p className="text-[10px] text-gray-400 font-medium truncate">{app.applicant.email}</p>
                      </div>
                    </div>
                    <a href={getDownloadUrl(app.resume)} download className="p-3 bg-white text-emerald-600 rounded-xl shadow-sm border border-gray-100">
                        <HiOutlineCloudDownload className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between border-y border-gray-100 py-4 mb-5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Applied</span>
                      <p className="text-xs font-bold text-gray-600">{format(new Date(app.appliedDate), "MMM dd")}</p>
                    </div>
                    <button 
                      onClick={() => { setPreviewUrl(app.resume); setIframeLoading(true); }}
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-600"
                    >
                      <HiOutlineSearch className="w-4 h-4" /> Preview
                    </button>
                  </div>

                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className={`w-full text-xs font-black uppercase py-3.5 px-4 rounded-2xl border-none ring-1 ring-inset ${getStatusStyles(app.status)}`}
                  >
                    {["Pending", "Reviewing", "Shortlisted", "Rejected", "Hired"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Preview Modal with Download Integration ── */}
      {previewUrl && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setPreviewUrl(null)}
        >
          <div 
            className="bg-white w-full max-w-6xl h-full rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <HiOutlineSearch className="w-5 h-5" />
                </div>
                <h3 className="font-black text-gray-900 uppercase tracking-tight text-xs">Document Preview</h3>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Download in Modal Header */}
                <a 
                  href={getDownloadUrl(previewUrl)} 
                  download 
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                >
                  <HiOutlineDownload className="w-4 h-4" /> Save PDF
                </a>
                <button 
                  onClick={() => setPreviewUrl(null)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                >
                  <HiOutlineX className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 relative">
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-0">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 border-solid border-r-transparent mb-4"></div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Preparing Document...</p>
                </div>
              )}
              
              <iframe 
                src={getEmbedSafeUrl(previewUrl)} 
                className={`w-full h-full border-none bg-white transition-opacity duration-700 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
                title="Resume Preview"
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobApplications