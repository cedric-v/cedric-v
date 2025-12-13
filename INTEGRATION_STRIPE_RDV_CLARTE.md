# Intégration Stripe pour le RDV Clarté

Ce document explique comment l'intégration Stripe a été configurée pour permettre l'achat du RDV Clarté directement depuis cedricv.com.

## ✅ Ce qui a été fait

1. **Script JavaScript de paiement** (`src/assets/js/payment.js`)
   - Utilise Firebase Functions pour créer les sessions Stripe Checkout
   - Même configuration Firebase que fluance.io
   - Fonction `CedricVPayment.redirectToStripe('rdv-clarte', 'fr', event)`

2. **Page RDV Clarté modifiée** (`src/fr/rdv/clarte.md`)
   - Les liens vers `https://go.cedricv.com/workshop/clarte/bdc` ont été remplacés par des boutons Stripe
   - Boutons : "S'inscrire au RDV seul" et "S'inscrire au prochain RDV Clarté"

3. **Fonction Firebase modifiée** (`fluance-io/functions/index.js`)
   - Support du produit `'rdv-clarte'` ajouté à `createStripeCheckoutSession`
   - Redirection vers `https://cedricv.com/confirmation` en cas de succès
   - Redirection vers `https://cedricv.com/rdv/clarte` en cas d'annulation

4. **Webhook Stripe modifié** (`fluance-io/functions/index.js`)
   - Support du produit `'rdv-clarte'` ajouté
   - Pour le RDV Clarté, pas de création de token ni d'envoi d'email (pas d'espace membre)
   - Simple log du paiement réussi

5. **Script intégré dans le layout** (`src/_includes/base.njk`)
   - Le script `payment.js` est chargé sur toutes les pages

## ⚠️ Configuration requise

### 1. Créer les produits dans Stripe Dashboard

#### Produit 1 : RDV Clarté - Paiement unique (100 CHF)

1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com/)
2. Allez dans **Products** (Produits)
3. Cliquez sur **+ Add product** (Ajouter un produit)
4. Configurez le produit :
   - **Name** : `RDV Clarté - CedricV (Paiement unique)`
   - **Description** : `Rendez-vous mensuel en ligne pour retrouver la clarté dans votre activité professionnelle - Accès unique`
   - **Pricing** :
     - **Price** : `100.00`
     - **Currency** : `CHF`
     - **Billing period** : `One time` (paiement unique)
5. Cliquez sur **Save**
6. **📝 Copiez le Price ID** (commence par `price_xxxxx`)

#### Produit 2 : RDV Clarté - Abonnement mensuel (69 CHF/mois)

1. Dans Stripe Dashboard, cliquez sur **+ Add product** (Ajouter un produit)
2. Configurez le produit :
   - **Name** : `RDV Clarté - CedricV (Abonnement mensuel)`
   - **Description** : `Rendez-vous mensuel en ligne pour retrouver la clarté dans votre activité professionnelle - Abonnement mensuel`
   - **Pricing** :
     - **Price** : `69.00`
     - **Currency** : `CHF`
     - **Billing period** : `Recurring` (récurrent)
     - **Recurring interval** : `Monthly` (mensuel)
3. Cliquez sur **Save**
4. **📝 Copiez le Price ID** (commence par `price_xxxxx`)

### 2. Configurer les secrets Firebase

Dans le projet fluance-io, configurez les secrets Firebase avec les Price IDs :

```bash
cd /Users/cedric\ 1/Documents/coding/fluance-io

# Pour le paiement unique (100 CHF)
echo -n "price_XXXXX" | firebase functions:secrets:set STRIPE_PRICE_ID_RDV_CLARTE_UNIQUE

# Pour l'abonnement mensuel (69 CHF/mois)
echo -n "price_YYYYY" | firebase functions:secrets:set STRIPE_PRICE_ID_RDV_CLARTE_ABONNEMENT
```

Remplacez :
- `price_XXXXX` par le Price ID du paiement unique (100 CHF)
- `price_YYYYY` par le Price ID de l'abonnement mensuel (69 CHF/mois)

### 3. Redéployer les fonctions Firebase

```bash
cd /Users/cedric\ 1/Documents/coding/fluance-io
firebase deploy --only functions
```

### 4. Vérifier le webhook Stripe

Le webhook Stripe doit être configuré pour pointer vers :
```
https://europe-west1-fluance-protected-content.cloudfunctions.net/webhookStripe
```

