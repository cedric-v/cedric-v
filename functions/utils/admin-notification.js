import { escapeHtml } from './mailjet.js';

// Notification admin — même logique que fluance-io (functions/services/adminAlerts.js) :
// chaque nouvel opt-in newsletter est signalé à la boîte principale.
// L'e-mail part depuis l'expéditeur vérifié du site vers CONTACT_TO_EMAIL.

export function optinNotification({ email, firstname, locale, source, date }) {
  const rows = [
    ['E-mail', escapeHtml(email)],
    ['Prénom', firstname ? escapeHtml(firstname) : '—'],
    ['Langue', locale === 'en' ? 'EN' : 'FR'],
    ['Source', escapeHtml(source || 'newsletter_site')],
    ['Date', date || new Date().toISOString()],
  ];
  const table = rows.map(([label, value]) =>
    `<tr><td style="padding:6px 14px;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 14px;color:#0f172a;font-size:14px;font-weight:bold">${value}</td></tr>`,
  ).join('');
  const subject = `🔔 Nouvel opt-in newsletter — ${email}`;
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#fdfaf6;color:#1f1f1f;font-family:Arial,sans-serif;line-height:1.6"><div style="max-width:600px;margin:0 auto;padding:36px 24px"><p style="color:#0A6BCE;font-weight:bold">Fluance Pro</p><h1 style="color:#0f172a;font-size:24px;line-height:1.25">Nouvel opt-in newsletter</h1><p>Une nouvelle inscription (double opt-in à confirmer) vient d’être enregistrée sur le site.</p><table style="border-collapse:collapse;background:#ffffff;border:1px solid #e2e8f0;margin:20px 0">${table}</table><p style="color:#64748b;font-size:12px">Notification automatique — cedricv.com</p></div></body></html>`;
  const text = [
    'Nouvel opt-in newsletter',
    '',
    `E-mail : ${email}`,
    `Prénom : ${firstname || '—'}`,
    `Langue : ${locale === 'en' ? 'EN' : 'FR'}`,
    `Source : ${source || 'newsletter_site'}`,
    `Date : ${date || new Date().toISOString()}`,
    '',
    'Notification automatique — cedricv.com',
  ].join('\n');
  return { subject, html, text };
}
