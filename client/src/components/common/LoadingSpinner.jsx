function LoadingSpinner() {
  return (
    <div role="status" aria-live="polite" className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export default LoadingSpinner


