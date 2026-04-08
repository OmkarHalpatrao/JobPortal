export class JobStorageService {
  static getSavedJobs() {
    try {
      return JSON.parse(localStorage.getItem("savedJobs") || "[]")
    } catch {
      return []
    }
  }

  static isJobSaved(jobId) {
    const savedJobs = this.getSavedJobs()
    return savedJobs.some((job) => job._id === jobId)
  }

  static saveJob(job) {
    const savedJobs = this.getSavedJobs()
    if (!savedJobs.some((saved) => saved._id === job._id)) {
      savedJobs.push(job)
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs))
      return true
    }
    return false
  }

  static unsaveJob(jobId) {
    const savedJobs = this.getSavedJobs()
    const filtered = savedJobs.filter((job) => job._id !== jobId)
    localStorage.setItem("savedJobs", JSON.stringify(filtered))
    return filtered.length !== savedJobs.length
  }
}


