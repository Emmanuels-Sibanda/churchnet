/**
 * Universal Email Service
 * Automatically detects and uses the configured email service
 * Supports: SendGrid, Resend, SMTP, or Console (for testing)
 */

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@churchvenue.co.za';
const FROM_NAME = process.env.FROM_NAME || 'Church Venue';

// Determine which email service to use
const getEmailService = () => {
  if (process.env.SENDGRID_API_KEY) {
    return require('./email'); // SendGrid
  } else if (process.env.RESEND_API_KEY) {
    return require('./email-resend'); // Resend
  } else if (process.env.SMTP_HOST) {
    return require('./email-smtp'); // SMTP
  } else {
    // Fallback to console logging
    return {
      sendEmail: async (to, subject, html, text) => {
        console.log('📧 Email would be sent (no email service configured):');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Body:', text || html);
        return { success: true, method: 'console' };
      },
      sendWelcomeEmail: async () => ({ success: true }),
      sendBookingRequestToOwner: async () => ({ success: true }),
      sendBookingRequestToBooker: async () => ({ success: true }),
      sendBookingApproval: async () => ({ success: true }),
      sendBookingRejection: async () => ({ success: true })
    };
  }
};

// Get the active email service
const emailService = getEmailService();

// Export all email functions
module.exports = {
  sendEmail: emailService.sendEmail,
  sendWelcomeEmail: emailService.sendWelcomeEmail,
  sendBookingRequestToOwner: emailService.sendBookingRequestToOwner,
  sendBookingRequestToBooker: emailService.sendBookingRequestToBooker,
  sendBookingApproval: emailService.sendBookingApproval,
  sendBookingRejection: emailService.sendBookingRejection
};


