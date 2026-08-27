# Newsletter cedricv.com — configuration Mailjet

Le site utilise un compte Mailjet séparé de Fluance. Les clés Mailjet ne sont jamais envoyées au navigateur : les inscriptions passent par les Cloudflare Pages Functions dans `functions/api/`.

## Variables Cloudflare Pages

Configurer ces variables dans le projet Pages `cedric-v` (production et preview si nécessaire) :

### Variables non secrètes

- `SITE_URL=https://cedricv.com`
- `MAILJET_SENDER_NAME=Cédric Vonlanthen`
- `MAILJET_SENDER_EMAIL=cedric@e.cedricv.com` (expéditeur vérifié, domaine `e.cedricv.com`)
- `MAILJET_REPLY_TO_EMAIL=cedric@cedricv.com` (adresse de réponse des abonnés ; à défaut, `CONTACT_TO_EMAIL` est utilisée)
- `MAILJET_LIST_ID` : liste dédiée à cedricv.com
- `TURNSTILE_SITE_KEY` : clé publique Turnstile du domaine `cedricv.com`

### Secrets chiffrés

- `MAILJET_API_KEY`
- `MAILJET_API_SECRET`
- `TURNSTILE_SECRET_KEY`
- `NEWSLETTER_CONFIRM_SECRET` : valeur aléatoire longue, à conserver stable pour les liens en cours
- `NEWSLETTER_REMIND_KEY` : secret partagé entre la Pages Function `/api/newsletter-remind` et le Worker cron `cedric-v-newsletter-remind` (dépôt `worker/newsletter-remind/`, déclencheur Cloudflare Cron quotidien) qui appelle l’endpoint pour relancer les doubles opt-in non confirmés

Le déploiement copie automatiquement `functions/` vers `_site/functions/`, comme attendu par Cloudflare Pages Functions.

## Parcours d’inscription

1. Le formulaire collecte l’adresse, le prénom facultatif et un consentement unique couvrant les contenus éditoriaux et les offres ponctuelles.
2. Le serveur vérifie le honeypot, le délai minimal, Turnstile et l’origine de la requête.
3. Le contact est créé ou enrichi dans Mailjet avec `statut_double_optin=en_attente`, mais n’est ajouté à la liste qu’après confirmation. Les propriétés personnalisées (`prenom`, `type_optin`, `statut_double_optin`, `date_optin`, etc.) sont déclarées automatiquement dans les métadonnées de contact Mailjet à la première utilisation (`POST /contactmetadata`, type `str`) — voir `ensureContactMetadata` dans `functions/utils/mailjet.js`.
4. Un lien signé, valable 7 jours, est envoyé par Mailjet. Chaque inscription en attente est enregistrée dans la KV (`newsletter:pending:<email>`, TTL 8 jours).
5. **Relance unique** : si la confirmation n’arrive pas sous ~20 h, le Worker cron `cedric-v-newsletter-remind` (Cloudflare Cron Trigger, 6 h 45 UTC) appelle `/api/newsletter-remind` (protégé par `NEWSLETTER_REMIND_KEY`) qui renvoie le même lien de confirmation ; la clé est purgée après envoi, ou à 7 jours (lien expiré) sans envoi. La confirmation supprime la clé.
5. La confirmation ajoute le contact à la liste, passe le statut à `confirme` et envoie le premier message de bienvenue, contenant un lien de désinscription signé (valable 90 jours) pointant vers `/api/newsletter-unsubscribe`. La désinscription passe `IsUnsubscribed=true` dans Mailjet (trace conservée) et enregistre `date_retrait_consentement` sur le contact.
6. Après confirmation, l’utilisateur est redirigé vers `/newsletter/confirmation/` (FR) ou `/en/newsletter/confirmed/` (EN).

Ne pas importer directement le CSV dans la liste active avant la campagne de ré-engagement. Les personnes dont le consentement ne peut pas être établi devraient être invitées à se réinscrire plutôt qu’ajoutées automatiquement.

## Séquence de bienvenue à créer dans Mailjet

Le premier email est envoyé par la fonction de confirmation. Pour compléter la séquence, créer deux campagnes automatisées ciblant les contacts confirmés (`statut_double_optin=confirme`) :

1. **J+2 — Une idée à appliquer aujourd’hui** : une réflexion courte et un lien vers un article pertinent. Aucun autre CTA.
2. **J+5 — Quand un regard extérieur fait gagner du temps** : expliquer la logique de l’accompagnement, avec un seul CTA vers `/accompagnement/individuel/`.

Exclure de ces campagnes les contacts désinscrits. Les offres ponctuelles font partie de la promesse unique de la newsletter et ne sont pas proposées comme une préférence séparée.

## Popup et UX

La popup est absente de la page d’accueil, des pages d’offres, des pages de paiement, du contact et des pages légales. Sur les pages éditoriales, elle apparaît après 45 secondes et un début d’engagement (défilement ou interaction), puis reste masquée 30 jours après affichage. Escape, clic sur le fond et bouton de fermeture fonctionnent ; le focus revient à l’élément précédent.

Pour tester sans attendre 45 secondes dans le navigateur :

```js
localStorage.removeItem('cedricv_newsletter_popup_last_shown');
localStorage.removeItem('cedricv_newsletter_subscribed');
```
