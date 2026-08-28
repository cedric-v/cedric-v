# TODO

## Monitoring / Infrastructure

- [ ] **Activer l’observabilité des Pages Functions** (Dashboard → cedric-v → Observability) : rétention des `console.error` (Mailjet, tokens, etc.) pour diagnostiquer un futur `server_error` sans devoir lancer un tail live.
- [ ] **Watchdog externe** (UptimeRobot ou équivalent) sur `https://cedricv.com` et idéalement `/api/newsletter-subscribe` : les smoke tests post-deploy ne couvrent que l’instant du déploiement, aucune alerte ne prévient d’une chute du site entre deux déploiements.
- [ ] **Notification Cloudflare native** pour les échecs du Worker cron (`cedric-v-newsletter-remind`) : créer une notification policy (Alerting) en complément de l’alerte e-mail déjà envoyée par le Worker lui-même.

## Newsletter / Mailjet

### À faire (séquence de bienvenue)

- [ ] **Créer les campagnes automatisées de bienvenue dans Mailjet** (`docs/newsletter-mailjet.md`) :
  - [ ] **J+2 — « Une idée à appliquer aujourd'hui »** : réflexion courte + un lien vers un article pertinent. Aucun autre CTA.
  - [ ] **J+5 — « Quand un regard extérieur fait gagner du temps »** : expliquer la logique de l'accompagnement, avec un seul CTA vers `/accompagnement/individuel/`.
  - Cibler les contacts confirmés (`statut_double_optin=confirme`), exclure les désinscrits.
  - Configurer le Reply-To des campagnes sur `cedric@cedricv.com` (même logique que pour les mails transactionnels).
- [ ] Vérifier après déploiement que `MAILJET_REPLY_TO_EMAIL` est active côté Pages et qu’un mail de test arrive avec `Reply-To: cedric@cedricv.com`.

### Améliorations futures

- [ ] **Renvoi à la demande du lien de confirmation** : endpoint « Je n’ai pas reçu l’e-mail » sur la page de confirmation (rate-limité KV, réutilise `createConfirmationToken` avec un nouveau token 7 j) pour ne pas attendre la relance automatique à ~20 h.
- [ ] **Exploiter la segmentation** (`segmentation_profil` : `independant` | `tpe_pme`) : campagnes ciblées par segment dans Mailjet, et mesurer le taux de clic sur les CTA du welcome mail (propriété remplie = clic).
- [ ] **Préférence « promotions » séparée** : le consentement est aujourd’hui unique (éditorial + offres ponctuelles) ; prévoir un centre de préférences si le volume d’offres augmente ou à la demande RGPD.
- [ ] **Relancer via un lien régénéré plutôt que réutilisé** : la relance réutilise le token initial (valable 7 j) ; si un destinataire confirme après expiration, l’erreur page invite déjà à se réinscrire — évaluer si une régénération est nécessaire.
