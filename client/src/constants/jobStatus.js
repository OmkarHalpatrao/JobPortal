export const JOB_STATUS = {
  ACTIVE: "Active",
  DEADLINE_ENDED: "Deadline Ended",
  CLOSED: "Closed",
  REOPENED: "Reopened",
}

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case JOB_STATUS.ACTIVE:
      return "bg-green-100 text-green-800"
    case JOB_STATUS.DEADLINE_ENDED:
      return "bg-yellow-100 text-yellow-800"
    case JOB_STATUS.CLOSED:
      return "bg-red-100 text-red-800"
    case JOB_STATUS.REOPENED:
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}


