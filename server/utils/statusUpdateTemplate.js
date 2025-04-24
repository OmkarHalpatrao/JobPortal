const statusUpdateTemplate = (applicantName, jobTitle, companyName, status) => {
  let statusMessage = ""
  let statusColor = "#4F46E5"

  switch (status) {
    case "Reviewing":
      statusMessage = "Your application is currently being reviewed by the hiring team."
      statusColor = "#3B82F6" // blue
      break
    case "Shortlisted":
      statusMessage =
        "Congratulations! You have been shortlisted for the next round. The recruiter may contact you soon for further steps."
      statusColor = "#10B981" // green
      break
    case "Rejected":
      statusMessage =
        "We regret to inform you that your application was not selected for this position. We encourage you to apply for other suitable roles."
      statusColor = "#EF4444" // red
      break
    case "Hired":
      statusMessage =
        "Congratulations! You have been selected for this position. The recruiter will contact you soon with further details."
      statusColor = "#8B5CF6" // purple
      break
    default:
      statusMessage = "Your application status has been updated."
  }

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Application Status Update</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #333333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
      }
      .logo {
        max-width: 200px;
        margin-bottom: 20px;
      }
      .message {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .body {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .highlight {
        color: ${statusColor};
        font-weight: bold;
      }
      .status-badge {
        display: inline-block;
        padding: 8px 16px;
        background-color: ${statusColor};
        color: #ffffff;
        border-radius: 20px;
        font-weight: bold;
        margin: 10px 0;
      }
      .cta {
        display: inline-block;
        padding: 10px 20px;
        background-color: #4F46E5;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin-top: 20px;
      }
      .support {
        font-size: 14px;
        color: #999999;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="message">Application Status Update</div>
      <div class="body">
        <p>Dear ${applicantName},</p>
        <p>Your application for the <span class="highlight">${jobTitle}</span> position at <span class="highlight">${companyName}</span> has been updated.</p>
        <p>Current Status: <div class="status-badge">${status}</div></p>
        <p>${statusMessage}</p>
        <a class="cta" href="${process.env.CLIENT_URL}/dashboard/jobseeker">View Your Applications</a>
      </div>
      <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:support@jobportal.com">support@jobportal.com</a>.</div>
    </div>
  </body>
  </html>`
}

module.exports = statusUpdateTemplate
