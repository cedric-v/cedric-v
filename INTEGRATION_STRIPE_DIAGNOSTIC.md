# Intégration Stripe pour le Diagnostic Digital (750 CHF)

Ce document explique comment l'achat du **Diagnostic Digital** (750 CHF, payant à la réservation) a été intégré sur cedricv.com, en réutilisant l'infrastructure Stripe existante (même mécanique que le RDV Clarté).

## 🎯 Principe retenu

- **CTA principal** « Réserver le diagnostic — 750 CHF » → **paiement Stripe Checkout à la réservation** (pas de Calendly payant).
- **Option secondaire (en retrait)** « Échange découverte gratuit (25 min) » → lien Calendly existant (`calendly.com/cedric-vonlanthen/25min`).
- **Planification après paiement** : manuelle. Le client est recontacté sous 24h ouvrées pour planifier les 5 heures.
- La mécanique « 750 CHF déduits de la première mission » reste affichée sur la page et la confirmation.

## ✅ Ce qui a été fait

### 1. Backend (`fluance-io/functions/`)

| Fichier | Modification |
|---|---|
| `services/stripePrices.js` | Ajout du produit `diagnostic-digital_unique` : 750 CHF (75000 centimes). **Auto-provisioning** : le produit/prix est créé automatiquement dans Stripe au premier achat (aucune action dashboard requise). |
| `index.js` — `createStripeCheckoutSession` | Produit ajouté à `VALID_PRODUCTS` + `VALID_VARIANTS: ['unique']`. Redirections : succès → `/confirmation?session_id=...&produit=diagnostic-digital`, annulation → `/digital-manager` (avec préfixe `/en` selon la langue). |
| `index.js` — webhook | Produit ajouté à `VALID_ONLINE_PRODUCTS`. Traité comme `focus-sos`/`site-vitrine` : **log d'audit Firestore** (`audit_payments`) + **notification admin Mailjet** (`sendOnlineProductPurchaseNotificationAdmin`). Pas de création de token ni d'espace membre. |

### 2. Frontend (site cedricv.com)

| Fichier | Modification |
|---|---|
| `src/assets/js/payment.njk` | `diagnostic-digital` ajouté à `isRequiredForProduct` → **capture email/prénom/nom** à la réservation (nécessaire pour recontacter le client). |
| `src/fr/digital-manager.njk` | CTA hero, carte ① et CTA final : `onclick="window.CedricVPayment.redirectToStripe('diagnostic-digital', 'fr', event)"`. Lien secondaire « Échange découverte gratuit (25 min) » → Calendly. |
| `src/en/digital-manager.njk` | Idem, locale `'en'`. |
| `src/fr/confirmation.md` | Bloc « Votre diagnostic digital est réservé » (affiché si `?produit=diagnostic-digital`) + masquage du bloc « infos de connexion » Fluance. |
| `src/en/confirmation.md` | Idem en anglais. |

## 🚀 Déploiement

### 1. Backend (obligatoire pour que le paiement fonctionne)

```bash
cd ../fluance-io/functions
firebase deploy --only functions
```

> Le secret `STRIPE_SECRET_KEY` est déjà configuré (utilisé par le RDV Clarté). Le produit Stripe est **auto-provisionné** au premier achat — vérifier ensuite dans le dashboard Stripe que le prix « Diagnostic Digital - CedricV (750 CHF) » a bien été créé.

## 🧾 TVA optionnelle (Stripe Tax) — diagnostic uniquement

Par défaut, **aucune TVA n'est appliquée** (aucun impact sur les autres paiements Fluance).

Pour activer la TVA **uniquement sur le diagnostic digital** :

1. Stripe Dashboard → **Tax** → activer Stripe Tax (déjà fait)
2. Définir le secret dans Firebase :

```bash
firebase functions:secrets:set STRIPE_TAX_ENABLED
# Valeur : true
```

3. Redéployer :

```bash
firebase deploy --only functions
```

### Comportement une fois activé

- **Client suisse** → TVA 8,1 % appliquée automatiquement (total 811,20 CHF)
- **Client EU B2B avec n° TVA** → reverse charge (pas de TVA facturée)
- **Client étranger sans TVA** → pas de TVA
- Les **autres produits** (rdv-clarte, focus-sos, site-vitrine, 21jours, complet, flow_pass, semester_pass) ne sont **jamais** taxés : `automatic_tax` n'est activé que pour `diagnostic-digital` **et** si la variable est à `true` (opt-in par session).
- Frais Stripe Tax : ~0,5 % de la TVA collectée (hors seuils de gratuité).

### Pour désactiver la TVA

```bash
firebase functions:secrets:destroy STRIPE_TAX_ENABLED
firebase deploy --only functions
```

### 2. Site (statique)

```bash
npm run build   # ou npm run start en dev
```

## 🧪 Test

1. Ouvrir `https://cedricv.com/digital-manager/` (ou `localhost:8081/digital-manager/` en dev)
2. Cliquer « Réserver le diagnostic — 750 CHF » → modal de capture email → Checkout Stripe
3. Payer avec la [carte de test Stripe](https://docs.stripe.com/testing) : `4242 4242 4242 4242`, n'importe quelle date future, CVC quelconque
4. Vérifier :
   - Redirection vers `/confirmation` avec le bloc diagnostic affiché
   - Log `audit_payments` dans Firestore
   - Notification admin Mailjet reçue

## ⚠️ Opérations après une vente

- Vous recevez la **notification admin** (email du client + montant).
- **Contactez le client sous 24h ouvrées** pour planifier les 5 heures de diagnostic (la planification est manuelle, hors Calendly).
- Pensez à mentionner la **déduction de 750 CHF sur la première mission** si la collaboration continue.

## 🔮 Évolutions possibles (si le besoin grandit)

- **Email automatique au client** après paiement (prochaines étapes + lien de planification) via Mailjet (déjà disponible dans les fonctions).
- **Planification automatique** : intégrer CloudMeet (Calendly open-source auto-hébergé) — nécessite Cloudflare Pages + Google OAuth, et reste à coupler avec Stripe pour le paiement à la réservation.
- **Questionnaire préalable** (CA, nb employés, principal problème digital) avant la réservation pour qualifier plus tôt.

---

*Document lié : `INTEGRATION_STRIPE_RDV_CLARTE.md` pour le fonctionnement général de l'intégration Stripe/Firebase.*
