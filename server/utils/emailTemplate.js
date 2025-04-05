const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>OTP Verification Email</title>
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
      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #4F46E5;
        margin: 20px 0;
        padding: 10px 0;
        border-radius: 5px;
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
      <div class="message">OTP Verification Email</div>
      <div class="body">
        <p>Dear User,</p>
        <p>Thank you for registering with Job Portal. To complete your registration, please use the following OTP (One-Time Password) to verify your account:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.</p>
        <p>Once your account is verified, you will have access to our platform and its features.</p>
      </div>
      <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:support@jobportal.com">support@jobportal.com</a>.</div>
    </div>
  </body>
  </html>`
}

module.exports = otpTemplate

