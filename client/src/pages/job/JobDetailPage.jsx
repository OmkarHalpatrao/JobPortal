import { HiArrowNarrowLeft } from "react-icons/hi"
import { useNavigate } from "react-router-dom"
import JobDetail from "../../components/job/JobDetail"

function JobDetailPage() {
  const navigate = useNavigate()
  return (
    <div className="relative min-h-screen">
      {/* Back Button at top left */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 sm:left-8 sm:top-8 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 z-20 transition-all duration-150"
        style={{ minWidth: '90px' }}
      >
        <HiArrowNarrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back</span>
      </button>
      <div>
        <JobDetail />
      </div>
    </div>
  )
}

export default JobDetailPage

