"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">JobPortal</h1>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Show Home link only for non-authenticated users or job seekers */}
              {(!isAuthenticated || (isAuthenticated && user.accountType === "JobSeeker")) && (
                <Link
                  to="/"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
              )}

              {/* Show Jobs link for job seekers */}
              {(!isAuthenticated || (isAuthenticated && user.accountType === "JobSeeker")) && (
                <Link
                  to="/jobs"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Jobs
                </Link>
              )}

              {/* Show Saved Jobs link for job seekers */}
              {isAuthenticated && user.accountType === "JobSeeker" && (
                <Link
                  to="/saved-jobs"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Saved Jobs
                </Link>
              )}

              {/* Show Dashboard link for authenticated users */}
              {isAuthenticated && (
                <>
                  {user.accountType === "JobSeeker" ? (
                    <>
                      <Link
                        to="/dashboard/jobseeker"
                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Applied Jobs
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/dashboard/recruiter"
                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Posted Jobs
                      </Link>
                      <Link
                        to="/dashboard/applications"
                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Applications
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center space-x-3 focus:outline-none"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {user.accountType === "JobSeeker" ? `${user.firstName} ${user.lastName}` : user.companyName}
                      </span>
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                        <img
                          src={
                            user.accountType === "JobSeeker"
                              ? user.profilePhoto || "https://via.placeholder.com/150"
                              : user.companyLogo || "https://via.placeholder.com/150"
                          }
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </button>
                    {profileMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout()
                            setProfileMenuOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {(!isAuthenticated || (isAuthenticated && user.accountType === "JobSeeker")) && (
              <Link
                to="/"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            )}

            {(!isAuthenticated || (isAuthenticated && user.accountType === "JobSeeker")) && (
              <Link
                to="/jobs"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
            )}

            {isAuthenticated && user.accountType === "JobSeeker" && (
              <Link
                to="/saved-jobs"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Saved Jobs
              </Link>
            )}

            {isAuthenticated && (
              <>
                {user.accountType === "JobSeeker" ? (
                  <Link
                    to="/dashboard/jobseeker"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Applied Jobs
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard/recruiter"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Posted Jobs
                    </Link>
                    <Link
                      to="/dashboard/applications"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Applications
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={
                          user.accountType === "JobSeeker"
                            ? user.profilePhoto || "https://via.placeholder.com/150"
                            : user.companyLogo || "https://via.placeholder.com/150"
                        }
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.accountType === "JobSeeker" ? `${user.firstName} ${user.lastName}` : user.companyName}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="ml-auto bg-blue-600 flex-shrink-0 p-1 rounded-full text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Logout</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center space-x-4 px-4 py-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

