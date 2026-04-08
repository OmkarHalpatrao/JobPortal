function ErrorMessage({ message }) {
  return (
    <div role="alert" className="text-center py-10">
      <h3 className="text-lg font-medium text-gray-700">{message || "Something went wrong"}</h3>
    </div>
  )
}

export default ErrorMessage


