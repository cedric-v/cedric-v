# Guide de déploiement en production

Ce document décrit les étapes pour déployer le site en production.

## 🚀 Pipeline de déploiement

Le site est **buildé et testé dans GitHub Actions**, puis **déployé sur Cloudflare Pages** à l'edge du CDN.

```
Push sur main → GitHub Actions (build + smoke tests) → Cloudflare Pages (edge)
```

### Architecture actuelle

| Couche | Technologie |
|---|---|
| Build & tests | GitHub Actions (`.github/workflows/deploy.yml`) |
| Hébergement | Cloudflare Pages (edge CDN) |
| DNS | Cloudflare (proxy orange activé) |
| Redirects | `_redirects` supporté nativement au niveau edge |

### Avantages de Cloudflare Pages vs GitHub Pages

- **`_redirects`** supporté nativement à l'edge (301/302 HTTP réels, pas de JS client-side)
- **Rollback** en 1 clic dans le dashboard Cloudflare
- **Branch previews** automatiques sur chaque PR
- **TTFB réduit** (pas de round-trip vers GitHub backend)
- **Cache edge** configurable par page/pattern

---

## 🚀 Étapes de déploiement

### Option A : Déploiement automatique via GitHub Actions (Recommandé)

Le workflow est configuré dans `.github/workflows/deploy.yml`.

#### 1. Vérifier la configuration Cloudflare Pages

