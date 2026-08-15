# Secret Security — Gitleaks & History

Tracking document for protection against secret leaks (API keys, tokens) in this repository.

**Last updated: 2025-08-05**

---

## 1. Current status (done ✅)

### Protection in place

| Mechanism | Detail | Status |
|---|---|---|
| Local `pre-commit` hook | Gitleaks `v8.30.1` (rev pinned in `.pre-commit-config.yaml`) | ✅ Installed (`.git/hooks/pre-commit`) |
| Local `pre-push` hook | Blocks the push if the diff contains a secret | ✅ Installed (`.git/hooks/pre-push`) |
| GitHub Actions CI | `.github/workflows/gitleaks.yml` scans the history on every push/PR to `main` | ✅ In place |
| Config | `.pre-commit-config.yaml`: repo `gitleaks/gitleaks`, `rev: v8.30.1` | ✅ Valid (`pre-commit validate-config`) |
| Binaries | `pre-commit 4.6.1`, `gitleaks 8.30.1` (Homebrew) | ✅ Consistent with the rev |

### History purge (done on 2025-08-05)

- **Fixed leak**: Firebase API key `AIzaSyDJ-…` (deliberately truncated) hardcoded in `src/assets/js/payment.js` (added in commit `75e8551`, since removed via environment variables).
- **Action**: history rewrite (`filter-branch --index-filter`, identical trees verified) on:
  - `main`: `3a83424` → `5d576c9`
  - `renovate/html-minifier-next-7.x`: `bcd10ef` → `fe25b09`
  - `dependabot/npm_and_yarn/html-minifier-next-7.5.2`: `8e9d6a8` → `08d7ed9`
- **Verification**: `gitleaks git` → **0 leaks** across 392 commits.
- **Backup of the old state**: `/tmp/cedric-v-pre-purge.bundle` (88 MB) — see §4.
- **Current code**: no hardcoded keys; `src/assets/js/payment.njk` injects `{{ env.FIREBASE_API_KEY }}` (GitHub Actions secrets → build → Cloudflare Pages).

---

## 2. To do — checklist ✅/⬜

### 2.1 Urgent — Google Cloud console (actually protects the data)

- [ ] **Check the Firebase Security Rules** (Firestore / Realtime Database)
  - Firebase console → project `fluance-protected-content` → **Firestore Database** (and RTDB if used) → *Rules* tab
  - `read`/`write` access must be locked down (authentication required or `false`), never open to the public.
  - ⚠️ A public API key + open rules = exposed data. Locked rules = nothing to exploit.
- [ ] **Disable the old key** `AIzaSyDJ-…` (truncated prefix — find the full key in the backup bundle `/tmp/cedric-v-pre-purge.bundle`)
  - Google Cloud console → *APIs & Services → Credentials*
  - Locate the keys: the old one (prefix `AIzaSyDJ-`) and the current one (prefix `AIzaSyCIfb-` — visible at https://cedricv.com/assets/js/payment.js)
  - **Disable or delete the old one** (no longer used; production uses the other).
- [ ] **Restrict the current key** (prefix `AIzaSyCIfb-`…)
  - Same screen → edit the key:
    - *Application restrictions* → **HTTP referrers**: `https://cedricv.com/*` + `http://localhost:*` (dev)
    - *API restrictions* → limit to the APIs actually used (Firebase Auth, Firestore, Cloud Functions)
  - 🧪 Test the payment flow after restriction (if it breaks: widen, test again).

### 2.2 To watch

- [ ] **Run Actions from the force-push**: GitHub → *Actions* → verify that `deploy` (build + Cloudflare + post-deploy) and `gitleaks` are **green**. The `gitleaks.yml` workflow was probably red on every push before the purge (leak in history).
- [ ] **Confirm the current key in GitHub secrets**: *Settings → Secrets and variables → Actions* → `FIREBASE_API_KEY` must match the active key on the Google side.

### 2.3 Cleanup

- [ ] **Delete `/tmp/cedric-v-backup.git`** (92 MB, interrupted mirror clone, useless) after confirming everything is stable.
- [ ] Keep **`/tmp/cedric-v-pre-purge.bundle`** (88 MB) until full stabilization (see §4).

### 2.4 Recommended improvements (best practices)

- [ ] **Add a custom `.gitleaks.toml`** (the file will be referenced in `.pre-commit-config.yaml` via `args: [--config, .gitleaks.toml]`) to:
  - manage allowlists (documented false positives),
  - adjust rules/expressions to the project's needs.
- [ ] **Enable the `pre-commit` manager in Renovate** (`renovate.json`) so `.pre-commit-config.yaml` is updated automatically:
  ```json
  "pre-commit": {
    "enabled": true
  }
  ```
  (Renovate will create PRs for new gitleaks revs.)
- [ ] **Run `pre-commit autoupdate`** regularly to keep up with versions.

---

## 3. Installation on a new machine

```bash
# 1. Tools (macOS)
brew install pre-commit gitleaks

# 2. Enable the hooks in the repository
pre-commit install
pre-commit install --hook-type pre-push

# 3. Verification
pre-commit run gitleaks --all-files
```

> ℹ️ **Hook behavior**: the `pre-commit` hook scans the **staged diff** (`gitleaks protect`), the `pre-push` hook secures the push, and the CI scans the **full history** on every push. The three layers are complementary.

---

## 4. Rollback / restoring the old history

If a problem occurs, the **pre-purge** state (with the leak, deliberately kept for restoration) is in `/tmp/cedric-v-pre-purge.bundle`:

```bash
git fetch /tmp/cedric-v-pre-purge.bundle main:refs/heads/main-rollback
git push --force-with-lease origin main-rollback:main
```

---

## 5. Periodic verification (quick)

```bash
gitleaks git                      # scan the whole local history → "no leaks found"
pre-commit validate-config .pre-commit-config.yaml
pre-commit autoupdate             # if a new version exists
```

### Reminders

- A **Firebase API key is a public client-side identifier**: its presence in the code is not a flaw per se. The real protection is provided by the **Security Rules** + the **key restrictions** (see §2.1).
- Any *real* secret (service account, private API token, Stripe key) must **never** be committed: the hook will block it.