Les événements à écouter :
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `customer.subscription.deleted` (pour les annulations d'abonnement)
- ✅ `invoice.payment_failed` (pour les échecs de paiement d'abonnement)

## 🔄 Flux de paiement

### Paiement unique (100 CHF)

1. **Client clique sur le bouton** "S'inscrire au RDV seul" ou "S'inscrire au prochain RDV Clarté"
2. **Script JavaScript** appelle `createStripeCheckoutSession` via Firebase Functions avec `variant: 'unique'`
3. **Fonction Firebase** crée une session Stripe Checkout avec :
   - Price ID du RDV Clarté (paiement unique)
   - Mode : `payment` (paiement unique)
   - `metadata.product = 'rdv-clarte'`
   - `metadata.variant = 'unique'`
   - `metadata.system = 'firebase'`
   - `success_url = https://cedricv.com/confirmation?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url = https://cedricv.com/rdv/clarte`
4. **Client est redirigé** vers Stripe Checkout
5. **Client paie** sur Stripe
6. **Webhook Stripe** reçoit l'événement `checkout.session.completed`
7. **Webhook log** le paiement (pas de token ni d'email pour le RDV Clarté)
8. **Client est redirigé** vers `https://cedricv.com/confirmation`

### Abonnement mensuel (69 CHF/mois)

1. **Client clique sur le bouton** "Obtenir l'accès complet"
2. **Script JavaScript** appelle `createStripeCheckoutSession` via Firebase Functions avec `variant: 'abonnement'`
3. **Fonction Firebase** crée une session Stripe Checkout avec :
   - Price ID du RDV Clarté (abonnement mensuel)
   - Mode : `subscription` (abonnement récurrent)
   - `metadata.product = 'rdv-clarte'`
   - `metadata.variant = 'abonnement'`
   - `metadata.system = 'firebase'`
   - `success_url = https://cedricv.com/confirmation?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url = https://cedricv.com/rdv/clarte`
4. **Client est redirigé** vers Stripe Checkout
5. **Client paie** sur Stripe
6. **Webhook Stripe** reçoit l'événement `checkout.session.completed`
7. **Webhook log** le paiement (pas de token ni d'email pour le RDV Clarté)
8. **Client est redirigé** vers `https://cedricv.com/confirmation`

### Annulation d'abonnement

1. **Client annule son abonnement** via Stripe Customer Portal ou directement dans Stripe
2. **Webhook Stripe** reçoit l'événement `customer.subscription.deleted`
3. **Webhook vérifie** que `metadata.product === 'rdv-clarte'`
4. **Webhook log** l'annulation (pas d'action supplémentaire car pas d'espace membre)
5. **L'abonnement est annulé** et le client ne sera plus facturé

## 📝 Notes importantes

- **Pas d'espace membre** : Contrairement aux produits fluance.io, le RDV Clarté ne nécessite pas de création de compte ni d'espace membre
- **Redirection automatique** : Après le paiement, le client est automatiquement redirigé vers la page de confirmation
- **Même infrastructure** : Utilise les mêmes clés API Stripe et Firebase que fluance.io
- **Webhook simplifié** : Pour le RDV Clarté, le webhook ne fait que logger le paiement, pas de traitement complexe
- **Deux formules** : 
  - **Paiement unique** (100 CHF) : `variant: 'unique'` - Accès à un seul RDV
  - **Abonnement mensuel** (69 CHF/mois) : `variant: 'abonnement'` - Accès à tous les RDV
- **Gestion des annulations** : Les annulations d'abonnement sont automatiquement détectées et loggées via le webhook `customer.subscription.deleted`

## 🧪 Test

1. Allez sur `https://cedricv.com/rdv/clarte` (ou en local)
2. Cliquez sur "S'inscrire au RDV seul"
3. Utilisez une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel code à 3 chiffres
4. Complétez le paiement
5. Vérifiez que vous êtes redirigé vers `/confirmation`
6. Vérifiez dans Stripe Dashboard → Webhooks → Logs que l'événement a été reçu

## 🔗 Fichiers modifiés

### Projet cedric-v
- `src/assets/js/payment.js` (nouveau)
- `src/fr/rdv/clarte.md` (modifié)
- `src/_includes/base.njk` (modifié)

### Projet fluance-io
- `functions/index.js` (modifié - fonction `createStripeCheckoutSession`)
- `functions/index.js` (modifié - fonction `webhookStripe`)

## ❓ Questions fréquentes

**Q : Pourquoi utiliser Firebase Functions au lieu d'une API directe ?**
R : Pour réutiliser la même infrastructure et les mêmes clés API que fluance.io, et pour bénéficier de la sécurité des secrets Firebase.

**Q : Le webhook crée-t-il un compte pour le client ?**
R : Non, pour le RDV Clarté, pas d'espace membre. Le webhook ne fait que logger le paiement.

**Q : Comment changer le montant du RDV Clarté ?**
R : Modifiez le prix dans Stripe Dashboard, puis mettez à jour le Price ID dans le secret Firebase correspondant :
- Paiement unique : `STRIPE_PRICE_ID_RDV_CLARTE_UNIQUE`
- Abonnement : `STRIPE_PRICE_ID_RDV_CLARTE_ABONNEMENT`

**Q : Comment gérer les annulations d'abonnement ?**
R : Les annulations sont automatiquement détectées via le webhook `customer.subscription.deleted`. Le webhook log l'annulation mais ne fait pas d'action supplémentaire car il n'y a pas d'espace membre à gérer.

**Q : Comment ajouter d'autres produits à cedricv.com ?**
R : Suivez le même processus : ajoutez le produit dans la validation de `createStripeCheckoutSession`, ajoutez le Price ID dans le mapping, et configurez les URLs de redirection.