1. Allez sur [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
2. Sélectionnez le projet **cedric-v**
3. Vérifiez que le **custom domain** `cedricv.com` est bien attaché
4. Le projet doit être en mode **Direct Upload** (pas connecté à Git — c'est GitHub Actions qui déploie via Wrangler)

#### 2. Vérifier les secrets GitHub

Les secrets suivants doivent être définis dans le dépôt GitHub :

| Secret | Rôle |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Token API avec permission `Cloudflare Pages:Edit` |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID du compte Cloudflare |

#### 3. Déclencher le déploiement

**Méthode 1 : Push automatique**
```bash
git add .
git commit -m "Mise à jour"
git push origin main
```

**Méthode 2 : Déclenchement manuel**
1. Allez sur **Actions** dans votre dépôt GitHub
2. Sélectionnez le workflow **"Build and Deploy"**
3. Cliquez sur **"Run workflow"** → **"Run workflow"**

#### 4. Pipeline jobs

| Job | Description | Bloque le déploiement ? |
|---|---|---|
| `build` | Installe les dépendances, build Eleventy, vérifie les fichiers critiques | Oui |
| `smoke-test` | Teste le site sur un serveur local (200, 404, contenu HTML) | Oui |
| `validate` | Lighthouse + W3C HTML (uniquement sur déclenchement manuel avec `run_validations=true`) | Non |
| `deploy` | Déploie `_site/` sur Cloudflare Pages via Wrangler | N/A |
| `post-deploy` | Vérifie l'accessibilité du site en production sur `https://cedricv.com/` | Information |

#### 5. Consulter les rapports de validation

1. Allez sur **Actions** → Dernière exécution du workflow
2. Cliquez sur le job **"validate"** (si déclenché)
3. Téléchargez l'artefact **"validation-reports"**
4. Consultez les rapports Lighthouse et W3C

---

### Option B : Déploiement manuel (Wrangler CLI)

#### 1. Installer Wrangler

```bash
npm install -g wrangler
```

#### 2. Construire le site

```bash
ELEVENTY_ENV=prod npm run build
```

#### 3. Déployer

```bash
wrangler pages deploy _site --project-name=cedric-v
```

---

### Option C : Déploiement sur d'autres plateformes

**Sur Netlify :**
1. Connectez votre dépôt GitHub à Netlify
2. Configurez :
   - **Build command** : `ELEVENTY_ENV=prod npm run build`
   - **Publish directory** : `_site`
   - **Environment variables** : `ELEVENTY_ENV=prod`

**Sur Vercel :**
1. Connectez votre dépôt GitHub à Vercel
2. Configurez :
   - **Build Command** : `ELEVENTY_ENV=prod npm run build`
   - **Output Directory** : `_site`
   - **Environment Variable** : `ELEVENTY_ENV=prod`

**Sur un serveur (SSH/SFTP) :**
```bash
rsync -avz --delete _site/ user@server:/path/to/www/
```

---

## 🔧 Variables d'environnement

### En développement
```bash
ELEVENTY_ENV=dev npm start
```
- `PATH_PREFIX = ""` (pas de préfixe)
- Pas de minification HTML
- CSS non minifié

### En production
```bash
ELEVENTY_ENV=prod npm run build
```
- `PATH_PREFIX = ""` sur la configuration actuelle
- HTML minifié
- CSS minifié
- Optimisations activées

---

## ✅ Checklist avant déploiement

- [ ] Tester le build localement : `ELEVENTY_ENV=prod npm run build`
- [ ] Vérifier que tous les fichiers sont générés dans `_site/`
- [ ] Vérifier que `_site/_redirects` est présent (critère SEO)
- [ ] Vérifier que les endpoints `_site/.well-known/` existent
- [ ] Tester le site localement avec un serveur HTTP :
  ```bash
  cd _site
  python3 -m http.server 8080
  # Visiter http://localhost:8080/
  ```
- [ ] Vérifier que les images et assets sont accessibles
- [ ] Vérifier que les liens internes fonctionnent
- [ ] Vérifier que le sitemap est généré : `_site/sitemap.xml`

---

## 🤖 Agent discovery

Le site publie plusieurs points d'entrée pour les agents et crawlers :

- `/.well-known/api-catalog`
- `/.well-known/service-desc.json`
- `/.well-known/mcp/server-card.json`
- `/.well-known/agent-skills/index.json`
- `/.well-known/webmcp-context.json`
- `/llms.txt`
- `/docs/api/`

Cloudflare Pages sert ces fichiers sans configuration particulière.

---

## 🔎 Search Console et redirections

### `_redirects` supporté nativement par Cloudflare Pages

Contrairement à GitHub Pages, **Cloudflare Pages applique les règles de `src/_redirects` comme de vrais redirects HTTP 301/302 au niveau edge**.

Toutes les règles définies dans `src/_redirects` sont désormais actives en tant que vrais redirects HTTP :

- `/ → /fr/` (301)
- `/index.html → /fr/` (301)
- Legacy WordPress feeds, categories, tags → blog
- Anciens slugs → nouveaux slugs
- `/wp-content/*` → `/fr/`

### Recommandé : Cloudflare Bulk Redirects

Pour les redirects supplémentaires qui ne sont pas dans `src/_redirects` (domaine, protocole, `www`, sous-domaines), utiliser **Cloudflare Dashboard → Bulk Redirects** :

```text
http://www.cedricv.com/*    -> https://cedricv.com/${1}
https://www.cedricv.com/*   -> https://cedricv.com/${1}
http://cedricv.com/*        -> https://cedricv.com/${1}
```

---

## 🐛 Dépannage

### Le déploiement échoue avec "CLOUDFLARE_API_TOKEN" manquant

**Problème :** Les secrets GitHub ne sont pas configurés.

**Solution :**
1. Allez sur GitHub → Settings → Secrets and variables → Actions
2. Ajoutez `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID`
3. Relancez le workflow

### Les assets (CSS, images) ne se chargent pas

**Problème :** Le `PATH_PREFIX` n'est pas correctement appliqué.

**Solution :**
1. Vérifiez que `ELEVENTY_ENV=prod` est défini lors du build
2. Vérifiez que `PATH_PREFIX` est bien `""` pour `cedricv.com`

### Le site fonctionne en local mais pas en production

**Problème :** Les chemins relatifs ne sont pas corrects.

**Solution :**
1. Vérifiez que tous les liens utilisent le filtre `relativeUrl` :
   ```njk
   {{ '/assets/img/image.jpg' | relativeUrl }}
   ```
2. Vérifiez que le `pathPrefix` est défini dans la config Eleventy :
   ```javascript
   return {
     pathPrefix: PATH_PREFIX || "/"
   };
   ```

### Le workflow GitHub Actions échoue

**Problème :** Erreur lors du build ou du déploiement.

**Solution :**
1. Consultez les logs dans **Actions** → Dernière exécution
2. Vérifiez que les secrets `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` sont valides
3. Vérifiez que le projet Cloudflare Pages existe et que le nom correspond à `--project-name` dans le workflow
4. Vérifiez que `npm ci` s'exécute correctement
5. Vérifiez que le dossier `_site/` est bien généré

---

## 📚 Ressources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages - Redirects](https://developers.cloudflare.com/pages/platform/redirects/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Documentation Eleventy](https://www.11ty.dev/docs/)

---

## 📝 Notes importantes

1. **Ne jamais commiter le dossier `_site/`** : Il est dans `.gitignore` et généré automatiquement
2. **Toujours tester localement** avant de pousser en production
3. **Les secrets GitHub `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID`** sont requis pour le déploiement
4. **Le projet Cloudflare Pages doit exister** avant le premier déploiement (à créer dans le dashboard)
5. **Le workflow GitHub Actions** génère automatiquement des rapports Lighthouse et W3C (sur déclenchement manuel)
