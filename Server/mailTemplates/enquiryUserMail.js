const userTemplate = (
  subscriberName,
  contactType,
  supportEmail = "besthubnews.com",
  blogName = "Best News Hub"
) => {
  const template = ` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Submission</title>
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
        <p>Dear ${subscriberName},</p>
        
        <p>Thank you for reaching out to us with your <strong>${contactType}</strong>. We have received your message and will get back to you as soon as possible.</p>
        
        <p>Your inquiry has been successfully submitted, and our team will review it shortly. If there’s anything urgent, feel free to contact us directly.</p>
        
        <p>Thank you for your interest in ${blogName}!</p>
        
        <p>Best regards,</p>
        <p>Team ${blogName}</p>
        <p>Support Email: <a href="mailto: support@bestnewshub.com">support@bestnewshub.com</a></p>
    </body>
    </html>
  `;
  return template;
};

const adminTemplate = (
  subscriberName,
  contactType,
  userEmail,
  userMessage,
  blogName = "Best News Hub"
) => {
  let template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New ${contactType} Enquiry Submission - ${subscriberName}</title>
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
        <p>Dear Admin,</p>
        
        <p>A new <strong>${contactType}</strong> has been submitted by a user:</p>
        
        <p><strong>Name:</strong> ${subscriberName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Message:</strong> ${userMessage}</p>
        
        <p>Please review the details and take appropriate action for the enquiry or advertisement.</p>
        
        <p>Best regards,</p>
        <p>Team ${blogName}</p>
    </body>
    </html>
  `;
  return template;
};

module.exports = { userTemplate, adminTemplate };
