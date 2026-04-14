import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { HiArrowNarrowLeft } from "react-icons/hi";

function CompanyProfilePage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_API_URL}/profile/company/${companyId}`);
        setCompany(response.data.company);

        // Fix: double slash in API URL removed
        const jobsResponse = await api.get(`${import.meta.env.VITE_API_URL}/jobs/company/${companyId}`)

        setCompanyJobs(jobsResponse.data.jobs);
      } catch (error) {
        console.error("Error fetching company profile:", error);
        toast.error("Failed to load company profile");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyProfile();
    }
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-700">Company not found</h3>
        <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
        {/* Back button on top right */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          <HiArrowNarrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Company Header */}
        <div className="bg-blue-600 text-white p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-white flex items-center justify-center">
            <img
              src={company.companyLogo || "https://via.placeholder.com/150?text=Company"}
              alt={company.companyName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{company.companyName}</h1>
            <p className="mt-1 text-white/80 text-sm">{company.additionalDetails?.industry || "Industry not specified"}</p>
            <div className="text-white/80 text-sm mt-2 space-x-2">
              <span>{company.additionalDetails?.location || "Location not specified"}</span>
              {company.additionalDetails?.companySize && (
                <span>• {company.additionalDetails.companySize} employees</span>
              )}
              {company.additionalDetails?.foundedYear && (
                <span>• Founded {company.additionalDetails.foundedYear}</span>
              )}
            </div>
          </div>
        </div>

        {/* Company Body */}
        <div className="p-6 space-y-8">
          {/* About Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About the Company</h2>
            <p className="text-gray-600 leading-relaxed">
              {company.additionalDetails?.companyDescription || "No company description available."}
            </p>
          </section>

          {/* Website */}
          {company.additionalDetails?.website && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Website</h2>
              <a
                href={company.additionalDetails.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {company.additionalDetails.website}
              </a>
            </section>
          )}

          {/* Jobs List */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Open Positions</h2>
            {companyJobs.length === 0 ? (
              <p className="text-gray-500">No open positions at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyJobs.map((job) => (
                  <div
                    key={job._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow transition-shadow bg-white"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {job.jobType}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          job.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : job.status === "Deadline Ended"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status || "Inactive"}
                      </span>
                    </div>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-block text-sm mt-3 text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfilePage;
