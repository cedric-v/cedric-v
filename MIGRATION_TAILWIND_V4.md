# Plan de Migration Tailwind CSS v3 → v4

**Date de création :** 2025-01-27  
**Version cible :** Tailwind CSS 4.1.17  
**Version actuelle :** Tailwind CSS 3.4.18

---

## 📋 Vue d'ensemble

Cette migration apportera :
- **Performance :** Builds 3.5-5x plus rapides, builds incrémentaux 8-100x plus rapides
- **Bundles plus petits :** CSS de production optimisé
- **Configuration simplifiée :** Approche CSS-first avec variables natives
- **Fonctionnalités modernes :** Cascade layers, CSS nesting, container queries

**Estimation du temps :** 2-4 heures  
**Risque :** Moyen (breaking changes nécessitent des modifications de code)

---

## 🔍 Audit pré-migration

### Classes à remplacer identifiées

#### 1. `flex-shrink-*` → `shrink-*`
**Fichiers affectés :**
- `src/fr/rdv/clarte.md` (4 occurrences)
- `src/en/rdv/clarte.md` (4 occurrences)
- `src/en/confirmation.md` (2 occurrences)
- `src/fr/confirmation.md` (2 occurrences)

**Remplacement :**
- `flex-shrink-0` → `shrink-0`

#### 2. Classes `shadow-*` (à vérifier)
Les classes suivantes sont utilisées et doivent être vérifiées :
- `shadow-md` → reste `shadow-md` (pas de changement)
- `shadow-xl` → reste `shadow-xl` (pas de changement)
- `shadow-2xl` → reste `shadow-2xl` (pas de changement)
- `shadow-lg` → reste `shadow-lg` (pas de changement)

**Note :** Les classes `shadow-sm` et `shadow` seraient renommées, mais elles ne sont pas utilisées dans votre projet.

#### 3. Classes `rounded-*` (à vérifier)
- `rounded-lg` → reste `rounded-lg` (pas de changement)
- `rounded-full` → reste `rounded-full` (pas de changement)
- `rounded-r-lg` → reste `rounded-r-lg` (pas de changement)

**Note :** Les classes `rounded-sm` et `rounded` seraient renommées, mais elles ne sont pas utilisées.

---

## 📝 Étapes de migration

### Étape 1 : Préparation et sauvegarde

```bash
# 1. Créer une branche de migration
git checkout -b migration/tailwind-v4

# 2. Vérifier que tout fonctionne actuellement
npm run build
npm start  # Tester en dev

# 3. Commit de l'état actuel (optionnel mais recommandé)
git add .
git commit -m "État avant migration Tailwind v4"
```

**✅ Checklist :**
- [ ] Branche créée
- [ ] Build de production fonctionne
- [ ] Site testé en local

---

### Étape 2 : Mise à jour des dépendances

```bash
# Installer Tailwind CSS v4 et le nouveau plugin PostCSS
npm install -D tailwindcss@latest @tailwindcss/postcss@latest

# Vérifier les versions installées
npm list tailwindcss @tailwindcss/postcss
```

**Fichiers modifiés :**
- `package.json`
- `package-lock.json`

**✅ Checklist :**
- [ ] Tailwind CSS v4 installé
- [ ] Plugin PostCSS installé
- [ ] Versions vérifiées

---

### Étape 3 : Création de la configuration PostCSS

Créer le fichier `postcss.config.js` à la racine du projet :

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**Note :** `autoprefixer` n'est plus nécessaire en v4 (intégré).

**✅ Checklist :**
- [ ] `postcss.config.js` créé
- [ ] Configuration correcte

---

### Étape 4 : Migration du fichier CSS

**Fichier :** `src/assets/css/styles.css`

**Avant (v3) :**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Après (v4) :**
```css
@import "tailwindcss";

@theme {
  --color-fluance: #0A6BCE;
  --color-gold: #ffce2d;
  --color-leaf: #8bc34a;
  --color-ink: #0f172a;
  --color-cream: #fdfaf6;
}
```

**Modifications complètes :**
1. Remplacer les directives `@tailwind` par `@import "tailwindcss"`
2. Déplacer la couleur `fluance` dans `@theme`
3. Convertir les variables CSS existantes en tokens Tailwind (optionnel mais recommandé)

**✅ Checklist :**
- [ ] Imports remplacés
- [ ] Configuration `@theme` créée
- [ ] Variables CSS migrées (optionnel)

---

### Étape 5 : Suppression de tailwind.config.js

**Action :** Supprimer ou renommer `tailwind.config.js` (plus nécessaire en v4)

```bash
# Option 1 : Supprimer (recommandé)
rm tailwind.config.js

# Option 2 : Renommer pour référence (si vous préférez garder une copie)
mv tailwind.config.js tailwind.config.js.backup
```

**✅ Checklist :**
- [ ] `tailwind.config.js` supprimé ou renommé

---

### Étape 6 : Mise à jour des scripts npm

**Fichier :** `package.json`

**Avant :**
```json
"dev:css": "mkdir -p _site/assets/css && npx tailwindcss -i ./src/assets/css/styles.css -o ./_site/assets/css/styles.css --config ./tailwind.config.js --watch",
"build:css": "npx tailwindcss -i ./src/assets/css/styles.css -o ./_site/assets/css/styles.css --config ./tailwind.config.js --minify"
```

**Après :**
```json
"dev:css": "mkdir -p _site/assets/css && npx @tailwindcss/cli@latest -i ./src/assets/css/styles.css -o ./_site/assets/css/styles.css --watch",
"build:css": "npx @tailwindcss/cli@latest -i ./src/assets/css/styles.css -o ./_site/assets/css/styles.css --minify"
```

**Modifications :**
- Supprimer `--config ./tailwind.config.js` (plus nécessaire)
- Utiliser `@tailwindcss/cli` au lieu de `tailwindcss` (optionnel, mais recommandé pour v4)

**✅ Checklist :**
- [ ] Scripts `dev:css` et `build:css` mis à jour
- [ ] Option `--config` supprimée

---

### Étape 7 : Remplacement des classes obsolètes

#### 7.1 Remplacer `flex-shrink-0` par `shrink-0`

**Fichiers à modifier :**
1. `src/fr/rdv/clarte.md` (4 occurrences)
2. `src/en/rdv/clarte.md` (4 occurrences)
3. `src/en/confirmation.md` (2 occurrences)
4. `src/fr/confirmation.md` (2 occurrences)

**Commande de recherche/remplacement :**
```bash
# Vérifier les occurrences
grep -r "flex-shrink-0" src/

# Remplacer (à faire manuellement ou avec sed)
# flex-shrink-0 → shrink-0
```

**✅ Checklist :**
- [ ] Toutes les occurrences de `flex-shrink-0` remplacées par `shrink-0`
- [ ] Fichiers vérifiés

---

### Étape 8 : Mise à jour de la référence à la couleur fluance

**Fichier :** `src/index.njk`

**Avant :**
```html
class="... bg-fluance ..."
```

**Après :**
```html
class="... bg-[#0A6BCE] ..."
```

Ou mieux, utiliser la variable CSS :
```html
class="... bg-[var(--color-fluance)] ..."
```

**✅ Checklist :**
- [ ] Classe `bg-fluance` remplacée
- [ ] Test visuel effectué

---

### Étape 9 : Tests et validation

#### 9.1 Build de développement
```bash
npm start
```

**Vérifications :**
- [ ] Site se charge sans erreurs
- [ ] Styles appliqués correctement
- [ ] Pas d'erreurs dans la console
- [ ] Navigation fonctionne

#### 9.2 Build de production
```bash
npm run build
```

**Vérifications :**
- [ ] Build réussit sans erreurs
- [ ] CSS généré dans `_site/assets/css/styles.css`
- [ ] Taille du CSS vérifiée (devrait être similaire ou plus petite)
- [ ] HTML minifié correctement

#### 9.3 Tests visuels

**Pages à tester :**
- [ ] Page d'accueil FR (`/fr/`)
- [ ] Page d'accueil EN (`/en/`)
- [ ] Page contact
- [ ] Page accompagnement individuel
- [ ] Page RDV Clarté
- [ ] Page à propos / philosophie
- [ ] Menu mobile et desktop
- [ ] Cookie banner

**Éléments à vérifier :**
- [ ] Couleurs (bleu fluance, or, etc.)
- [ ] Bordures arrondies
- [ ] Ombres
- [ ] Espacements
- [ ] Responsive (mobile/desktop)
- [ ] Animations et transitions

#### 9.4 Validation HTML/CSS

```bash
# Vérifier qu'il n'y a pas d'erreurs de build
npm run build

# Tester le site généré
cd _site
python3 -m http.server 8000
# Ouvrir http://localhost:8000
```

**✅ Checklist :**
- [ ] Build dev fonctionne
- [ ] Build prod fonctionne
- [ ] Tests visuels passés
- [ ] Validation HTML/CSS OK

---

### Étape 10 : Nettoyage et optimisation

#### 10.1 Supprimer autoprefixer (optionnel)

Si `autoprefixer` n'est plus utilisé ailleurs, vous pouvez le retirer :

```bash
npm uninstall autoprefixer
```

**Note :** Vérifiez d'abord qu'il n'est pas utilisé dans d'autres configurations.

#### 10.2 Vérifier les dépendances inutilisées

```bash
npm prune
```

