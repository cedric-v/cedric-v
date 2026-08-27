import { escapeHtml } from './mailjet.js';

const SITE_URL = 'https://cedricv.com';

function shell(title, body, cta = '', locale = 'fr', unsubLink = '') {
  const unsubscribe = unsubLink
    ? (locale === 'en'
      ? ` <a href="${unsubLink}" style="color:#64748b">Unsubscribe</a>.`
      : ` <a href="${unsubLink}" style="color:#64748b">Se désinscrire</a>.`)
    : '';
  const footer = locale === 'en'
    ? `You are receiving this email because you asked to follow Cédric’s updates. You can unsubscribe at any time from each email.${unsubscribe}`
    : `Vous recevez ce message parce que vous avez demandé à suivre les partages de Cédric. Vous pourrez vous désinscrire à tout moment depuis chaque e-mail.${unsubscribe}`;
  return `<!doctype html><html lang="${locale}"><body style="margin:0;background:#fdfaf6;color:#1f1f1f;font-family:Arial,sans-serif;line-height:1.6"><div style="max-width:600px;margin:0 auto;padding:36px 24px"><p style="color:#0A6BCE;font-weight:bold">Fluance Pro</p><h1 style="color:#0f172a;font-size:26px;line-height:1.25">${title}</h1>${body}${cta}<p style="margin-top:36px;color:#64748b;font-size:12px">${footer}</p></div></body></html>`;
}

// Bénéfices de la lettre, alignés sur la page /newsletter (section « Ce que vous
// recevrez ») : un e-mail de confirmation qui donne envie d'attendre la suite,
// pas seulement de cliquer.
function benefitsList(locale) {
  const items = locale === 'en'
    ? [
      ['Reflections on clarity, focus and simplicity', 'Concrete ideas you can apply directly in your business.'],
      ['New blog articles', 'Delivered directly to your inbox, so you never miss one.'],
      ['Occasional Fluance Pro invitations and offers', 'Sparingly — only when they’re worth your attention.'],
    ]
    : [
      ['Des réflexions sur la clarté, le focus et la simplicité', 'Des idées concrètes, applicables directement dans votre activité.'],
      ['Les nouveaux articles du blog', 'Directement dans votre boîte de réception, sans rien manquer.'],
      ['Les invitations et offres ponctuelles de Fluance Pro', 'Avec parcimonie&nbsp;: uniquement quand cela vaut la peine.'],
    ];
  const rows = items.map(([title, description]) =>
    `<li style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;border:1px solid rgba(10,107,206,0.12);border-radius:10px;background:#ffffff;margin:0 0 10px"><span aria-hidden="true" style="flex:none;width:22px;height:22px;margin-top:2px;border-radius:50%;background:rgba(10,107,206,0.09);color:#0A6BCE;text-align:center;line-height:22px;font-size:13px;font-weight:bold">✓</span><span><strong style="color:#0f172a;font-size:15px">${title}</strong><br><span style="color:rgba(15,23,42,0.66);font-size:13.5px">${description}</span></span></li>`);
  return `<ul style="list-style:none;margin:20px 0 0;padding:0">${rows.join('')}</ul>`;
}

function rhythmNote(locale) {
  return locale === 'en'
    ? '<p style="margin:16px 0 0;color:rgba(15,23,42,0.62);font-size:13.5px">Indicative frequency: a few messages per month, only when I have something relevant to share. No noise, just the essentials.</p>'
    : '<p style="margin:16px 0 0;color:rgba(15,23,42,0.62);font-size:13.5px">Rythme indicatif : quelques messages par mois, uniquement lorsque j’ai quelque chose de pertinent à partager. Pas de bruit, que l’essentiel.</p>';
}

export function confirmationEmail({ firstname, confirmUrl, locale }) {
  const name = firstname ? ` ${escapeHtml(firstname)}` : '';
  if (locale === 'en') {
    return {
      subject: 'One last click to join Cédric’s letter',
      html: shell('One last step', `<p>Hello${name},</p><p>Thank you for subscribing! One last click to confirm, and here’s what you’ll receive:</p>${benefitsList('en')}${rhythmNote('en')}`, `<p style="margin:28px 0"><a href="${confirmUrl}" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Confirm my subscription</a></p><p style="font-size:13px;color:#64748b">This link is valid for 7 days.</p>`, 'en'),
      text: `Hello${name},\n\nThank you for subscribing! One last click to confirm your subscription to Cédric’s letter:\n${confirmUrl}\n\nWhat you’ll receive:\n- Reflections on clarity, focus and simplicity — concrete ideas you can apply directly.\n- New blog articles, delivered to your inbox.\n- Occasional Fluance Pro invitations and offers, sparingly.\n\nA few messages per month, only when there is something relevant to share.\n\nThis link is valid for 7 days.`,
    };
  }
  return {
    subject: 'Un dernier clic pour rejoindre la lettre de Cédric',
    html: shell('Encore une étape', `<p>Bonjour${name},</p><p>Merci pour votre inscription ! Un dernier clic pour confirmer, et voici ce que vous recevrez :</p>${benefitsList('fr')}${rhythmNote('fr')}`, `<p style="margin:28px 0"><a href="${confirmUrl}" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Confirmer mon inscription</a></p><p style="font-size:13px;color:#64748b">Ce lien est valable 7 jours.</p>`, 'fr'),
    text: `Bonjour${name},\n\nMerci pour votre inscription ! Un dernier clic pour confirmer votre inscription à la lettre de Cédric :\n${confirmUrl}\n\nCe que vous recevrez :\n- Des réflexions sur la clarté, le focus et la simplicité — des idées concrètes, applicables directement dans votre activité.\n- Les nouveaux articles du blog, directement dans votre boîte de réception.\n- Les invitations et offres ponctuelles de Fluance Pro, avec parcimonie.\n\nRythme : quelques messages par mois, uniquement lorsque j’ai quelque chose de pertinent à partager.\n\nCe lien est valable 7 jours.`,
  };
}

