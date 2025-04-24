const jobUpdateTemplate = (jobTitle, companyName, status, deadline) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Job Status Update</title>
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
        color: #4F46E5;
        font-weight: bold;
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
      <div class="message">Job Status Update</div>
      <div class="body">
        <p>The job <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span> has been updated.</p>
        <p>Current Status: <span class="highlight">${status}</span></p>
        ${deadline ? `<p>New Deadline: <span class="highlight">${new Date(deadline).toLocaleDateString()}</span></p>` : ""}
        <a class="cta" href="${process.env.CLIENT_URL}/jobs">View Jobs</a>
      </div>
      <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:support@jobportal.com">support@jobportal.com</a>.</div>
    </div>
  </body>
  </html>`
}

module.exports = jobUpdateTemplate
