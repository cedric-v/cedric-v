// Ping quotidien de /api/newsletter-remind : toute la logique de relance
// vit dans la Pages Function (functions/api/newsletter-remind.js). Ce Worker
// n'est qu'un déclencheur fiable (Cloudflare Cron Trigger), en remplacement
// du cron GitHub Actions (désactivé après 60 jours d'inactivité du dépôt).

// Alerte e-mail en cas d'échec du cron — même logique que fluance-io
// (functions/services/adminAlerts.js). Canal indépendant de Pages : si
// l'endpoint est down, l'alerte part quand même via Mailjet.
// Secrets requis : MAILJET_API_KEY, MAILJET_API_SECRET (valeurs identiques
// à celles du projet Pages). Variables non secrètes dans wrangler.toml.
async function alertFailure(env, subject, detail) {
  try {
    if (!env.MAILJET_API_KEY || !env.MAILJET_API_SECRET || !env.ALERT_FROM_EMAIL || !env.ALERT_TO_EMAIL) {
      console.error('[newsletter-remind] alerte impossible : secrets Mailjet absents du Worker');
      return;
    }
    await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${env.MAILJET_API_KEY}:${env.MAILJET_API_SECRET}`)}`,
      },
      body: JSON.stringify({
        Messages: [{
          From: { Email: env.ALERT_FROM_EMAIL, Name: 'CedricV Alert System' },
          To: [{ Email: env.ALERT_TO_EMAIL }],
          Subject: subject,
          TextPart: detail,
        }],
      }),
    });
  } catch (alertError) {
    // On ne masque jamais l'erreur d'origine derrière un échec d'alerte.
    console.error('[newsletter-remind] envoi de l\'alerte échoué', alertError.message);
  }
}

export default {
  async scheduled(controller, env, ctx) {
    let response;
    try {
      response = await fetch('https://cedricv.com/api/newsletter-remind', {
        headers: { Authorization: `Bearer ${env.NEWSLETTER_REMIND_KEY}` },
      });
    } catch (fetchError) {
      await alertFailure(env, '🚨 Cron newsletter-remind : endpoint injoignable',
        `Le cron n'a pas pu joindre https://cedricv.com/api/newsletter-remind :\n${fetchError.message}`);
      throw fetchError;
    }
    const body = await response.text();
    console.log('[newsletter-remind] HTTP', response.status, body.slice(0, 500));
    if (!response.ok) {
      await alertFailure(env, `🚨 Cron newsletter-remind : HTTP ${response.status}`,
        `L'endpoint /api/newsletter-remind a répondu HTTP ${response.status} :\n${body.slice(0, 1000)}`);
      throw new Error(`newsletter-remind a répondu HTTP ${response.status}`);
    }
  },
};
