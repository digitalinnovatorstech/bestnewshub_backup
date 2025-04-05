const forgotMasterPasswordTemplate = (otp) => {
  const template = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Password Reset</title>
</head>
<body>
    <p>Dear Admin/HR,</p>
    
    <p>Your One-Time Password (OTP) for resetting your master password is: <strong>${otp}</strong>.</p>
    
    <p>Please use it within the next 1 minute to verify your identity and complete the master password reset process.</p>
    
    <p>If you did not request this change or have any concerns, feel free to contact our support team at <a href="mailto:support@cryovault.com">support@cryovault.com</a>.</p>
    
    <p>Best regards,</p>
    <p>Cryovault</p>
</body>
</html>`;

  return template;
};

const welcomeEmailTemplate = (userId, temporaryPassword, loginUrl) => {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Best News Hub</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
            }
            p {
                margin: 10px 0;
            }
            a {
                color: #0275d8;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            strong {
                color: #000;
            }
        </style>
    </head>
    <body>
        <p>Dear User,</p>
        
        <p>Welcome to <strong>Best News Hub</strong>!</p>
        
        <p>Your account has been successfully created. Below are your login credentials:</p>
        
        <ul>
            <li><strong>Username/User Email:</strong> ${userId}</li>
            <li><strong>Temporary Password:</strong> ${temporaryPassword}</li>
        </ul>
        
        <p>You can log in to your account by visiting the following link:</p>
        <p><a href="${loginUrl}" target="_blank">${loginUrl}</a></p>
        
        <p><strong>Important:</strong> For your security, please reset your password immediately after logging in for the first time.</p>
        
        <p>To reset your password, follow these steps:</p>
        <ol>
            <li>Log in using the credentials provided above.</li>
            <li>Navigate to the <strong>"Settings"</strong> or <strong>"Account"</strong> section.</li>
            <li>Click on <strong>"Change Password"</strong> and set a new password.</li>
        </ol>
        
        <p>If you have any issues logging in or resetting your password, feel free to contact our support team:</p>
        <ul>
            <li>Email: <a href="mailto:info@bestnewshub.com">support@bestnewshub.com</a></li>
            <li>Phone: +91 9867678945</li>
        </ul>
        
        <p>Thank you for being a part of Best News Hub. We’re excited to have you on board!</p>
        
        <p>Best regards,</p>
        <p>Team Best News Hub<br>Admin<br>Best News <br>info@bestnewshub.com</p>
    </body>
    </html>
  `;
  return template;
};

const postNotificationEmailTemplate = (
  subscriberName,
  postTitle,
  postUrl,
  supportEmail,
  blogName = "Best News Hub"
) => {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Post Published on Best News Hub</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
            }
            p {
                margin: 10px 0;
            }
            a {
                color: #0275d8;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            strong {
                color: #000;
            }
        </style>
    </head>
    <body>
        <p>Dear ${subscriberName},</p>
        
        <p>We’re excited to inform you that a new post has been published on <strong>${blogName}</strong>!</p>
        
        <p><strong>${postTitle}</strong></p>
        
        <p>To read the full article, click the link below:</p>
        <p><a href="${postUrl}" target="_blank">${postUrl}</a></p>
        
        <p>We hope you find the post interesting and informative! Feel free to leave a comment or share the post with your friends.</p>
        
        <p>If you have any questions or need assistance, feel free to reach out to our support team:</p>
        <ul>
            <li>Email: <a href="mailto:${supportEmail}">${supportEmail}</a></li>
            <li>Phone: +91 9867678945</li>
        </ul>
        
        <p>Thank you for being a valued subscriber of ${blogName}!</p>
        
        <p>Best regards,</p>
        <p>Team ${blogName}<br>Admin<br>${blogName} Support<br>${supportEmail}</p>
    </body>
    </html>
  `;
  return template;
};

const adminPendingPostNotificationTemplate = (
  guestAuthorName,
  postTitle,
  postUrl,
  reviewUrl
) => {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pending Post for Review on Best News Hub</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
            }
            p {
                margin: 10px 0;
            }
            a {
                color: #0275d8;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            strong {
                color: #000;
            }
        </style>
    </head>
    <body>
        <p>Dear Team Admin,</p>
        
        <p>This is a notification to inform you that a new post created by a Guest Author is awaiting your review and approval before it can be published.</p>
        
        <p><strong>Guest Author:</strong> ${guestAuthorName}</p>
        <p><strong>Post Title:</strong> ${postTitle}</p>
        
        <p>The post is currently in a pending state. You can review it by clicking the link below:</p>
        <p><a href="${reviewUrl}" target="_blank">Review Post</a></p>
        
        <p><strong>Post URL:</strong> <a href="${postUrl}" target="_blank">${postUrl}</a></p>
        
        <p>Please review the post and take the necessary action to either approve or reject it. If any changes are needed, you can provide feedback to the guest author.</p>
        
        <p>Thank you for managing the content on Best News Hub. We appreciate your efforts in maintaining the quality of our website!</p>
        
        <p>Best regards,</p>
        <p>Team Best News Hub<br>Admin<br>Best News Hub Support</p>
    </body>
    </html>
  `;
  return template;
};

const adminPendingUserEmailTemplate = (guestUserName, userEmail) => {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pending User Approval on Best News Hub</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
            }
            p {
                margin: 10px 0;
            }
            strong {
                color: #000;
            }
        </style>
    </head>
    <body>
        <p>Dear Team Admin,</p>
        
        <p>This is a notification to inform you that a new user is awaiting your review and approval before they can be fully granted access.</p>
        
        <p><strong>User Name:</strong> ${guestUserName}</p>
        <p><strong>User Email:</strong> ${userEmail}</p>
        
        <p>Please review the user's details and take the necessary action to approve or reject the user.</p>
        
        <p>Thank you for managing user access on Best News Hub. Your attention to detail is greatly appreciated!</p>
        
        <p>Best regards,</p>
        <p>Team Best News Hub<br>Admin<br>Best News Hub Support</p>
    </body>
    </html>
  `;
  return template;
};

module.exports = {
  forgotMasterPasswordTemplate,
  welcomeEmailTemplate,
  postNotificationEmailTemplate,
  adminPendingPostNotificationTemplate,
  adminPendingUserEmailTemplate,
};
