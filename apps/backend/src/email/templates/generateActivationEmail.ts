export default function generateActivationEmail(activationLink: string) {
  return {
    subject: "Account Activation",
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Account Activation</title>
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
        .activation-link {
            display: inline-block;
            padding: 10px 20px;
            color: #fff;
            background-color: #007bff;
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
            <h1>Activate Your Account</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering an account with us. To complete the registration process, please click the link below to activate your account:</p>
            <p><a href="${activationLink}" class="activation-link">Activate Account</a></p>
            <p>If you did not sign up for this account, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`,
  }
}