// Relance de confirmation : envoyée ~24 h après l'opt-in si le double opt-in
// n'a pas été confirmé (voir /api/newsletter-remind). Même promesse que la
// page /newsletter, ton plus léger, une seule relance.
export function reminderEmail({ firstname, confirmUrl, locale }) {
  const name = firstname ? ` ${escapeHtml(firstname)}` : '';
  if (locale === 'en') {
    return {
      subject: 'Your subscription is still awaiting confirmation',
      html: shell('Still one click away', `<p>Hello${name},</p><p>You recently subscribed to Cédric’s letter, but your address hasn’t been confirmed yet. Confirm to start receiving:</p>${benefitsList('en')}${rhythmNote('en')}`, `<p style="margin:28px 0"><a href="${confirmUrl}" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Confirm my subscription</a></p><p style="font-size:13px;color:#64748b">This link is valid for 7 days. Not you? Simply ignore this email and you won’t hear from us again.</p>`, 'en'),
      text: `Hello${name},\n\nYou recently subscribed to Cédric’s letter, but your address hasn’t been confirmed yet.\n\nConfirm here: ${confirmUrl}\n\nThis link is valid for 7 days. Not you? Simply ignore this email.`,
    };
  }
  return {
    subject: 'Votre inscription attend encore votre confirmation',
    html: shell('Plus qu’un clic', `<p>Bonjour${name},</p><p>Vous vous êtes récemment inscrit(e) à la lettre de Cédric, mais votre adresse n’a pas encore été confirmée. Confirmez pour commencer à recevoir :</p>${benefitsList('fr')}${rhythmNote('fr')}`, `<p style="margin:28px 0"><a href="${confirmUrl}" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Confirmer mon inscription</a></p><p style="font-size:13px;color:#64748b">Ce lien est valable 7 jours. Vous ne vous êtes pas inscrit(e)&nbsp;? Ignorez simplement ce message.</p>`, 'fr'),
    text: `Bonjour${name},\n\nVous vous êtes récemment inscrit(e) à la lettre de Cédric, mais votre adresse n’a pas encore été confirmée.\n\nConfirmez ici : ${confirmUrl}\n\nCe lien est valable 7 jours. Vous ne vous êtes pas inscrit(e) ? Ignorez simplement ce message.`,
  };
}

export function welcomeEmail({ firstname, locale, promotions, unsubUrl }) {
  const name = firstname ? ` ${escapeHtml(firstname)}` : '';
  const unsub = unsubUrl || '';
  if (locale === 'en') {
    return {
      subject: 'Welcome to Cédric’s letter',
      html: shell('Welcome', `<p>Hello${name},</p><p>Your subscription is confirmed. I’ll share practical reflections about clarity, focus and building a simpler business, at a measured pace.</p><p>Start with the <a href="${SITE_URL}/en/blog/" style="color:#0A6BCE">latest articles on the blog</a>.</p>${promotions ? '<p>You will also hear about occasional Fluance Pro invitations and offers.</p>' : ''}`, `<p style="margin:28px 0"><a href="${SITE_URL}/en/accompagnement/individuel/" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Discover individual coaching</a></p>`, 'en', unsub),
      text: `Hello${name},\n\nYour subscription is confirmed. Explore the latest articles: ${SITE_URL}/en/blog/\n\nDiscover individual coaching: ${SITE_URL}/en/accompagnement/individuel/\n\nUnsubscribe: ${unsub || '(link available in the HTML version)'}`,
    };
  }
  return {
    subject: 'Bienvenue dans la lettre de Cédric',
    html: shell('Bienvenue', `<p>Bonjour${name},</p><p>Votre inscription est confirmée. Je partagerai avec vous des réflexions concrètes sur la clarté, le focus et une activité plus simple, à un rythme mesuré.</p><p>Pour commencer, découvrez les <a href="${SITE_URL}/blog/" style="color:#0A6BCE">derniers articles du blog</a>.</p>${promotions ? '<p>Vous recevrez également les invitations et offres ponctuelles de Fluance Pro.</p>' : ''}`, `<p style="margin:28px 0"><a href="${SITE_URL}/accompagnement/individuel/" style="display:inline-block;background:#ffce2d;color:#0f172a;padding:13px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Découvrir l’accompagnement individuel</a></p>`, 'fr', unsub),
    text: `Bonjour${name},\n\nVotre inscription est confirmée. Découvrez les derniers articles : ${SITE_URL}/blog/\n\nDécouvrir l’accompagnement individuel : ${SITE_URL}/accompagnement/individuel/\n\nSe désinscrire : ${unsub || '(lien disponible dans la version HTML)'}`,
  };
}
