import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { 
  HiArrowLeft, 
  HiOutlineMail, 
  HiOutlineLocationMarker, 
  HiOutlineBriefcase, 
  HiOutlineAcademicCap, 
  HiOutlineChip,
  HiOutlineExternalLink
} from "react-icons/hi"

function ApplicantProfilePage() {
  const { applicantId } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [applicant, setApplicant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.accountType !== "Recruiter") {
      toast.error("Access denied: Recruiters only.")
      navigate("/dashboard/recruiter")
      return
    }

    const fetchApplicantProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/applications/applicantProfile/${applicantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setApplicant(response.data.applicant)
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile")
        navigate("/dashboard/applications")
      } finally {
        setLoading(false)
      }
    }

    if (applicantId && token) fetchApplicantProfile()
  }, [applicantId, token, user, navigate])

  if (loading) return <ProfileSkeleton />

  if (!applicant) return <NotFoundState navigate={navigate} />

  const profileData = applicant.additionalDetails || {}

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── Top Navigation ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </div>
          Back to Applications
        </button>

        <div className="flex gap-3">
            <a
              href={`mailto:${applicant.email}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              <HiOutlineMail className="w-4 h-4" />
              Email Candidate
            </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Left Sidebar (Identity Card) ─────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center lg:text-left">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl mx-auto lg:mx-0 bg-gray-50">
                <img
                  src={applicant.profilePhoto || `https://ui-avatars.com/api/?name=${applicant.firstName}+${applicant.lastName}&background=4f46e5&color=fff`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <h1 className="text-2xl font-black text-gray-900 leading-tight">
              {applicant.firstName} <br /> {applicant.lastName}
            </h1>
            
            <div className="mt-4 space-y-3">
               <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-500 text-sm font-medium">
                  <HiOutlineLocationMarker className="text-indigo-500 w-4 h-4" />
                  {profileData.location || "Location not set"}
               </div>
               <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-500 text-sm font-medium">
                  <HiOutlineMail className="text-indigo-500 w-4 h-4" />
                  {applicant.email}
               </div>
            </div>

            {/* Social / Portfolio Links Placeholder */}
            <div className="pt-6 mt-6 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Professional Links</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                <button className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                   <HiOutlineExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Skills Section inside Sidebar for easy scanning */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">
              <HiOutlineChip className="text-indigo-500 w-5 h-5" />
              Core Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills?.length > 0 ? (
                profileData.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50/50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">No skills listed</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Content (Resume Details) ────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About / Bio */}
          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Summary</h2>
            <p className="text-gray-600 leading-relaxed">
              {profileData.bio || "This candidate hasn't provided a summary yet."}
            </p>
          </section>

          {/* Experience List */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 px-2">
              <HiOutlineBriefcase className="text-indigo-500" />
              Work Experience
            </h2>
            {profileData.experience?.length > 0 ? (
              profileData.experience.map((exp, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{exp.duration}</span>
                  </div>
                  <p className="text-indigo-600 font-semibold mb-3">{exp.company}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))
            ) : (
              <EmptyStateSection message="No experience data listed." />
            )}
          </section>

          {/* Education List */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 px-2">
              <HiOutlineAcademicCap className="text-indigo-500" />
              Education
            </h2>
            {profileData.education?.length > 0 ? (
              profileData.education.map((edu, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{edu.institution}</h3>
                      <p className="text-gray-500 font-medium">{edu.degree}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{edu.duration}</span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyStateSection message="No education data listed." />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

// ── Shared UI Sub-components ─────────────────────────────────────────────────

function EmptyStateSection({ message }) {
  return (
    <div className="bg-gray-50 rounded-3xl p-8 border border-dashed border-gray-200 text-center">
      <p className="text-gray-400 text-sm italic">{message}</p>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-pulse">
      <div className="h-10 w-48 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-96 bg-gray-100 rounded-3xl" />
        <div className="lg:col-span-2 space-y-6">
          <div className="h-40 bg-gray-100 rounded-3xl" />
          <div className="h-80 bg-gray-100 rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

function NotFoundState({ navigate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
        <HiOutlineExternalLink className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">Applicant Not Found</h3>
      <p className="text-gray-500 mt-2 max-w-xs">The profile you are looking for may have been removed or the link is incorrect.</p>
      <button 
        onClick={() => navigate(-1)} 
        className="mt-6 px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition"
      >
        Go Back
      </button>
    </div>
  )
}

export default ApplicantProfilePage