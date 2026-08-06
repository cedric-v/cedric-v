# Sécurité des secrets — Gitleaks & historique

Document de suivi de la protection contre les fuites de secrets (clés API, tokens) dans ce dépôt.

**Dernière mise à jour : 2025-08-05**

---

## 1. État actuel (fait ✅)

### Protection en place

| Mécanisme | Détail | Statut |
|---|---|---|
| Hook `pre-commit` local | Gitleaks `v8.30.1` (rev épinglée dans `.pre-commit-config.yaml`) | ✅ Installé (`.git/hooks/pre-commit`) |
| Hook `pre-push` local | Bloque la poussée si le diff contient un secret | ✅ Installé (`.git/hooks/pre-push`) |
| CI GitHub Actions | `.github/workflows/gitleaks.yml` scanne l'historique à chaque push/PR sur `main` | ✅ En place |
| Config | `.pre-commit-config.yaml` : repo `gitleaks/gitleaks`, `rev: v8.30.1` | ✅ Valide (`pre-commit validate-config`) |
| Binaires | `pre-commit 4.6.1`, `gitleaks 8.30.1` (Homebrew) | ✅ Cohérents avec la rev |

### Purge de l'historique (effectuée le 2025-08-05)

- **Fuite corrigée** : clé API Firebase `AIzaSyDJ-…` (tronquée volontairement) hardcodée dans `src/assets/js/payment.js` (ajoutée au commit `75e8551`, supprimée depuis via variables d'environnement).
- **Action** : réécriture de l'historique (`filter-branch --index-filter`, arbres identiques vérifiés) sur :
  - `main` : `3a83424` → `5d576c9`
  - `renovate/html-minifier-next-7.x` : `bcd10ef` → `fe25b09`
  - `dependabot/npm_and_yarn/html-minifier-next-7.5.2` : `8e9d6a8` → `08d7ed9`
- **Vérification** : `gitleaks git` → **0 fuite** sur 392 commits.
- **Sauvegarde de l'ancien état** : `/tmp/cedric-v-pre-purge.bundle` (88 Mo) — voir §4.
- **Code actuel** : aucune clé en dur ; `src/assets/js/payment.njk` injecte `{{ env.FIREBASE_API_KEY }}` (secrets GitHub Actions → build → Cloudflare Pages).

---

## 2. À faire — checklist ✅/⬜

### 2.1 Urgent — console Google Cloud (protège réellement les données)

- [ ] **Vérifier les Firebase Security Rules** (Firestore / Realtime Database)
  - Console Firebase → projet `fluance-protected-content` → **Firestore Database** (et RTDB si utilisé) → onglet *Rules*
  - Les accès `read`/`write` doivent être verrouillés (authentification requise ou `false`), jamais ouverts au public.
  - ⚠️ Une API key publique + règles ouvertes = données exposées. Règles verrouillées = rien à exploiter.
- [ ] **Désactiver l'ancienne clé** `AIzaSyDJ-…` (préfixe tronqué — retrouver la clé complète dans le bundle de sauvegarde `/tmp/cedric-v-pre-purge.bundle`)
  - Console Google Cloud → *APIs & Services → Credentials*
  - Repérer les clés : l'ancienne (préfixe `AIzaSyDJ-`) et l'actuelle (préfixe `AIzaSyCIfb-` — visible sur https://cedricv.com/assets/js/payment.js)
  - **Désactiver ou supprimer l'ancienne** (elle ne sert plus, la production utilise l'autre).
- [ ] **Restreindre la clé actuelle** (préfixe `AIzaSyCIfb-`…)
  - Même écran → éditer la clé :
    - *Application restrictions* → **HTTP referrers** : `https://cedricv.com/*` + `http://localhost:*` (dev)
    - *API restrictions* → limiter aux APIs réellement utilisées (Firebase Auth, Firestore, Cloud Functions)
  - 🧪 Tester le parcours de paiement après restriction (si casse : élargir, tester à nouveau).

### 2.2 À surveiller

- [ ] **Run Actions du force-push** : GitHub → *Actions* → vérifier que `deploy` (build + Cloudflare + post-deploy) et `gitleaks` sont **verts**. Le workflow `gitleaks.yml` était probablement rouge à chaque push avant la purge (fuite dans l'historique).
- [ ] **Confirmer la clé actuelle dans les secrets GitHub** : *Settings → Secrets and variables → Actions* → `FIREBASE_API_KEY` doit correspondre à la clé active côté Google.

### 2.3 Nettoyage

- [ ] **Supprimer `/tmp/cedric-v-backup.git`** (92 Mo, clone miroir interrompu, inutile) après confirmation que tout est stable.
- [ ] Conserver **`/tmp/cedric-v-pre-purge.bundle`** (88 Mo) jusqu'à stabilisation complète (voir §4).

### 2.4 Améliorations recommandées (bonnes pratiques)

- [ ] **Ajouter un `.gitleaks.toml`** personnalisé (le fichier sera référencé dans `.pre-commit-config.yaml` via `args: [--config, .gitleaks.toml]`) pour :
  - gérer les allowlists (faux positifs documentés),
  - ajuster les règles/expressions selon les besoins du projet.
- [ ] **Activer le manager `pre-commit` dans Renovate** (`renovate.json`) pour que `.pre-commit-config.yaml` soit mis à jour automatiquement :
  ```json
  "pre-commit": {
    "enabled": true
  }
  ```
  (Renovate créera des PR pour les nouvelles revs de gitleaks.)
- [ ] **Exécuter `pre-commit autoupdate`** régulièrement pour suivre les versions.

---

## 3. Installation sur un nouveau poste

```bash
# 1. Outils (macOS)
brew install pre-commit gitleaks

# 2. Activer les hooks dans le dépôt
pre-commit install
pre-commit install --hook-type pre-push

# 3. Vérification
pre-commit run gitleaks --all-files
```

> ℹ️ **Comportement des hooks** : le hook `pre-commit` scanne le **diff stagé** (`gitleaks protect`), le hook `pre-push` sécurise la poussée, et le CI scanne l'**historique complet** à chaque push. Les trois couches sont complémentaires.

---

## 4. Rollback / restauration de l'ancien historique

Si un problème survient, l'état **pré-purge** (avec la fuite, volontairement conservé pour restauration) est dans `/tmp/cedric-v-pre-purge.bundle` :

```bash
git fetch /tmp/cedric-v-pre-purge.bundle main:refs/heads/main-rollback
git push --force-with-lease origin main-rollback:main
```

---

## 5. Vérification périodique (rapide)

```bash
gitleaks git                      # scan de tout l'historique local → "no leaks found"
pre-commit validate-config .pre-commit-config.yaml
pre-commit autoupdate             # si une nouvelle version existe
```

### Rappels

- Une **Firebase API key est un identifiant public côté client** : sa présence dans le code n'est pas une faille en soi. La protection réelle est assurée par les **Security Rules** + les **restrictions de la clé** (voir §2.1).
- Tout secret *réel* (service account, token d'API privée, clé Stripe) ne doit **jamais** être commité : le hook le bloquera.
