# Formulaire de contact — Resend

Le formulaire de `/contact/` utilise la Cloudflare Pages Function `functions/api/contact.js`. La clé Resend reste côté serveur.

## Variables Cloudflare Pages

- `RESEND_FROM_EMAIL` : expéditeur vérifié dans Resend, par exemple `contact@cedricv.com`
- `CONTACT_TO_EMAIL` : adresse qui reçoit les demandes, par exemple `support@fluance.io`
- `RESEND_API_KEY` : secret Resend

La clé publique et le secret Cloudflare Turnstile sont également nécessaires : `TURNSTILE_SITE_KEY` et `TURNSTILE_SECRET_KEY`.

## Parcours

- L’utilisateur choisit son contexte : indépendant·e, TPE/PME ou question générale.
- La notification est envoyée à `CONTACT_TO_EMAIL` avec l’adresse du visiteur en `Reply-To`.
- Un accusé de réception est envoyé au visiteur.
- Un honeypot, un délai minimal, Turnstile et un rate-limit KV optionnel protègent le formulaire.

Si un domaine d’envoi Resend n’est pas encore vérifié, utiliser temporairement l’adresse de test autorisée par Resend, puis la remplacer avant la production.
