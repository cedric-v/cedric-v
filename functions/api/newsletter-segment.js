import { updateContactData } from '../utils/mailjet.js';
import { readConfirmationToken } from '../utils/newsletter-token.js';

// Segmentation du welcome mail : les deux CTA (« Je suis indépendant /
// entrepreneur » / « Je dirige une TPE / PME ») pointent ici. Le clic
// enregistre la propriété Mailjet `segmentation_profil` puis redirige vers
// la page de vente correspondante — même cibles que les CTA de l'accueil.
// Le token signé (action « segment », 90 jours comme le lien de
// désinscription) garantit que seul le destinataire du mail peut voter.

const TOKEN_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

const TARGETS = {
  independant: { fr: '/accompagnement/individuel/', en: '/en/accompagnement/individuel/' },
  tpe_pme: { fr: '/digital-manager/', en: '/en/digital-manager/' },
};

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const payload = await readConfirmationToken(token, env.NEWSLETTER_CONFIRM_SECRET, TOKEN_MAX_AGE_MS);
  const locale = payload?.locale === 'en' ? 'en' : 'fr';
  const siteUrl = env.SITE_URL || url.origin;
  const fallback = `${siteUrl}${locale === 'en' ? '/en/' : '/'}`;

  if (!payload || payload.action !== 'segment' || !TARGETS[payload.segment]) {
    return Response.redirect(fallback, 302);
  }

  // L'enregistrement ne doit jamais empêcher la redirection vers la page de vente.
  try {
    await updateContactData(env, payload.email, {
      segmentation_profil: payload.segment,
      date_segmentation: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[newsletter-segment]', payload.email, error.status || '', error.message);
  }

  return Response.redirect(`${siteUrl}${TARGETS[payload.segment][locale]}`, 302);
}

export async function onRequest(context) {
  if (context.request.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });
  return onRequestGet(context);
}
