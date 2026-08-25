import { sendContactNotification, sendResendEmail } from '../utils/resend.js';

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function sameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]);
}

async function verifyTurnstile(request, token, env) {
  if (!env.TURNSTILE_SECRET_KEY) throw new Error('TURNSTILE_CONFIGURATION_MISSING');
  if (!token) return false;
  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: request.headers.get('CF-Connecting-IP') || undefined,
    }),
  }).then((response) => response.json());
  const expectedHostname = new URL(request.url).hostname.toLowerCase();
  return result.success === true && result.action === 'contact-form' &&
    (!result.hostname || result.hostname.toLowerCase() === expectedHostname);
}

async function rateLimited(request, env, email) {
  if (!env.CONTACT_KV) return false;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const keys = [`contact:ip:${ip}`, `contact:email:${email}`];
  for (const key of keys) {
    if (await env.CONTACT_KV.get(key)) return true;
  }
  await Promise.all(keys.map((key) => env.CONTACT_KV.put(key, '1', { expirationTtl: 3600 })));
  return false;
}

function acknowledgement({ name, locale }) {
  const greeting = locale === 'en' ? `Hello ${escapeHtml(name)},` : `Bonjour ${escapeHtml(name)},`;
  const body = locale === 'en'
    ? 'Thank you for your message. I have received it and will reply personally, usually within two business days.'
    : 'Merci pour votre message. Je l’ai bien reçu et vous répondrai personnellement, généralement sous deux jours ouvrables.';
  return {
    subject: locale === 'en' ? 'I received your message' : 'J’ai bien reçu votre message',
    html: `<!doctype html><html lang="${locale}"><body style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a"><p>${greeting}</p><p>${body}</p><p>— Cédric</p></body></html>`,
    text: `${locale === 'en' ? 'Hello' : 'Bonjour'} ${name},\n\n${body}\n\n— Cédric`,
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!sameOrigin(request)) return json({ success: false, error: 'origin_not_allowed' }, 403);

  let data;
  try { data = await request.json(); } catch { return json({ success: false, error: 'invalid_request' }, 400); }

  const name = String(data.name || '').trim().slice(0, 120);
  const email = String(data.email || '').trim().toLowerCase();
  const company = String(data.company || '').trim().slice(0, 120);
  const topic = String(data.topic || '').trim().slice(0, 80);
  const message = String(data.message || '').trim().slice(0, 5000);
  const locale = data.locale === 'en' ? 'en' : 'fr';

  // Do not reveal to automated senders that the honeypot was detected.
  if (String(data.website || '').trim()) return json({ success: true });
  if (!name || !message || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false, error: 'invalid_request' }, 400);
  }
  if (Number(data.started_at) && Date.now() - Number(data.started_at) < 1500) {
    return json({ success: false, error: 'invalid_request' }, 400);
  }

  try {
    if (await rateLimited(request, env, email)) return json({ success: false, error: 'rate_limited' }, 429);
    if (!(await verifyTurnstile(request, data.turnstile_token, env))) {
      return json({ success: false, error: 'bot_check_failed' }, 400);
    }

    await sendContactNotification(env, { name, email, company, topic, message, locale });

    // The notification is the source of truth; an acknowledgement failure must
    // not make the visitor submit the same message a second time.
    try {
      await sendResendEmail(env, {
        to: email,
        replyTo: env.CONTACT_TO_EMAIL,
        ...acknowledgement({ name, locale }),
      });
    } catch (error) {
      console.error('[contact-acknowledgement]', error.message);
    }

    return json({ success: true });
  } catch (error) {
    console.error('[contact]', error.message);
    const configuration = error.message === 'RESEND_CONFIGURATION_MISSING' ||
      error.message === 'TURNSTILE_CONFIGURATION_MISSING';
    return json({ success: false, error: configuration ? 'configuration_missing' : 'server_error' }, configuration ? 503 : 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return json({ success: false, error: 'method_not_allowed' }, 405);
  return onRequestPost(context);
}
