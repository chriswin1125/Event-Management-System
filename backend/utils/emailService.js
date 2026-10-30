const nodemailer = require('nodemailer');

// Setup transporter
let transporter = null;

const initTransporter = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development fallback (ethereal or mock)
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('[Email Service] Using Ethereal test account:', testAccount.user);
    } catch (err) {
      console.log('[Email Service] Running in simulation/console mode.');
      transporter = null;
    }
  }
};

initTransporter();

/**
 * Send booking confirmation email
 */
const sendBookingConfirmation = async ({ to, userName, bookingId, eventTitle, eventDate, venue, quantity, tierName, totalAmount }) => {
  const mailOptions = {
    from: '"NexEvent Passes" <no-reply@nexevent.com>',
    to,
    subject: `NexEvent Pass Confirmed: ${eventTitle} (ID: ${bookingId})`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1d1d1f; border: 1px solid #d2d2d7; border-radius: 16px; overflow: hidden;">
        <div style="background: #f5f5f7; padding: 32px 24px; text-align: center; border-bottom: 1px solid #d2d2d7;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1d1d1f;">Your Event Pass is Ready</h1>
          <p style="margin: 8px 0 0; color: #6e6e73; font-size: 14px;">Booking Reference: <strong>${bookingId}</strong></p>
        </div>
        
        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; margin-top: 0;">Hi ${userName},</p>
          <p style="font-size: 15px; color: #333336; line-height: 1.5;">
            Thank you for booking with us. You're confirmed for <strong>${eventTitle}</strong>.
          </p>

          <div style="background: #f5f5f7; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #6e6e73;">Date & Time:</td>
                <td style="padding: 6px 0; font-weight: 600; text-align: right;">${new Date(eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6e6e73;">Venue:</td>
                <td style="padding: 6px 0; font-weight: 600; text-align: right;">${venue}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6e6e73;">Pass Tier:</td>
                <td style="padding: 6px 0; font-weight: 600; text-align: right;">${tierName} (Qty: ${quantity})</td>
              </tr>
              <tr style="border-top: 1px solid #d2d2d7;">
                <td style="padding: 12px 0 6px; font-size: 16px; font-weight: 600;">Total Paid:</td>
                <td style="padding: 12px 0 6px; font-size: 16px; font-weight: 600; color: #0071e3; text-align: right;">₹${totalAmount.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px; color: #6e6e73; line-height: 1.4;">
            Your digital pass is available in your User Dashboard with an encrypted QR code for contact-free entry.
          </p>
        </div>

        <div style="background: #1d1d1f; color: #86868b; text-align: center; padding: 20px; font-size: 12px;">
          <p style="margin: 0;">NexEvent — Connect • Engage • Experience</p>
        </div>
      </div>
    `,
  };

  try {
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email] Booking confirmation email dispatched to ${to}: ${info.messageId}`);
      return true;
    } else {
      console.log(`[Email Simulation] Would send email to ${to} for booking ${bookingId}`);
      return true;
    }
  } catch (err) {
    console.error('[Email Error] Failed to send email:', err.message);
    return false;
  }
};

module.exports = { sendBookingConfirmation };
