import { addToList, ensureContact, updateContactData, getContactData, sendEmail } from '../utils/mailjet.js';
import { createConfirmationToken, readConfirmationToken } from '../utils/newsletter-token.js';
import { welcomeEmail } from '../utils/newsletter-emails.js';

const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function redirect(context, path) {
  const url = new URL(path, context.env.SITE_URL || context.request.url);
  return Response.redirect(url.toString(), 302);
}

function errorPage(context, locale, message) {
  const title = locale === 'en' ? 'Confirmation unavailable' : 'Confirmation indisponible';
  const home = locale === 'en' ? '/en/' : '/';
  return new Response(`<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="robots" content="noindex"><title>${title}</title><body style="font-family:Arial,sans-serif;max-width:600px;margin:60px auto;padding:24px;color:#0f172a"><h1>${title}</h1><p>${message}</p><p><a href="${home}">${locale === 'en' ? 'Back to home' : 'Retour à l’accueil'}</a></p></body></html>`, {
    status: 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const token = new URL(request.url).searchParams.get('token');
  const payload = await readConfirmationToken(token, env.NEWSLETTER_CONFIRM_SECRET, TOKEN_MAX_AGE_MS);
  const locale = payload?.locale === 'en' ? 'en' : 'fr';

  // Les tokens portant une action (ex. « unsubscribe ») ne doivent jamais
  // pouvoir confirmer une inscription.
  if (!payload || payload.action) {
    const fallback = new URL(request.url).searchParams.get('locale') === 'en' ? 'en' : locale;
    return errorPage(context, fallback, fallback === 'en'
      ? 'This confirmation link is invalid or has expired. Please subscribe again.'
      : 'Ce lien de confirmation est invalide ou a expiré. Veuillez recommencer l’inscription.');
  }

  try {
    await ensureContact(env, payload.email, payload.firstname);
    const current = await getContactData(env, payload.email);
    const alreadyConfirmed = current.statut_double_optin === 'confirme';

    if (!alreadyConfirmed) {
      await addToList(env, payload.email);
      const now = new Date().toISOString();
      await updateContactData(env, payload.email, {
        prenom: payload.firstname || current.prenom || '',
        firstname: payload.firstname || current.firstname || '',
        type_optin: 'newsletter',
        statut_consentement: 'consenti',
        statut_double_optin: 'confirme',
        date_consentement: now,
        date_double_optin: now,
        langue_source: locale,
        source_optin: payload.source || current.source_optin || 'newsletter_site',
        interets_declares: payload.promotions ? 'editorial,promotions' : 'editorial',
      });

      // Lien de désinscription signé, valable 90 jours, intégré à l'e-mail
      // de bienvenue (exigence RGPD art. 7(3) : retrait aussi simple que
      // l'opt-in).
      const siteUrl = env.SITE_URL || new URL(request.url).origin;
      const unsubToken = await createConfirmationToken({
        action: 'unsubscribe',
        email: payload.email,
        locale,
        created_at: Date.now(),
      }, env.NEWSLETTER_CONFIRM_SECRET);
      const unsubUrl = `${siteUrl}/api/newsletter-unsubscribe?token=${encodeURIComponent(unsubToken)}&locale=${locale}`;
      const mail = welcomeEmail({
        firstname: payload.firstname,
        locale,
        promotions: payload.promotions === true,
        unsubUrl,
      });
      await sendEmail(env, { to: payload.email, replyTo: env.MAILJET_REPLY_TO_EMAIL || env.CONTACT_TO_EMAIL, ...mail });
    }

    // Confirmation obtenue : plus besoin de relance.
    if (env.NEWSLETTER_KV) {
      try { await env.NEWSLETTER_KV.delete(`newsletter:pending:${payload.email}`); } catch { /* best effort */ }
    }

    return redirect(context, locale === 'en' ? '/en/newsletter/confirmed/' : '/newsletter/confirmation/');
  } catch (error) {
    console.error('[newsletter-confirm]', error.message);
    return errorPage(context, locale, locale === 'en'
      ? 'We could not complete the confirmation. Please try again later.'
      : 'La confirmation n’a pas pu être finalisée. Veuillez réessayer plus tard.');
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });
  return onRequestGet(context);
}
