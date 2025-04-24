"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { HiOutlineLogout, HiOutlineUser } from "react-icons/hi"

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
              {(!isAuthenticated || (isAuthenticated && user.accountType === "JobSeeker")) && (
                <Link
                  to="/"
                  className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </Link>
              )}

              {(!isAuthenticated || (isAuthenticated && user.accountType === "JobSeeker")) && (
                <Link
                  to="/jobs"
                  className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Jobs
                </Link>
              )}

              {isAuthenticated && user.accountType === "JobSeeker" && (
                <Link
                  to="/saved-jobs"
                  className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Saved Jobs
                </Link>
              )}

              {isAuthenticated && (
                <>
                  {user.accountType === "JobSeeker" ? (
                    <Link
                      to="/dashboard/jobseeker"
                      className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Applied Jobs
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/dashboard/recruiter"
                        className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Posted Jobs
                      </Link>
                      <Link
                        to="/dashboard/applications"
                        className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                          Your Profile
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
                  to="/register"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
