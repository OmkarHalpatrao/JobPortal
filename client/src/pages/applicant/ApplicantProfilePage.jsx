import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"

function ApplicantProfilePage() {
  const { applicantId } = useParams()
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [applicant, setApplicant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.accountType !== "Recruiter") {
      toast.error("Only recruiters can view applicant profiles")
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
        toast.error(error.response?.data?.message || "Failed to load applicant profile")
        navigate("/dashboard/applications")
      } finally {
        setLoading(false)
      }
    }

    if (applicantId && token) {
      fetchApplicantProfile()
    }
  }, [applicantId, token, user, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid border-r-transparent"></div>
      </div>
    )
  }

  if (!applicant) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-700">Applicant not found</h3>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Go Back
        </button>
      </div>
    )
  }

  const profileData = applicant.additionalDetails || {}

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
            <img
              src={applicant.profilePhoto || "https://via.placeholder.com/150?text=Profile"}
              alt={`${applicant.firstName} ${applicant.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{applicant.firstName} {applicant.lastName}</h1>
            <p className="mt-2 text-white/90">{profileData.bio || "No bio available"}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-white/80">
              {profileData.location && <span>{profileData.location}</span>}
              {applicant.email && <span>• {applicant.email}</span>}
            </div>
            {applicant.email && (
              <a
                href={`mailto:${applicant.email}`}
                className="mt-4 inline-block px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-blue-100 transition"
              >
                Contact Applicant
              </a>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Skills */}
          {profileData.skills?.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {profileData.experience?.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Experience</h2>
              <div className="space-y-4">
                {profileData.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-4 border-blue-400 pl-4">
                    <h3 className="text-lg font-medium">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-gray-500 text-sm">{exp.duration}</p>
                    <p className="mt-1 text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {profileData.education?.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Education</h2>
              <div className="space-y-4">
                {profileData.education.map((edu, idx) => (
                  <div key={idx} className="border-l-4 border-blue-400 pl-4">
                    <h3 className="text-lg font-medium">{edu.institution}</h3>
                    <p className="text-gray-600">{edu.degree}</p>
                    <p className="text-gray-500 text-sm">{edu.duration}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicantProfilePage
