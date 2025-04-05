"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "./context/AuthContext"

// Layouts
import MainLayout from "./layouts/MainLayout"
import DashboardLayout from "./layouts/DashboardLayout"

// Auth pages
import LoginPage from "./pages/auth/LoginPage"
import SignupPage from "./pages/auth/SignupPage"
import VerifyEmailPage from "./pages/auth/VerifyEmailPage"

// Job pages
import HomePage from "./pages/HomePage"
import JobsPage from "./pages/job/JobsPage"
import JobDetailPage from "./pages/job/JobDetailPage"
import CreateJobPage from "./pages/job/CreateJobPage"
import SavedJobsPage from "./pages/job/SavedJobsPage"

// Dashboard pages
import JobSeekerDashboardPage from "./pages/dashboard/JobSeekerDashboardPage"
import RecruiterDashboardPage from "./pages/dashboard/RecruiterDashboardPage"
import ApplicationsPage from "./pages/dashboard/ApplicationsPage"

// Profile page
import ProfilePage from "./pages/profile/ProfilePage"

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.accountType)) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="saved-jobs"
              element={
                <ProtectedRoute allowedRoles={["JobSeeker"]}>
                  <SavedJobsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="jobseeker"
              element={
                <ProtectedRoute allowedRoles={["JobSeeker"]}>
                  <JobSeekerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter"
              element={
                <ProtectedRoute allowedRoles={["Recruiter"]}>
                  <RecruiterDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="applications"
              element={
                <ProtectedRoute allowedRoles={["Recruiter"]}>
                  <ApplicationsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute allowedRoles={["Recruiter"]}>
                <MainLayout>
                  <CreateJobPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

