import { useEffect } from "react"

const RenderOptimizer = () => {
  useEffect(() => {
    const keepWarm = () => {
      fetch(`${import.meta.env.VITE_API_URL}/ping`)
        .then(() => console.log("✅ Server pinged successfully"))
        .catch(() => console.log("⚠️ Ping failed — likely because the server is asleep"))
    }

    // Initial ping
    keepWarm()

    // Repeat every 10 minutes
    const interval = setInterval(keepWarm, 10 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return null // This component is invisible
}

export default RenderOptimizer
