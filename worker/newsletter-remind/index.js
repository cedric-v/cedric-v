// Ping quotidien de /api/newsletter-remind : toute la logique de relance
// vit dans la Pages Function (functions/api/newsletter-remind.js). Ce Worker
// n'est qu'un déclencheur fiable (Cloudflare Cron Trigger), en remplacement
// du cron GitHub Actions (désactivé après 60 jours d'inactivité du dépôt).
export default {
  async scheduled(controller, env, ctx) {
    const response = await fetch('https://cedricv.com/api/newsletter-remind', {
      headers: { Authorization: `Bearer ${env.NEWSLETTER_REMIND_KEY}` },
    });
    const body = await response.text();
    console.log('[newsletter-remind] HTTP', response.status, body.slice(0, 500));
    if (!response.ok) {
      throw new Error(`newsletter-remind a répondu HTTP ${response.status}`);
    }
  },
};
