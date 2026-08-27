# TODO

## Newsletter / Mailjet

- [ ] **Créer les campagnes automatisées de bienvenue dans Mailjet** (`docs/newsletter-mailjet.md`) :
  - [ ] **J+2 — « Une idée à appliquer aujourd'hui »** : réflexion courte + un lien vers un article pertinent. Aucun autre CTA.
  - [ ] **J+5 — « Quand un regard extérieur fait gagner du temps »** : expliquer la logique de l'accompagnement, avec un seul CTA vers `/accompagnement/individuel/`.
  - Cibler les contacts confirmés (`statut_double_optin=confirme`), exclure les désinscrits.
  - Configurer le Reply-To des campagnes sur `cedric@cedricv.com` (même logique que pour les mails transactionnels).
- [ ] Vérifier après déploiement que `MAILJET_REPLY_TO_EMAIL` est active côté Pages et qu'un mail de test arrive avec `Reply-To: cedric@cedricv.com`.
