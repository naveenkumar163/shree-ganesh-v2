// ─────────────────────────────────────────────────────────────
// SETUP CHECKLIST (do this once before deploying):
//   1. Sign up at https://resend.com — free tier gives 100 emails/day
//   2. In Vercel project settings → Environment Variables, add:
//        RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxx   (from Resend dashboard)
//   3. Recipient email below is set to imnaveenkumar.1996@gmail.com
//      Change it if you ever use a different address.
// ─────────────────────────────────────────────────────────────

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tripType, pickup, drop, pickupTime, returnTime, car, passengers } = req.body;

  const returnRow = returnTime
    ? `<tr>
        <td style="padding:12px 16px;color:#64748b;font-size:14px;width:40%;border-bottom:1px solid #f1f5f9;">Return Date &amp; Time</td>
        <td style="padding:12px 16px;font-weight:600;color:#0D1F35;border-bottom:1px solid #f1f5f9;">🔄 ${returnTime}</td>
      </tr>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);">

    <!-- Header -->
    <div style="background:#0D1F35;padding:28px 32px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">🚖</div>
      <h1 style="margin:0;color:#ffffff;font-size:20px;letter-spacing:.3px;">New Cab Booking Request</h1>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Shree Ganesh Tour &amp; Travels · Patna, Bihar</p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:8px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 16px;color:#64748b;font-size:14px;width:40%;border-bottom:1px solid #f1f5f9;">Trip Type</td>
          <td style="padding:12px 16px;font-weight:600;color:#0D1F35;border-bottom:1px solid #f1f5f9;">🗺️ ${tripType}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Pickup Location</td>
          <td style="padding:12px 16px;font-weight:600;color:#0D1F35;border-bottom:1px solid #f1f5f9;">📍 ${pickup}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Drop Location</td>
          <td style="padding:12px 16px;font-weight:600;color:#0D1F35;border-bottom:1px solid #f1f5f9;">📍 ${drop}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Pickup Date &amp; Time</td>
          <td style="padding:12px 16px;font-weight:600;color:#0D1F35;border-bottom:1px solid #f1f5f9;">📅 ${pickupTime}</td>
        </tr>
        ${returnRow}
        <tr>
          <td style="padding:12px 16px;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">Car Selected</td>
          <td style="padding:12px 16px;font-weight:600;color:#0D1F35;border-bottom:1px solid #f1f5f9;">🚗 ${car}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;color:#64748b;font-size:14px;">Passengers</td>
          <td style="padding:12px 16px;font-weight:600;color:#0D1F35;">👥 ${passengers}</td>
        </tr>
      </table>
    </div>

    <!-- Alert banner -->
    <div style="background:#fff7ed;border-top:3px solid #E8650A;padding:16px 24px;">
      <p style="margin:0;color:#9a3412;font-size:14px;">⚡ <strong>Action needed:</strong> Confirm availability and fare with the customer as soon as possible.</p>
    </div>

    <!-- Footer -->
    <div style="background:#0D1F35;padding:16px 24px;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Shree Ganesh Tour &amp; Travels · +91 92884 27458 · Patna, Bihar 800011</p>
    </div>

  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'Booking <onboarding@resend.dev>',
      to: 'nkuma.021996@gmail.com',
      subject: '🚖 New Cab Booking - Shree Ganesh',
      html,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email notification' });
  }
}
