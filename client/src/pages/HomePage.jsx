import { Link } from "react-router-dom"

function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Find Your Dream Job</span>
              <span className="block text-indigo-600">or Perfect Candidate</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Connect with top employers and talented professionals. Your next opportunity is just a click away.
            </p>
            <div className="mt-10 flex justify-center gap-3">
              <Link
                to="/jobs"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Browse Jobs
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose JobPortal</h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to find your next opportunity or ideal candidate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-4">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Job Opportunities</h3>
              <p className="text-gray-600">
                Access thousands of job listings from top companies across various industries.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-4">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Talent Pool</h3>
              <p className="text-gray-600">
                Find skilled professionals with verified credentials and experience in their field.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-4">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Secure Process</h3>
              <p className="text-gray-600">
                Our verification system ensures legitimate job listings and qualified candidates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Simple steps to connect job seekers with employers</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create an Account</h3>
              <p className="text-gray-600">Sign up as a job seeker or recruiter with a verified email.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Profile</h3>
              <p className="text-gray-600">Build your profile with skills, experience, and preferences.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Browse & Apply</h3>
              <p className="text-gray-600">Search for jobs matching your skills or post job openings.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Interview and hire or get hired for your dream role.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-xl text-indigo-100">
            Join thousands of professionals and companies already using our platform
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/signup"
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-8"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

