"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { Editor } from "react-draft-wysiwyg"
import { EditorState } from "draft-js"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

function getPlainText(editorState) {
  const content = editorState.getCurrentContent()
  return content.getPlainText().trim()
}

function CreateJobForm() {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    description: "",
    skills: "",
    deadline: "",
  })

  const [requirementsState, setRequirementsState] = useState(EditorState.createEmpty())
  const [responsibilitiesState, setResponsibilitiesState] = useState(EditorState.createEmpty())
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requirementsText = getPlainText(requirementsState)
    const responsibilitiesText = getPlainText(responsibilitiesState)

    const jobData = {
      ...formData,
      company: user.companyName,
      requirements: requirementsText,
      responsibilities: responsibilitiesText,
      skills: formData.skills.split(",").map((item) => item.trim()).filter((item) => item),
    }

    setLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/jobs/create`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        toast.success("Job posted successfully")
        navigate("/dashboard/recruiter")
      }
    } catch (error) {
      console.error("Error posting job:", error)
      toast.error(error.response?.data?.message || "Failed to post job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-indigo-600">
        <h2 className="text-xl font-bold text-white">Post a New Job</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={user.companyName}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          <Editor
            editorState={requirementsState}
            onEditorStateChange={setRequirementsState}
            wrapperClassName="border rounded"
            editorClassName="p-2 min-h-[150px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
          <Editor
            editorState={responsibilitiesState}
            onEditorStateChange={setResponsibilitiesState}
            wrapperClassName="border rounded"
            editorClassName="p-2 min-h-[150px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  )
}

export default CreateJobForm
