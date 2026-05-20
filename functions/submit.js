/**
 * Cloudflare Pages Function — handles the appointment request form.
 *
 * Required environment variable (set in Cloudflare Pages dashboard):
 *   RESEND_API_KEY  — get a free key at resend.com (3,000 emails/month free)
 *
 * Resend setup (one-time, ~5 min):
 *   1. resend.com → sign up → Add Domain → cosmicsmilesdental.com
 *   2. Add the DNS records Resend shows you (3 TXT records)
 *   3. Copy your API key
 *   4. Cloudflare Pages dashboard → Settings → Environment Variables → add RESEND_API_KEY
 */

const TO_EMAIL   = 'office@cosmicsmilesdental.com';
const FROM_EMAIL = 'appointments@cosmicsmilesdental.com'; // must be on a Resend-verified domain
const FROM_NAME  = 'CosmicSmiles Dental Website';

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.formData();
  } catch {
    return redirect(request, '/contact.html?error=1');
  }

  // Honeypot — bots fill this hidden field, humans don't
  if (data.get('website')) {
    return redirect(request, '/thank-you.html'); // silently discard
  }

  const firstName  = (data.get('first_name')  || '').trim();
  const lastName   = (data.get('last_name')   || '').trim();
  const phone      = (data.get('phone')       || '').trim();
  const newPatient = (data.get('new_patient') || '').trim();
  const purpose    = (data.get('purpose')     || '').trim();

  if (!firstName || !phone || !purpose) {
    return redirect(request, '/contact.html?error=missing');
  }

  const subject = `Appointment Request — ${firstName} ${lastName}`;
  const body = [
    `Name:        ${firstName} ${lastName}`,
    `Phone:       ${phone}`,
    `New Patient: ${newPatient || 'Not specified'}`,
    ``,
    `Purpose:`,
    purpose,
    ``,
    `---`,
    `Submitted via cosmicsmilesdental.com`,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to:   [TO_EMAIL],
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', res.status, err);
      return redirect(request, '/contact.html?error=send');
    }
  } catch (e) {
    console.error('Fetch error:', e);
    return redirect(request, '/contact.html?error=network');
  }

  return redirect(request, '/thank-you.html');
}

function redirect(request, path) {
  const url = new URL(request.url);
  url.pathname = path;
  url.search   = path.includes('?') ? path.split('?')[1] : '';
  return Response.redirect(`${url.origin}${path}`, 302);
}
