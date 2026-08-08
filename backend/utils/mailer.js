const nodemailer = require('nodemailer');

// Helper to create transporter dynamically
const createTransporter = async () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  // Check if real SMTP credentials are provided
  const isRealCreds = user && pass && pass !== 'your_app_password_here';

  if (isRealCreds) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass }
    });
  }

  // Development Fallback: Create Ethereal test account for instant testing
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    console.warn('⚠️ Nodemailer Ethereal creation failed, using JSON transport fallback.');
    return nodemailer.createTransport({
      jsonTransport: true
    });
  }
};

/**
 * Send Email function
 * @param {Object} options - { to, subject, html, text }
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await createTransporter();

    const from = process.env.SMTP_FROM || '"NexCart Support" <noreply@nexcart.com>';

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || 'NexCart Order Update Notification',
      html
    });

    console.log(`📧 [Nodemailer] Email sent successfully to "${to}" | MessageId: ${info.messageId}`);
    
    // If using Ethereal test account, print preview URL!
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 [Nodemailer Preview URL]: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ [Nodemailer Error]: Failed to send email:', error.message);
    // Return gracefully so application flow is never broken by email failure
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
