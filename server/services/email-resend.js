const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@churchvenue.co.za';
const FROM_NAME = process.env.FROM_NAME || 'Church Venue';

/**
 * Send email using Resend
 */
const sendEmail = async (to, subject, html, text = null) => {
  // If Resend is not configured, log email instead
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Email would be sent (Resend not configured):');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', text || html);
    return { success: true, method: 'console' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '')
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Email sent to ${to}: ${subject}`);
    return { success: true, method: 'resend', id: data?.id };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Export same functions as SendGrid version
const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = 'Welcome to Church Venue!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4a90e2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; padding: 12px 24px; background: #4a90e2; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Church Venue!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Thank you for joining Church Venue! We're excited to have you on board.</p>
          <p>You can now:</p>
          <ul>
            <li>List your venues and equipment</li>
            <li>Search and book venues from other churches</li>
            <li>Manage your bookings from your dashboard</li>
          </ul>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>
          <p>If you have any questions, feel free to reach out to us.</p>
          <p>Best regards,<br>The Church Venue Team</p>
        </div>
        <div class="footer">
          <p>This email was sent by Church Venue. You're receiving this because you registered an account.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(userEmail, subject, html);
};

const sendBookingRequestToOwner = async (ownerEmail, ownerName, bookingDetails) => {
  const subject = `New Booking Request for ${bookingDetails.venueName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4a90e2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .button { display: inline-block; padding: 12px 24px; background: #4a90e2; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Booking Request</h1>
        </div>
        <div class="content">
          <p>Hi ${ownerName},</p>
          <p>You have received a new booking request for <strong>${bookingDetails.venueName}</strong>.</p>
          <div class="booking-info">
            <div class="info-row"><span class="label">Booked by:</span> ${bookingDetails.bookerName}</div>
            <div class="info-row"><span class="label">Email:</span> ${bookingDetails.bookerEmail}</div>
            <div class="info-row"><span class="label">Start Date:</span> ${new Date(bookingDetails.startDate).toLocaleString('en-ZA')}</div>
            <div class="info-row"><span class="label">End Date:</span> ${new Date(bookingDetails.endDate).toLocaleString('en-ZA')}</div>
            <div class="info-row"><span class="label">Price Option:</span> ${bookingDetails.priceOption}</div>
            <div class="info-row"><span class="label">Total Price:</span> R${parseFloat(bookingDetails.totalPrice).toFixed(2)}</div>
            ${bookingDetails.notes ? `<div class="info-row"><span class="label">Notes:</span> ${bookingDetails.notes}</div>` : ''}
          </div>
          <p>Please log in to your dashboard to approve or reject this booking.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">View Booking</a>
          <p>Best regards,<br>The Church Venue Team</p>
        </div>
        <div class="footer">
          <p>This email was sent by Church Venue. You're receiving this because you own a venue that was booked.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(ownerEmail, subject, html);
};

const sendBookingRequestToBooker = async (bookerEmail, bookerName, bookingDetails) => {
  const subject = `Booking Request Submitted: ${bookingDetails.venueName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4a90e2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .status { display: inline-block; padding: 6px 12px; background: #ffc107; color: #333; border-radius: 4px; font-weight: bold; }
        .button { display: inline-block; padding: 12px 24px; background: #4a90e2; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Request Submitted</h1>
        </div>
        <div class="content">
          <p>Hi ${bookerName},</p>
          <p>Your booking request for <strong>${bookingDetails.venueName}</strong> has been submitted successfully!</p>
          <div class="booking-info">
            <div class="info-row"><span class="label">Venue:</span> ${bookingDetails.venueName}</div>
            <div class="info-row"><span class="label">Start Date:</span> ${new Date(bookingDetails.startDate).toLocaleString('en-ZA')}</div>
            <div class="info-row"><span class="label">End Date:</span> ${new Date(bookingDetails.endDate).toLocaleString('en-ZA')}</div>
            <div class="info-row"><span class="label">Total Price:</span> R${parseFloat(bookingDetails.totalPrice).toFixed(2)}</div>
            <div class="info-row"><span class="label">Status:</span> <span class="status">Pending Approval</span></div>
          </div>
          <p>The venue owner will review your request and notify you of their decision. You'll receive an email once they respond.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" class="button">View My Bookings</a>
          <p>Best regards,<br>The Church Venue Team</p>
        </div>
        <div class="footer">
          <p>This email was sent by Church Venue. You're receiving this because you submitted a booking request.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(bookerEmail, subject, html);
};

const sendBookingApproval = async (bookerEmail, bookerName, bookingDetails) => {
  const subject = `Booking Approved: ${bookingDetails.venueName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .status { display: inline-block; padding: 6px 12px; background: #28a745; color: white; border-radius: 4px; font-weight: bold; }
        .button { display: inline-block; padding: 12px 24px; background: #4a90e2; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Approved!</h1>
        </div>
        <div class="content">
          <p>Hi ${bookerName},</p>
          <p>Great news! Your booking request for <strong>${bookingDetails.venueName}</strong> has been approved!</p>
          <div class="booking-info">
            <div class="info-row"><span class="label">Venue:</span> ${bookingDetails.venueName}</div>
            <div class="info-row"><span class="label">Start Date:</span> ${new Date(bookingDetails.startDate).toLocaleString('en-ZA')}</div>
            <div class="info-row"><span class="label">End Date:</span> ${new Date(bookingDetails.endDate).toLocaleString('en-ZA')}</div>
            <div class="info-row"><span class="label">Total Price:</span> R${parseFloat(bookingDetails.totalPrice).toFixed(2)}</div>
            <div class="info-row"><span class="label">Status:</span> <span class="status">Approved</span></div>
          </div>
          <p>Your booking is confirmed! Please contact the venue owner if you have any questions or special requirements.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bookings" class="button">View Booking Details</a>
          <p>Best regards,<br>The Church Venue Team</p>
        </div>
        <div class="footer">
          <p>This email was sent by Church Venue. You're receiving this because your booking was approved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(bookerEmail, subject, html);
};

const sendBookingRejection = async (bookerEmail, bookerName, bookingDetails) => {
  const subject = `Booking Request: ${bookingDetails.venueName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .status { display: inline-block; padding: 6px 12px; background: #dc3545; color: white; border-radius: 4px; font-weight: bold; }
        .button { display: inline-block; padding: 12px 24px; background: #4a90e2; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Request Update</h1>
        </div>
        <div class="content">
          <p>Hi ${bookerName},</p>
          <p>We're sorry to inform you that your booking request for <strong>${bookingDetails.venueName}</strong> was not approved at this time.</p>
          <div class="booking-info">
            <div class="info-row"><span class="label">Venue:</span> ${bookingDetails.venueName}</div>
            <div class="info-row"><span class="label">Requested Date:</span> ${new Date(bookingDetails.startDate).toLocaleString('en-ZA')}</div>
            <div class="info-row"><span class="label">Status:</span> <span class="status">Rejected</span></div>
          </div>
          <p>Don't worry! You can search for other available venues that might suit your needs.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/venues" class="button">Browse Other Venues</a>
          <p>Best regards,<br>The Church Venue Team</p>
        </div>
        <div class="footer">
          <p>This email was sent by Church Venue. You're receiving this because your booking request was updated.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(bookerEmail, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingRequestToOwner,
  sendBookingRequestToBooker,
  sendBookingApproval,
  sendBookingRejection
};


