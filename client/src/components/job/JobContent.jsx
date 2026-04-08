function JobContent({ job }) {
  return (
    <div className="p-4 sm:p-6">
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Description</h2>
        <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
      </section>

      {job.requirements?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {job.requirements.map((requirement, index) => (
              <li key={index} className="break-words">
                {requirement}
              </li>
            ))}
          </ul>
        </section>
      )}

      {job.responsibilities?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index} className="break-words">
                {responsibility}
              </li>
            ))}
          </ul>
        </section>
      )}

      {job.skills?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default JobContent


