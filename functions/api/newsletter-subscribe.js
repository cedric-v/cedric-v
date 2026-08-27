import { ensureContact, updateContactData, sendEmail } from '../utils/mailjet.js';
import { createConfirmationToken } from '../utils/newsletter-token.js';
import { confirmationEmail } from '../utils/newsletter-emails.js';
import { optinNotification } from '../utils/admin-notification.js';

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function clientError(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  try { return new URL(origin).origin !== new URL(request.url).origin; } catch { return true; }
}

async function checkTurnstile(request, token, env) {
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
  return result.success === true && result.action === 'newsletter-subscribe' &&
    (!result.hostname || result.hostname.toLowerCase() === expectedHostname);
}

function rateLimitKeys(request, email) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  return [`newsletter:ip:${ip}`, `newsletter:email:${email}`];
}

async function rateLimitHit(request, env, email) {
  if (!env.NEWSLETTER_KV) return false;
  for (const key of rateLimitKeys(request, email)) {
    if (await env.NEWSLETTER_KV.get(key)) return true;
  }
  return false;
}

async function markRateLimit(request, env, email) {
  if (!env.NEWSLETTER_KV) return;
  await Promise.all(rateLimitKeys(request, email).map(
    (key) => env.NEWSLETTER_KV.put(key, '1', { expirationTtl: 3600 }),
  ));
}

// Un échec serveur (Mailjet indisponible, etc.) ne doit pas verrouiller
// l'utilisateur pendant une heure : on libère le quota consommé.
async function clearRateLimit(request, env, email) {
  if (!env.NEWSLETTER_KV) return;
  await Promise.all(rateLimitKeys(request, email).map((key) => env.NEWSLETTER_KV.delete(key)));
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (clientError(request)) return json({ success: false, error: 'origin_not_allowed' }, 403);

  let data;
  try { data = await request.json(); } catch { return json({ success: false, error: 'invalid_request' }, 400); }

  const email = String(data.email || '').trim().toLowerCase();
  const firstname = String(data.firstname || '').trim().slice(0, 80);
  const locale = data.locale === 'en' ? 'en' : 'fr';
  const source = String(data.source || 'newsletter_site').slice(0, 80);
  // Le double opt-in constitue la confirmation explicite de l’inscription.
  // Les offres ponctuelles font partie de la promesse unique de cette newsletter.
  const promotionsConsent = true;

  // A filled honeypot is treated as a successful response to avoid teaching bots.
  if (String(data.website || '').trim()) return json({ success: true });
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false, error: 'invalid_request' }, 400);
  }
  if (Number(data.started_at) && Date.now() - Number(data.started_at) < 1500) {
    return json({ success: false, error: 'invalid_request' }, 400);
  }

  try {
    if (await rateLimitHit(request, env, email)) return json({ success: false, error: 'rate_limited' }, 429);
    if (!(await checkTurnstile(request, data.turnstile_token, env))) {
      // Tentative de bot : le quota reste consommé volontairement.
      await markRateLimit(request, env, email);
      return json({ success: false, error: 'bot_check_failed' }, 400);
    }
    await markRateLimit(request, env, email);

    const createdAt = Date.now();
    const token = await createConfirmationToken({
      email,
      firstname,
      locale,
      promotions: promotionsConsent,
      source,
      created_at: createdAt,
    }, env.NEWSLETTER_CONFIRM_SECRET);

    const siteUrl = env.SITE_URL || new URL(request.url).origin;
    await ensureContact(env, email, firstname);
    await updateContactData(env, email, {
      prenom: firstname,
      firstname,
      type_optin: 'newsletter',
      statut_consentement: 'en_attente',
      statut_double_optin: 'en_attente',
      langue_source: locale,
      source_optin: source,
      interets_declares: promotionsConsent ? 'editorial,promotions' : 'editorial',
      date_optin: new Date(createdAt).toISOString(),
    });

    const mail = confirmationEmail({
      firstname,
      locale,
      confirmUrl: `${siteUrl}/api/newsletter-confirm?token=${encodeURIComponent(token)}`,
    });
    await sendEmail(env, { to: email, replyTo: env.MAILJET_REPLY_TO_EMAIL || env.CONTACT_TO_EMAIL, ...mail });
    // Notification admin pour chaque nouvel opt-in (cf. fluance-io/adminAlerts).
    // Un échec de notification ne doit pas faire échouer l’inscription.
    try {
      await sendEmail(env, {
        to: env.CONTACT_TO_EMAIL || env.MAILJET_REPLY_TO_EMAIL,
        ...optinNotification({ email, firstname, locale, source, date: new Date(createdAt).toISOString() }),
      });
    } catch (notificationError) {
      console.error('[newsletter-subscribe] notification admin', notificationError.message);
    }
    return json({ success: true });
  } catch (error) {
    console.error('[newsletter-subscribe]', error.status ? `HTTP ${error.status}` : '', error.message);
    await clearRateLimit(request, env, email);
    const configuration = /CONFIGURATION_MISSING|SECRET_MISSING/.test(error.message);
    return json({ success: false, error: configuration ? 'configuration_missing' : 'server_error' }, configuration ? 503 : 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return json({ success: false, error: 'method_not_allowed' }, 405);
  return onRequestPost(context);
}
