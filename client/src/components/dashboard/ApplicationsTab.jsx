import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useRecruiterJobs } from "../../hooks/useJobs";
import { useJobApplications, useUpdateApplicationStatus } from "../../hooks/useApplications";
import { 
  HiOutlineDocumentDownload, 
  HiOutlineBriefcase, 
  HiOutlineUserGroup,
  HiChevronRight,
  HiOutlineArrowLeft,
  HiOutlineExternalLink,
  HiOutlineSearch
} from "react-icons/hi";

function ApplicationsTab() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobIdParam = searchParams.get("jobId");
  const [selectedJob, setSelectedJob] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const { data: jobsData, isLoading: jobsLoading } = useRecruiterJobs();
  const jobs = useMemo(() => jobsData?.jobs || [], [jobsData]);

  const { data: applicationsData, isLoading: applicationsLoading } = useJobApplications(selectedJob);
  const applications = applicationsData?.applications || [];
  const updateStatusMutation = useUpdateApplicationStatus();

  useEffect(() => {
    if (jobIdParam) setSelectedJob(jobIdParam);
    else if (jobs.length > 0 && !selectedJob) setSelectedJob(jobs[0]._id);
  }, [jobIdParam, jobs, selectedJob]);

  const handleStatusChange = (applicationId, newStatus) => {
    updateStatusMutation.mutate({ applicationId, status: newStatus });
  };

  const exportToExcel = () => {
    if (applications.length === 0) return toast.error("No applications to export");
    setExportLoading(true);
    try {
      const selectedJobData = jobs.find((job) => job._id === selectedJob);
      const exportData = applications.map((app) => ({
        "Applicant Name": `${app.applicant.firstName} ${app.applicant.lastName}`,
        Email: app.applicant.email,
        Status: app.status,
        "Applied Date": format(new Date(app.appliedDate), "MMM dd, yyyy"),
        "Resume Link": app.resume,
      }));
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Applications");
      XLSX.writeFile(wb, `${selectedJobData.title}_Apps_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
      toast.success("Export Complete");
    } catch (error) {
      toast.error("Export Failed");
    } finally {
      setExportLoading(false);
    }
  };

  if (jobsLoading) return <LoadingSkeleton />;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 animate-in fade-in duration-700">
      
      {/* ── Top Navigation Row ── */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <HiOutlineArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </div>
          Back to Dashboard
        </button>
      </div>

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Application Pipeline</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and track candidates for your active job listings.</p>
        </div>
        
        {selectedJob && (
          <button
            onClick={exportToExcel}
            disabled={exportLoading || applications.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <HiOutlineDocumentDownload className="w-5 h-5" />
            {exportLoading ? "Exporting..." : "Export CSV"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Sidebar: Master List ── */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm sticky top-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Your Job Postings</p>
            
            {jobs.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-400 text-sm italic font-medium">No active jobs found</p>
              </div>
            ) : (
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => setSelectedJob(job._id)}
                    className={`flex-shrink-0 lg:w-full text-left p-4 rounded-2xl transition-all group ${
                      selectedJob === job._id
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate max-w-[150px] lg:max-w-[180px]">{job.title}</p>
                        <p className={`text-[10px] font-bold mt-1 ${selectedJob === job._id ? "text-indigo-100" : "text-gray-400"}`}>
                          {job.applications?.length || 0} Candidates
                        </p>
                      </div>
                      <HiChevronRight className={`hidden lg:block w-4 h-4 transition-transform ${selectedJob === job._id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Main Content: Detail View ── */}
        <main className="lg:col-span-9">
          {selectedJob ? (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              {applicationsLoading ? (
                <div className="h-96 flex flex-col items-center justify-center space-y-4">
                  <LoadingSpinner />
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Fetching Pipeline...</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Candidate</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Applied</th>
                          <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pipeline Status</th>
                          <th className="px-8 py-5 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {applications.map((app) => (
                          <tr key={app._id} className="group hover:bg-indigo-50/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                  {app.applicant.firstName[0]}{app.applicant.lastName[0]}
                                </div>
                                <div>
                                  <Link
                                    to={`/dashboard/applicantProfile/${app.applicant._id}`}
                                    className="font-bold text-gray-900 hover:text-indigo-600 block transition-colors"
                                  >
                                    {app.applicant.firstName} {app.applicant.lastName}
                                  </Link>
                                  <p className="text-xs text-gray-400 font-medium">{app.applicant.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-500 font-semibold">
                              {format(new Date(app.appliedDate), "MMM dd, yyyy")}
                            </td>
                            <td className="px-8 py-6">
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                className={`text-[11px] font-black uppercase tracking-tight px-3 py-1.5 rounded-lg border-none ring-1 ring-inset cursor-pointer transition-all ${getStatusStyles(app.status)}`}
                              >
                                {["Pending", "Reviewing", "Shortlisted", "Rejected", "Hired"].map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <a href={app.resume} target="_blank" className="p-2 text-gray-300 hover:text-indigo-600 transition-colors">
                                <HiOutlineSearch className="w-5 h-5" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View (No Horizontal Scroll) */}
                  <div className="md:hidden divide-y divide-gray-50">
                    {applications.map((app) => (
                      <div key={app._id} className="p-6">
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                            {app.applicant.firstName[0]}
                          </div>
                          <div>
                            <Link to={`/dashboard/applicantProfile/${app.applicant._id}`} className="font-bold text-gray-900 block leading-tight">
                              {app.applicant.firstName} {app.applicant.lastName}
                            </Link>
                            <p className="text-xs text-gray-400 mt-0.5">{app.applicant.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-6">
                           <div>
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Applied Date</p>
                             <p className="text-xs font-bold text-gray-600">{format(new Date(app.appliedDate), "MMM dd, yyyy")}</p>
                           </div>
                           <a 
                             href={app.resume} 
                             target="_blank" 
                             className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-xl"
                           >
                             <HiOutlineExternalLink className="w-3.5 h-3.5" />
                             Resume
                           </a>
                        </div>

                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className={`w-full text-xs font-black uppercase py-3.5 px-4 rounded-xl border-none ring-1 ring-inset ${getStatusStyles(app.status)}`}
                        >
                          {["Pending", "Reviewing", "Shortlisted", "Rejected", "Hired"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {applications.length === 0 && <EmptyState />}
                </>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 py-24 text-center">
              <HiOutlineBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Select a Job Posting</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">Choose a listing from the sidebar to review candidate applications.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Helpers ──

const getStatusStyles = (status) => {
  const map = {
    Pending: "bg-blue-50 text-blue-700 ring-blue-100",
    Reviewing: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    Shortlisted: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Rejected: "bg-rose-50 text-rose-700 ring-rose-100",
    Hired: "bg-gray-900 text-white ring-gray-900",
  };
  return map[status] || "bg-gray-50 text-gray-700";
};

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 border-solid border-r-transparent"></div>
);

const EmptyState = () => (
  <div className="py-24 text-center">
    <HiOutlineUserGroup className="w-12 h-12 text-gray-100 mx-auto mb-3" />
    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">No Candidates Yet</p>
  </div>
);

const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
    <div className="h-8 w-40 bg-gray-100 rounded-lg mb-8" />
    <div className="h-16 bg-gray-50 rounded-2xl mb-12" />
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-3 h-80 bg-gray-50 rounded-3xl" />
      <div className="col-span-9 h-[500px] bg-gray-50 rounded-[2.5rem]" />
    </div>
  </div>
);

export default ApplicationsTab;