# Formulaire de contact — Mailjet

Le formulaire de `/contact/` utilise la Cloudflare Pages Function `functions/api/contact.js`. Tout passe par l'API Mailjet : la notification et l'accusé de réception.

## Variables Cloudflare Pages

- `MAILJET_SENDER_EMAIL` : expéditeur vérifié dans Mailjet, par exemple `cedric@e.cedricv.com`
- `CONTACT_TO_EMAIL` : adresse qui reçoit les demandes, par exemple `cedric@cedricv.com`
- Secrets : `MAILJET_API_KEY`, `MAILJET_API_SECRET`
- Protection : `TURNSTILE_SITE_KEY` (publique) et `TURNSTILE_SECRET_KEY` (secrète)
- Rate-limit : binding KV `CONTACT_KV` déclaré dans `wrangler.toml` (namespace `042f6587142943499c2cd0242b4043d2`) — limite 1 message/heure par IP et par e-mail

## Parcours

- L'utilisateur choisit son contexte : indépendant·e, TPE/PME ou question générale.
- La notification est envoyée à `CONTACT_TO_EMAIL`, avec l'adresse du visiteur en `Reply-To`.
- Un accusé de réception est envoyé au visiteur (depuis la même adresse d'envoi, avec `Reply-To` vers `CONTACT_TO_EMAIL`).
- Un honeypot, un délai minimal, Turnstile et un rate-limit KV protègent le formulaire.

## Déploiement (GitHub Actions)

- Le job `deploy` du workflow effectue un `actions/checkout` **obligatoire** : Wrangler bundle les Pages Functions depuis `process.cwd()/functions`, pas depuis le dossier statique déployé. Sans checkout, les fonctions sont silencieusement ignorées et `/api/contact` renvoie 404/405.
- Secret GitHub requis : `TURNSTILE_SITE_KEY` (clé publique Turnstile, injectée dans `/assets/js/contact.js` au build). Le job `build` échoue si la clé est vide, pour éviter un formulaire sans protection anti-bot.
- Le job `post-deploy` vérifie que la fonction `/api/contact` répond en JSON (présence effective de la protection côté serveur).

## Adresses

| Usage | Adresse |
|---|---|
| Envoi (newsletter + contact) | `cedric@e.cedricv.com` |
| Réception des demandes de contact | `cedric@cedricv.com` |

Le domaine d'envoi `e.cedricv.com` doit être vérifié dans Mailjet (SPF/DKIM/DMARC). L'adresse de réception `cedric@cedricv.com` est une boîte mail classique : aucune vérification particulière.
