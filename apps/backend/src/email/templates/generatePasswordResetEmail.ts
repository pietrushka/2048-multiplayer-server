export default function generatePasswordResetEmail(resetPasswordUrl: string) {
  return {
    subject: "Password Reset Request",
    html: `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Password Reset</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              color: #333;
              line-height: 1.6;
          }
          .container {
              width: 80%;
              max-width: 600px;
              margin: 20px auto;
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
          }
          .header h1 {
              margin: 0;
              color: #333;
          }
          .content {
              padding: 20px 0;
          }
          .content p {
              margin: 0 0 20px;
          }
          .reset-link {
              display: inline-block;
              padding: 10px 20px;
              color: #fff;
              background-color: #dc3545;
              text-decoration: none;
              border-radius: 5px;
          }
          .footer {
              text-align: center;
              font-size: 0.8em;
              color: #777;
              padding-top: 20px;
              border-top: 1px solid #eee;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Password Reset Request</h1>
          </div>
          <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the link below to choose a new password:</p>
              <p><a href="${resetPasswordUrl}" class="reset-link">Reset Password</a></p>
              <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
          </div>
      </div>
  </body>
  </html>
  `,
  }
}
