const { Resend } = require('resend');

let client = null;
function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

async function sendTagEmail({ to, toName, taskName, projectName, taggedByName, message, portalUrl }) {
  const resend = getClient();
  if (!resend) return { sent: false, reason: 'RESEND_API_KEY not configured' };
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Client Portal <onboarding@resend.dev>',
      to,
      subject: `${taggedByName} แท็กคุณในงาน: ${taskName}`,
      html: `
        <div style="font-family:sans-serif;font-size:14px;color:#1a2137;line-height:1.6">
          <p>สวัสดีคุณ ${toName || ''},</p>
          <p><strong>${taggedByName}</strong> แท็กคุณในงาน <strong>${taskName}</strong>${projectName ? ` (โปรเจกต์: ${projectName})` : ''}</p>
          ${message ? `<p style="background:#f4f6fb;padding:12px;border-radius:8px">${message}</p>` : ''}
          <p><a href="${portalUrl}" style="color:#4d5ff5">เปิด Client Portal</a></p>
        </div>`,
    });
    return { sent: true };
  } catch (e) {
    console.error('email send failed:', e.message);
    return { sent: false, reason: e.message };
  }
}

module.exports = { sendTagEmail };
