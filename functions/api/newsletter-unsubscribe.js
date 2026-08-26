import { ensureContact, unsubscribeFromList, updateContactData } from '../utils/mailjet.js';
import { readConfirmationToken } from '../utils/newsletter-token.js';

// Le lien de désinscription reste valable 90 jours (les e-mails de bienvenue
// peuvent être rouverts longtemps après l'envoi).
const TOKEN_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

function page(context, locale, title, message) {
  const home = locale === 'en' ? '/en/' : '/';
  return new Response(`<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="robots" content="noindex"><title>${title}</title><body style="font-family:Arial,sans-serif;max-width:600px;margin:60px auto;padding:24px;color:#0f172a"><h1>${title}</h1><p>${message}</p><p><a href="${home}">${locale === 'en' ? 'Back to home' : 'Retour à l’accueil'}</a></p></body></html>`, {
    status: context.status || 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const locale = new URL(request.url).searchParams.get('locale') === 'en' ? 'en' : 'fr';
  try {
    const token = new URL(request.url).searchParams.get('token');
    const payload = await readConfirmationToken(token, env.NEWSLETTER_CONFIRM_SECRET, TOKEN_MAX_AGE_MS);
    if (!payload || payload.action !== 'unsubscribe' || !payload.email) {
      return page(context, locale,
        locale === 'en' ? 'Invalid link' : 'Lien invalide',
        locale === 'en'
          ? 'This unsubscription link is invalid or has expired. Please contact us to be removed from the newsletter.'
          : 'Ce lien de désinscription est invalide ou a expiré. Contactez-nous pour être retiré de la newsletter.');
    }

    await ensureContact(env, payload.email);
    await unsubscribeFromList(env, payload.email);
    await updateContactData(env, payload.email, {
      statut_consentement: 'retire',
      statut_double_optin: 'desabonne',
      date_retrait_consentement: new Date().toISOString(),
    });

    return page(context, locale,
      locale === 'en' ? 'You are unsubscribed' : 'Vous êtes désinscrit',
      locale === 'en'
        ? 'Your email address has been removed from Cédric’s letter. You will not receive any further emails.'
        : 'Votre adresse e-mail a été retirée de la lettre de Cédric. Vous ne recevrez plus aucun message.');
  } catch (error) {
    console.error('[newsletter-unsubscribe]', error.message);
    return page(context, locale,
      locale === 'en' ? 'Unsubscription unavailable' : 'Désinscription indisponible',
      locale === 'en'
        ? 'We could not process your unsubscription. Please try again later.'
        : 'La désinscription n’a pas pu être traitée. Veuillez réessayer plus tard.');
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'GET') {
    return new Response(localeSafeMethodError(context), { status: 405, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  return onRequestGet(context);
}

function localeSafeMethodError(context) {
  const locale = new URL(context.request.url).searchParams.get('locale') === 'en' ? 'en' : 'fr';
  return locale === 'en' ? 'Method Not Allowed' : 'Méthode non autorisée';
}
