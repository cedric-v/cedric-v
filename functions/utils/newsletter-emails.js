import { escapeHtml } from './mailjet.js';

const SITE_URL = 'https://cedricv.com';

function shell(title, body, cta = '', locale = 'fr') {
  const footer = locale === 'en'
    ? 'You are receiving this email because you asked to follow Cédric’s updates. You can unsubscribe at any time from each email.'
    : 'Vous recevez ce message parce que vous avez demandé à suivre les partages de Cédric. Vous pourrez vous désinscrire à tout moment depuis chaque e-mail.';
  return `<!doctype html><html lang="${locale}"><body style="margin:0;background:#fdfaf6;color:#1f1f1f;font-family:Arial,sans-serif;line-height:1.6"><div style="max-width:600px;margin:0 auto;padding:36px 24px"><p style="color:#0A6BCE;font-weight:bold">Fluance Pro</p><h1 style="color:#0f172a;font-size:26px;line-height:1.25">${title}</h1>${body}${cta}<p style="margin-top:36px;color:#64748b;font-size:12px">${footer}</p></div></body></html>`;
}

export function confirmationEmail({ firstname, confirmUrl, locale }) {
  const name = firstname ? ` ${escapeHtml(firstname)}` : '';
  if (locale === 'en') {
    return {
      subject: 'Please confirm your subscription to Cédric’s letter',
      html: shell('One last step', `<p>Hello${name},</p><p>Please confirm your subscription to receive Cédric’s new articles, reflections and the occasional invitation.</p>`, `<p style="margin:28px 0"><a href="${confirmUrl}" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Confirm my subscription</a></p><p style="font-size:13px;color:#64748b">This link is valid for 7 days.</p>`, 'en'),
      text: `Hello${name},\n\nConfirm your subscription to Cédric’s letter: ${confirmUrl}\n\nThis link is valid for 7 days.`,
    };
  }
  return {
    subject: 'Confirmez votre inscription à la lettre de Cédric',
    html: shell('Encore une étape', `<p>Bonjour${name},</p><p>Confirmez votre inscription pour recevoir les nouveaux articles, réflexions et invitations ponctuelles de Cédric.</p>`, `<p style="margin:28px 0"><a href="${confirmUrl}" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Confirmer mon inscription</a></p><p style="font-size:13px;color:#64748b">Ce lien est valable 7 jours.</p>`, 'fr'),
    text: `Bonjour${name},\n\nConfirmez votre inscription à la lettre de Cédric : ${confirmUrl}\n\nCe lien est valable 7 jours.`,
  };
}

export function welcomeEmail({ firstname, locale, promotions }) {
  const name = firstname ? ` ${escapeHtml(firstname)}` : '';
  if (locale === 'en') {
    return {
      subject: 'Welcome to Cédric’s letter',
      html: shell('Welcome', `<p>Hello${name},</p><p>Your subscription is confirmed. I’ll share practical reflections about clarity, focus and building a simpler business, at a measured pace.</p><p>Start with the <a href="${SITE_URL}/en/blog/" style="color:#0A6BCE">latest articles on the blog</a>.</p>${promotions ? '<p>You will also hear about occasional Fluance Pro invitations and offers.</p>' : ''}`, `<p style="margin:28px 0"><a href="${SITE_URL}/en/accompagnement/individuel/" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Discover individual coaching</a></p>`, 'en'),
      text: `Hello${name},\n\nYour subscription is confirmed. Explore the latest articles: ${SITE_URL}/en/blog/\n\nDiscover individual coaching: ${SITE_URL}/en/accompagnement/individuel/`,
    };
  }
  return {
    subject: 'Bienvenue dans la lettre de Cédric',
    html: shell('Bienvenue', `<p>Bonjour${name},</p><p>Votre inscription est confirmée. Je partagerai avec vous des réflexions concrètes sur la clarté, le focus et une activité plus simple, à un rythme mesuré.</p><p>Pour commencer, découvrez les <a href="${SITE_URL}/blog/" style="color:#0A6BCE">derniers articles du blog</a>.</p>${promotions ? '<p>Vous recevrez également les invitations et offres ponctuelles de Fluance Pro.</p>' : ''}`, `<p style="margin:28px 0"><a href="${SITE_URL}/accompagnement/individuel/" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Découvrir l’accompagnement individuel</a></p>`, 'fr'),
    text: `Bonjour${name},\n\nVotre inscription est confirmée. Découvrez les derniers articles : ${SITE_URL}/blog/\n\nDécouvrir l’accompagnement individuel : ${SITE_URL}/accompagnement/individuel/`,
  };
}
