const nodemailer = require('nodemailer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Send contact message via Brevo SMTP
// @route   POST /api/v1/contact
// @access  Public
exports.sendContact = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return next(new ErrorResponse('All fields are required', 400));
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return next(new ErrorResponse('Please provide a valid email address', 400));
    }

    const host = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com';
    const port = parseInt(process.env.BREVO_SMTP_PORT || '587', 10);
    const user = process.env.BREVO_SMTP_USER;
    const pass = process.env.BREVO_SMTP_PASS; // Brevo uses API key as SMTP password
    const TO_EMAIL = process.env.TO_EMAIL || process.env.FROM_EMAIL;
    const FROM_EMAIL = process.env.FROM_EMAIL;
    const FROM_NAME = process.env.FROM_NAME || 'Portfolio Contact Form';

    if (!user || !pass || !FROM_EMAIL || !TO_EMAIL) {
      return next(new ErrorResponse('Email service is not configured', 500));
    }

    const debugSMTP = String(process.env.BREVO_SMTP_DEBUG || 'false').toLowerCase() === 'true';
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      logger: debugSMTP,
      debug: debugSMTP,
      requireTLS: port === 587,
    });

    // Verify SMTP connection before sending
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error('SMTP verify failed:', verifyErr?.message || verifyErr);
      return next(new ErrorResponse('Email service temporarily unavailable', 503));
    }

    // Basic HTML escaping to prevent HTML injection in the email body
    const escape = (v) => String(v || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const safe = {
      name: escape(name),
      email: escape(email),
      subject: escape(subject),
      message: escape(message),
    };

    const brandColor = '#2563EB'; // Indigo-600
    const muted = '#6b7280'; // Gray-500
    const bg = '#f5f7fb';

    const html = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>New Contact</title>
        <style>
          /* Preheader text (hidden preview line in some clients) */
          .preheader { display:none !important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all; }
        </style>
      </head>
      <body style="margin:0; padding:0; background:${bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; color:#0f172a;">
        <div class="preheader">You've got a new message from your portfolio contact form.</div>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${bg}; padding:24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background:#ffffff; border-radius:12px; box-shadow:0 2px 10px rgba(2, 6, 23, 0.06); overflow:hidden;">
                <tr>
                  <td style="background:${brandColor}; padding:20px 24px;">
                    <h1 style="margin:0; font-size:20px; line-height:1.4; color:#ffffff;">New Contact Form Submission</h1>
                    <div style="margin-top:4px; font-size:12px; color:rgba(255,255,255,0.9)">Portfolio Notification</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                      <tr>
                        <td style="padding:8px 0; width:120px; color:${muted}; font-size:14px;">Name</td>
                        <td style="padding:8px 0; font-size:14px; font-weight:600;">${safe.name}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; width:120px; color:${muted}; font-size:14px;">Email</td>
                        <td style="padding:8px 0; font-size:14px; font-weight:600;"><a href="mailto:${encodeURIComponent(email)}" style="color:${brandColor}; text-decoration:none;">${safe.email}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; width:120px; color:${muted}; font-size:14px;">Subject</td>
                        <td style="padding:8px 0; font-size:14px; font-weight:600;">${safe.subject}</td>
                      </tr>
                    </table>

                    <div style="margin:16px 0 0; color:${muted}; font-size:13px;">Message</div>
                    <div style="margin-top:6px; padding:16px; background:#f8fafc; border:1px solid #e5e7eb; border-left:4px solid ${brandColor}; border-radius:8px; white-space:pre-wrap; font-size:14px; line-height:1.6; color:#0f172a;">${safe.message}</div>

                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                      <tr>
                        <td>
                          <a href="mailto:${encodeURIComponent(email)}?subject=Re:%20${encodeURIComponent(subject)}" 
                             style="display:inline-block; background:${brandColor}; color:#ffffff; text-decoration:none; padding:10px 16px; border-radius:8px; font-size:14px; font-weight:600;">
                            Reply to ${safe.name}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 24px; background:#fafafa; color:${muted}; font-size:12px; text-align:center;">
                    You can reply directly to this email to contact the sender.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const bccSelf = String(process.env.BREVO_BCC_SELF || 'false').toLowerCase() === 'true';
    const info = await transporter.sendMail({
      from: { address: FROM_EMAIL, name: FROM_NAME },
      to: TO_EMAIL,
      ...(bccSelf ? { bcc: FROM_EMAIL } : {}),
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html,
      replyTo: { address: email, name },
    });

    console.log('SMTP send result:', {
      messageId: info?.messageId,
      response: info?.response,
      accepted: info?.accepted,
      rejected: info?.rejected,
      envelope: info?.envelope,
    });

    if (!info || !Array.isArray(info.accepted) || info.accepted.length === 0) {
      return next(new ErrorResponse('Mail server did not accept the message', 502));
    }

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Brevo SMTP send error:', err?.message || err);
    return next(new ErrorResponse('Failed to send message', 500));
  }
});
