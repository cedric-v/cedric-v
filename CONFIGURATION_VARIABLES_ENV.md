# Configuration des variables d'environnement (cedricv.com)

Ce projet utilise des variables d'environnement pour gérer les configurations sensibles comme Stripe et Firebase de manière sécurisée.

## ⚠️ IMPORTANT : Sécurité

**NE JAMAIS** commiter de clés API ou de secrets dans le code source. Utilisez exclusivement les méthodes décrites ci-dessous.

---

## Configuration pour le Frontend (Eleventy)

Ces variables sont injectées lors de la génération du site (build) et utilisées par le code JavaScript dans le navigateur.

### Étape 1 : Fichier `.env` local

À la racine du projet `cedric-v`, créez un fichier `.env` :

```bash
# Environnement (dev ou prod)
ELEVENTY_ENV=dev

# Configuration Firebase
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=fluance-protected-content.firebaseapp.com
FIREBASE_PROJECT_ID=fluance-protected-content
FIREBASE_STORAGE_BUCKET=fluance-protected-content.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=173938686776
FIREBASE_APP_ID=1:173938686776:web:891caf76098a42c3579fcd
FIREBASE_MEASUREMENT_ID=G-CWPNXDQEYR
```

### Étape 2 : Secrets GitHub (Déploiement)

Pour que ces valeurs soient présentes lors du déploiement automatique sur GitHub Pages :

1. Allez dans les **Settings** de votre dépôt GitHub.
2. Allez dans **Secrets and variables > Actions**.
3. Cliquez sur **New repository secret**.
4. Ajoutez chacune des variables listées ci-dessus.

---

## Comment le code accède aux variables

1. **Eleventy** : Le fichier `src/_data/env.js` lit les variables via `process.env` (grâce au plugin `dotenv`).
2. **Templates** : Les variables sont accessibles dans les templates Nunjucks via `{{ env.VARIABLE_NAME }}`.
3. **JavaScript** : Le layout `base.njk` peut injecter ces valeurs dans des variables globales (ex: `window.FIREBASE_CONFIG`).

---

## Maintenance et Rotation

Si vous devez changer une clé API (en cas de fuite ou de rotation prévue) :
1. Générez la nouvelle clé dans la console correspondante (Google Cloud ou Stripe).
2. Mettez à jour le fichier `.env` local.
3. Mettez à jour les **Repository Secrets** sur GitHub.
4. Redéployez le site (un simple `git push` suffit).