**✅ Checklist :**
- [ ] Dépendances inutilisées supprimées
- [ ] `package.json` nettoyé

---

### Étape 11 : Documentation

Mettre à jour la documentation du projet :

**Fichier :** `PROJECT_README.md`

**Sections à mettre à jour :**
- Version de Tailwind CSS mentionnée
- Configuration mise à jour
- Notes sur la migration si nécessaire

**✅ Checklist :**
- [ ] README mis à jour
- [ ] Notes de migration ajoutées si nécessaire

---

### Étape 12 : Commit et déploiement

```bash
# Vérifier les changements
git status
git diff

# Ajouter les fichiers modifiés
git add .

# Commit
git commit -m "Migration vers Tailwind CSS v4

- Mise à jour vers Tailwind CSS 4.1.17
- Migration vers configuration CSS-first avec @theme
- Remplacement de flex-shrink-0 par shrink-0
- Mise à jour des scripts npm
- Création de postcss.config.js
- Suppression de tailwind.config.js"

# Push (si tout est OK)
git push origin migration/tailwind-v4
```

**✅ Checklist :**
- [ ] Changements commités
- [ ] Message de commit descriptif
- [ ] Branche poussée (ou merge dans main si tests OK)

---

## 🔄 Rollback (en cas de problème)

Si la migration pose problème, vous pouvez revenir en arrière :

```bash
# 1. Revenir à la branche précédente
git checkout main

# 2. Ou restaurer les fichiers
git checkout main -- package.json package-lock.json tailwind.config.js src/assets/css/styles.css

# 3. Réinstaller les dépendances v3
npm install -D tailwindcss@^3.4.18 autoprefixer@^10.4.22

# 4. Supprimer postcss.config.js si créé
rm postcss.config.js
```

---

## 📊 Résumé des changements

### Fichiers créés
- `postcss.config.js` (nouveau)

### Fichiers modifiés
- `package.json` (dépendances et scripts)
- `package-lock.json` (dépendances)
- `src/assets/css/styles.css` (imports et configuration)
- `src/fr/rdv/clarte.md` (classes)
- `src/en/rdv/clarte.md` (classes)
- `src/en/confirmation.md` (classes)
- `src/fr/confirmation.md` (classes)
- `src/index.njk` (classe bg-fluance)

### Fichiers supprimés
- `tailwind.config.js` (remplacé par @theme dans CSS)

### Dépendances
- ✅ Ajout : `@tailwindcss/postcss@latest`
- ✅ Mise à jour : `tailwindcss@^3.4.18` → `tailwindcss@^4.1.17`
- ⚠️ Optionnel : Suppression de `autoprefixer` (intégré dans v4)

---

## 🎯 Points d'attention

### 1. Support des navigateurs
Tailwind CSS v4 nécessite :
- Safari 16.4+
- Chrome 111+
- Firefox 128+

**Vérification :** Utilisez [caniuse.com](https://caniuse.com) pour vérifier le support de votre audience.

### 2. Classes renommées non utilisées
Votre projet n'utilise pas les classes suivantes qui seraient affectées :
- `shadow-sm` → `shadow-xs` (non utilisé)
- `shadow` → `shadow-sm` (non utilisé)
- `rounded-sm` → `rounded-xs` (non utilisé)
- `rounded` → `rounded-sm` (non utilisé)
- `outline-none` → `outline-hidden` (non utilisé)

**Action :** Aucune action nécessaire.

### 3. Variables CSS personnalisées
Vous utilisez déjà des variables CSS (`--fluance-*`). En v4, vous pouvez :
- Les garder telles quelles (compatibilité)
- Les migrer vers `@theme` pour une meilleure intégration

**Recommandation :** Migration progressive vers `@theme` pour bénéficier des tokens Tailwind.

### 4. GitHub Actions
Le workflow de déploiement devrait fonctionner sans modification, mais vérifiez après le premier déploiement.

---

## 📚 Ressources

- [Guide officiel de migration Tailwind CSS v4](https://tailwindcss.com/docs/upgrade-guide)
- [Documentation Tailwind CSS v4](https://tailwindcss.com/docs)
- [Outil de migration automatique](https://twshift.com/) (optionnel)
- [Migration tool officiel](https://github.com/tailwindlabs/tailwindcss/discussions) (si disponible)

---

## ✅ Checklist finale

Avant de considérer la migration comme terminée :

- [ ] Toutes les étapes exécutées
- [ ] Build dev fonctionne
- [ ] Build prod fonctionne
- [ ] Tests visuels passés sur toutes les pages
- [ ] Pas d'erreurs dans la console
- [ ] CSS généré correctement
- [ ] Documentation mise à jour
- [ ] Code commité et poussé
- [ ] Déploiement testé en production (si applicable)

---

**Bon courage pour la migration ! 🚀**
