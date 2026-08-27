import { sendEmail } from '../utils/mailjet.js';
import { reminderEmail } from '../utils/newsletter-emails.js';

// Relance des doubles opt-in non confirmés. Pages Functions ne supporte pas
// les cron triggers : un workflow GitHub Actions (newsletter-remind.yml)
// appelle cet endpoint chaque jour avec le secret NEWSLETTER_REMIND_KEY.
//
// File d'attente : clés KV `newsletter:pending:<email>` écrites à
// l'inscription (voir newsletter-subscribe.js). Une seule relance par
// opt-in : la clé est supprimée après un envoi réussi.

const PREFIX = 'newsletter:pending:';
// On laisse ~20 h au confirmé spontané avant de relancer (cron quotidien :
// l'âge effectif sera entre 20 h et ~44 h). Au-delà de 7 jours, le lien
// de confirmation expire : on purge la file sans envoyer.
const MIN_AGE_MS = 20 * 60 * 60 * 1000;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function authorized(request, env) {
  const key = String(env.NEWSLETTER_REMIND_KEY || '').trim();
  if (!key) return false;
  if (request.headers.get('Authorization') === `Bearer ${key}`) return true;
  try {
    return new URL(request.url).searchParams.get('key') === key;
  } catch {
    return false;
  }
}

async function listPendingKeys(env) {
  const names = [];
  let cursor;
  do {
    const page = await env.NEWSLETTER_KV.list({ prefix: PREFIX, cursor });
    names.push(...page.keys.map((key) => key.name));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return names;
}

async function run(request, env) {
  if (!authorized(request, env)) return json({ success: false, error: 'unauthorized' }, 403);
  if (!env.NEWSLETTER_KV) return json({ success: false, error: 'kv_missing' }, 503);
  if (!String(env.NEWSLETTER_REMIND_KEY || '').trim()) return json({ success: false, error: 'configuration_missing' }, 503);

  const now = Date.now();
  const summary = { reminded: [], skipped: 0, expired: 0, failed: [] };
  for (const name of await listPendingKeys(env)) {
    const raw = await env.NEWSLETTER_KV.get(name);
    if (!raw) { summary.skipped += 1; continue; }
    let entry;
    try { entry = JSON.parse(raw); } catch {
      await env.NEWSLETTER_KV.delete(name);
      summary.expired += 1;
      continue;
    }
    const age = now - Number(entry.created_at || 0);
    if (!entry.email || !entry.token || age < MIN_AGE_MS) { summary.skipped += 1; continue; }
    if (age > MAX_AGE_MS) {
      await env.NEWSLETTER_KV.delete(name);
      summary.expired += 1;
      continue;
    }
    const siteUrl = env.SITE_URL || new URL(request.url).origin;
    const mail = reminderEmail({
      firstname: entry.firstname,
      locale: entry.locale,
      confirmUrl: `${siteUrl}/api/newsletter-confirm?token=${encodeURIComponent(entry.token)}`,
    });
    try {
      await sendEmail(env, {
        to: entry.email,
        replyTo: env.MAILJET_REPLY_TO_EMAIL || env.CONTACT_TO_EMAIL,
        ...mail,
      });
      // Supprimée seulement après un envoi réussi : en cas d'échec Mailjet,
      // la relance sera retentée au prochain passage du cron.
      await env.NEWSLETTER_KV.delete(name);
      summary.reminded.push(entry.email);
    } catch (error) {
      console.error('[newsletter-remind]', entry.email, error.message);
      summary.failed.push({ email: entry.email, error: error.message });
    }
  }
  return json({ success: true, ...summary });
}

export async function onRequestGet(context) {
  return run(context.request, context.env);
}

export async function onRequestPost(context) {
  return run(context.request, context.env);
}

export async function onRequest(context) {
  if (context.request.method !== 'GET' && context.request.method !== 'POST') {
    return json({ success: false, error: 'method_not_allowed' }, 405);
  }
  return run(context.request, context.env);
}
