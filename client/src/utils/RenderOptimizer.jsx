"use client"

import { useEffect } from "react"
import { preloadResources } from "./performance"

const RenderOptimizer = () => {
  useEffect(() => {
    const idleCallback = requestIdleCallback(() => {
      // Preload critical resources
      preloadResources([
        { type: "image", url: "/placeholder.svg?height=400&width=500" },
      ])

      // Ping backend to keep server warm
      const keepWarm = () => {
        const apiBaseUrl = import.meta.env.Render_Backend_URL
        fetch(`${apiBaseUrl}/api/v1/ping`).catch((err) =>
          console.log("Ping error (ignore if server is waking up):", err),
        )
      }

      // Initial ping
      keepWarm()

      // Repeat every 10 minutes
      const interval = setInterval(keepWarm, 10 * 60 * 1000)

      // Cleanup
      return () => clearInterval(interval)
    })

    return () => cancelIdleCallback(idleCallback)
  }, [])

  return null
}

export default RenderOptimizer
