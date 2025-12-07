# Guide de déploiement en production

Ce document décrit les étapes pour déployer le site en production et la configuration du `PATH_PREFIX`.

## 📋 Configuration du PATH_PREFIX

Le `PATH_PREFIX` est défini dans `eleventy.config.js` et dépend de votre méthode de déploiement :

```javascript
const PATH_PREFIX = process.env.ELEVENTY_ENV === 'prod' ? "/cedric-v" : "";
```

### Cas 1 : Déploiement sur GitHub Pages avec sous-chemin (`cedric-v.github.io/cedric-v`)

**Configuration actuelle :**
- `PATH_PREFIX = "/cedric-v"` en production
- Le site sera accessible à : `https://cedric-v.github.io/cedric-v/`

**Quand utiliser :**
- Si votre dépôt GitHub s'appelle `cedric-v` (et non `cedric-v.github.io`)
- Si vous utilisez GitHub Pages sans domaine personnalisé

### Cas 2 : Déploiement sur un domaine personnalisé (`cedricv.com`)

**Configuration à modifier :**
```javascript
const PATH_PREFIX = process.env.ELEVENTY_ENV === 'prod' ? "" : "";
```

**Quand utiliser :**
- Si vous avez configuré un domaine personnalisé (`cedricv.com`) dans GitHub Pages
- Si vous déployez sur un autre hébergeur (Netlify, Vercel, etc.) avec un domaine racine

**⚠️ Important :** Si vous changez le `PATH_PREFIX` pour un domaine personnalisé, vous devez aussi mettre à jour :
- Les URLs dans `buildOgImageUrl` (déjà configuré pour `cedricv.com`)
- Les URLs canoniques dans `base.njk` (déjà configuré pour `cedricv.com`)
- Le sitemap dans `sitemap.njk` (déjà configuré pour `cedricv.com`)

---

## 🚀 Étapes de déploiement

### Option A : Déploiement automatique via GitHub Actions (Recommandé)

Le workflow GitHub Actions est déjà configuré dans `.github/workflows/deploy.yml`.

#### 1. Vérifier la configuration GitHub Pages

1. Allez sur votre dépôt GitHub : `https://github.com/cedric-v/cedric-v`
2. Cliquez sur **Settings** → **Pages**
3. Vérifiez que :
   - **Source** est défini sur **"GitHub Actions"**
   - Le domaine personnalisé est configuré si nécessaire

#### 2. Vérifier le PATH_PREFIX dans `eleventy.config.js`

Selon votre configuration (voir section ci-dessus) :
- **GitHub Pages avec sous-chemin** : `PATH_PREFIX = "/cedric-v"`
- **Domaine personnalisé** : `PATH_PREFIX = ""`

#### 3. Déclencher le déploiement

**Méthode 1 : Push automatique**
```bash
git add .
git commit -m "Préparation déploiement production"
git push origin main
```

Le workflow GitHub Actions se déclenchera automatiquement et :
- Installera les dépendances (`npm ci`)
- Construira le site avec `ELEVENTY_ENV=prod` (`npm run build`)
- Déploiera sur GitHub Pages
- Générera des rapports de validation (Lighthouse, W3C)

**Méthode 2 : Déclenchement manuel**
1. Allez sur **Actions** dans votre dépôt GitHub
2. Sélectionnez le workflow **"Build and Deploy"**
3. Cliquez sur **"Run workflow"** → **"Run workflow"**

#### 4. Vérifier le déploiement

- Attendez la fin du workflow (environ 2-3 minutes)
- Vérifiez l'onglet **"deploy"** pour voir l'URL de déploiement
- Visitez votre site : `https://cedric-v.github.io/cedric-v/` ou `https://cedricv.com/`

#### 5. Consulter les rapports de validation

1. Allez sur **Actions** → Dernière exécution du workflow
2. Cliquez sur le job **"validate"**
3. Téléchargez l'artefact **"validation-reports"**
4. Consultez les rapports Lighthouse et W3C

---

### Option B : Déploiement manuel

#### 1. Construire le site localement

```bash
# S'assurer d'être dans le répertoire du projet
cd "/Users/cedric 1/Documents/coding/cedric-v"

# Installer les dépendances (si nécessaire)
npm install

# Construire pour la production
ELEVENTY_ENV=prod npm run build
```

Cela génère les fichiers statiques dans le dossier `_site/`.

#### 2. Vérifier le build

```bash
# Vérifier que les fichiers sont générés
ls -la _site/

# Vérifier les fichiers principaux
test -f _site/index.html && echo "✓ index.html existe"
test -f _site/fr/index.html && echo "✓ fr/index.html existe"
test -f _site/.nojekyll && echo "✓ .nojekyll existe"
```

#### 3. Déployer le contenu de `_site/`

**Sur GitHub Pages (manuel) :**
1. Créez une branche `gh-pages` :
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r _site/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```
2. Dans GitHub → Settings → Pages, définissez la source sur la branche `gh-pages`

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
# Uploader le contenu de _site/ vers votre serveur
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
- `PATH_PREFIX = "/cedric-v"` (ou `""` selon configuration)
- HTML minifié
- CSS minifié
- Optimisations activées

---

## ✅ Checklist avant déploiement

- [ ] Vérifier que `PATH_PREFIX` est correctement configuré dans `eleventy.config.js`
- [ ] Vérifier que les URLs dans `buildOgImageUrl` correspondent au domaine de production
- [ ] Vérifier que les URLs canoniques dans `base.njk` sont correctes
- [ ] Tester le build localement : `ELEVENTY_ENV=prod npm run build`
- [ ] Vérifier que tous les fichiers sont générés dans `_site/`
- [ ] Tester le site localement avec un serveur HTTP :
  ```bash
  cd _site
  python3 -m http.server 8080
  # Visiter http://localhost:8080/cedric-v/ (si PATH_PREFIX = "/cedric-v")
  ```
- [ ] Vérifier que les images et assets sont accessibles
- [ ] Vérifier que les liens internes fonctionnent
- [ ] Vérifier que le sitemap est généré : `_site/sitemap.xml`

---

## 🐛 Dépannage

### Les assets (CSS, images) ne se chargent pas

**Problème :** Le `PATH_PREFIX` n'est pas correctement appliqué.

**Solution :**
1. Vérifiez que `ELEVENTY_ENV=prod` est défini lors du build
2. Vérifiez que `PATH_PREFIX` correspond à votre configuration de déploiement
3. Inspectez les URLs dans le HTML généré dans `_site/`

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
2. Vérifiez que `npm ci` s'exécute correctement
3. Vérifiez que `ELEVENTY_ENV=prod` est défini dans le workflow
4. Vérifiez que le dossier `_site/` est bien généré

---

## 📚 Ressources

- [Documentation Eleventy - Path Prefix](https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 📝 Notes importantes

1. **Ne jamais commiter le dossier `_site/`** : Il est dans `.gitignore` et généré automatiquement
2. **Toujours tester localement** avant de pousser en production
3. **Vérifier les rapports de validation** après chaque déploiement
4. **Le workflow GitHub Actions** génère automatiquement des rapports Lighthouse et W3C
