import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "./context/AuthContext"
import RenderOptimizer from "./components/common/RandomOptimizer"
import PublicRoute from "./components/auth/PublicRoute"

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

// Profile pages
import ProfilePage from "./pages/profile/ProfilePage"
import CompanyProfilePage from "./pages/company/CompanyProfilePage"
import ApplicantProfilePage from "./pages/applicant/ApplicantProfilePage"

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
        <RenderOptimizer />
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <PublicRoute>
                  <HomePage />
                </PublicRoute>
              }
            />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId" element={<JobDetailPage />} />
            <Route
              path="login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />
            <Route
              path="verify-email"
              element={
                <PublicRoute>
                  <VerifyEmailPage />
                </PublicRoute>
              }
            />
            <Route path="company/:companyId" element={<CompanyProfilePage />} />
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
            <Route
              path="applicantProfile/:applicantId"
              element={
                <ProtectedRoute allowedRoles={["Recruiter"]}>
                  <ApplicantProfilePage />
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
