import { Outlet, Navigate } from "react-router-dom"
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"
import { useAuth } from "../context/AuthContext"

function DashboardLayout() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DashboardLayout

