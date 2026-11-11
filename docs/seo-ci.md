# Garde-fous SEO CI

## périmètre

Ce projet applique la doctrine SEO commune de `../../cedric-foundation/3 CAPITALISATION CONNAISSANCES/Architecture SEO des sites web.md`.

Le premier niveau de protection est en place :

- build unique ;
- artefact CI audité puis déployé ;
- audit statique bloquant ;
- manifeste versionné des routes ;
- smoke SEO sur l'artefact, la preview et la production.

## commandes

```bash
npm run build           # build + verify-hreflang + audit SEO bloquant
npm run build:unverified # build sans audit, réservé à la régénération du manifeste
npm run seo:audit       # audit du build existant
npm run seo:manifest    # régénérer scripts/seo-routes.json après vérification humaine
npm run seo:smoke -- --base-url https://cedricv.com --dist _site
```

## contrôles statiques

`scripts/seo-audit.mjs` vérifie :

- title et meta description ;
- canonical et domaine canonique ;
- `html lang` ;
- Open Graph ;
- JSON-LD syntaxiquement valide ;
- `hreflang` réciproques et `x-default` ;
- alternates HTML et sitemap identiques ;
- sitemap exactement égal aux pages indexables ;
- absence de page `noindex` dans le sitemap ;
- liens internes non cassés ;
- `robots.txt` et référence au sitemap ;
- routes retirées sans redirection.

Le validateur historique `scripts/verify-hreflang.js` reste exécuté en complément. Les descriptions dupliquées des deux articles « L'enthousiasme comme clé… » et « L'enthousiasme comme créateur de focus » ont été différenciées en FR et EN.

## CI et déploiement

`.github/workflows/deploy.yml` construit une seule fois, audite l'artefact, lance le smoke SEO local, déploie cet artefact puis relance le smoke SEO en production.

`.github/workflows/preview.yml` utilise le même build audité et lance le smoke SEO sur la preview.

## surveillance planifiée

Le workflow `.github/workflows/seo-weekly.yml` exécute chaque semaine :

- le build et l'audit statique ;
- le crawl HTTP de toutes les URL du sitemap en production ;
- les budgets Lighthouse mobiles ;
- la validation Schema.org externe ;
- le contrôle Search Console lorsque les credentials sont configurées.

Search Console utilise le secret `GSC_SERVICE_ACCOUNT_JSON_B64` et la variable `GSC_SITE_URL`. Sans credentials, le contrôle est ignoré proprement.

## reste à planifier

- crawl Discover hors sitemap ;
- remplacement du délai fixe de propagation Cloudflare ;
- rollback automatisé après validation de l'API Cloudflare ;
- centralisation des scripts SEO dans un outillage partagé.

Le détail du suivi et l'évaluation des autres sites sont consignés dans le dépôt `fluance-io`, fichier `docs/seo-follow-up.md`.
