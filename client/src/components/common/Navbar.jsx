"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { HiOutlineLogout, HiOutlineUser, HiOutlineMenu, HiOutlineX } from "react-icons/hi"

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setMobileMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">JobPortal</h1>
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {(!isAuthenticated || (isAuthenticated && user.accountType === "JobSeeker")) && (
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/")}`}
                >
                  Home
                </Link>
              )}

              {(!isAuthenticated || (isAuthenticated && user.accountType === "JobSeeker")) && (
                <Link
                  to="/jobs"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/jobs")}`}
                >
                  Jobs
                </Link>
              )}

              {isAuthenticated && user.accountType === "JobSeeker" && (
                <Link
                  to="/saved-jobs"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/saved-jobs")}`}
                >
                  Saved Jobs
                </Link>
              )}

              {isAuthenticated && (
                <>
                  {user.accountType === "JobSeeker" ? (
                    <Link
                      to="/dashboard/jobseeker"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/dashboard/jobseeker")}`}
                    >
                      Applied Jobs
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/dashboard/recruiter"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/dashboard/recruiter")}`}
                      >
                        Posted Jobs
                      </Link>
                      <Link
                        to="/dashboard/applications"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/dashboard/applications")}`}
                      >
                        Applications
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Desktop Profile Menu */}
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
                        {user.accountType === "JobSeeker"
                          ? `${user.firstName} ${user.lastName}`
                          : user.companyName}
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
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <HiOutlineUser className="mr-2 h-5 w-5 text-gray-500" />
                          My Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout()
                            setProfileMenuOpen(false)
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <HiOutlineLogout className="mr-2 h-5 w-5 text-gray-500" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? (
                <HiOutlineX className="block h-6 w-6" />
              ) : (
                <HiOutlineMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {(!isAuthenticated || (isAuthenticated && user?.accountType === "JobSeeker")) && (
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === "/" 
                  ? "border-blue-500 text-blue-700 bg-blue-50" 
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          )}

          {(!isAuthenticated || (isAuthenticated && user?.accountType === "JobSeeker")) && (
            <Link
              to="/jobs"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === "/jobs" 
                  ? "border-blue-500 text-blue-700 bg-blue-50" 
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Link>
          )}

          {isAuthenticated && user?.accountType === "JobSeeker" && (
            <Link
              to="/saved-jobs"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === "/saved-jobs" 
                  ? "border-blue-500 text-blue-700 bg-blue-50" 
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Saved Jobs
            </Link>
          )}

          {isAuthenticated && user?.accountType === "JobSeeker" && (
            <Link
              to="/dashboard/jobseeker"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === "/dashboard/jobseeker" 
                  ? "border-blue-500 text-blue-700 bg-blue-50" 
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Applied Jobs
            </Link>
          )}

          {isAuthenticated && user?.accountType === "Recruiter" && (
            <>
              <Link
                to="/dashboard/recruiter"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === "/dashboard/recruiter" 
                    ? "border-blue-500 text-blue-700 bg-blue-50" 
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Posted Jobs
              </Link>
              <Link
                to="/dashboard/applications"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === "/dashboard/applications" 
                    ? "border-blue-500 text-blue-700 bg-blue-50" 
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Applications
              </Link>
            </>
          )}
        </div>

        {/* Mobile profile section */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      user.accountType === "JobSeeker"
                        ? user.profilePhoto || "https://via.placeholder.com/150"
                        : user.companyLogo || "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user.accountType === "JobSeeker"
                      ? `${user.firstName} ${user.lastName}`
                      : user.companyName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1 px-4">
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
