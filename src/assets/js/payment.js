/**
 * Fonctions JavaScript pour gérer les paiements Stripe
 * Utilise Firebase Functions pour créer les sessions Checkout
 */

// Configuration Firebase (même que dans fluance.io)
const firebaseConfig = {
  apiKey: 'AIzaSyDJ-VlDMC5PUEMeILLZ8OmdYIhvhxIfhdM',
  authDomain: 'fluance-protected-content.firebaseapp.com',
  projectId: 'fluance-protected-content',
  storageBucket: 'fluance-protected-content.firebasestorage.app',
  messagingSenderId: '173938686776',
  appId: '1:173938686776:web:891caf76098a42c3579fcd',
  measurementId: 'G-CWPNXDQEYR',
};

/**
 * Charge Firebase si pas déjà chargé
 * @returns {Promise} Promise qui se résout quand Firebase est prêt
 */
function loadFirebase() {
  return new Promise((resolve, reject) => {
    // Si Firebase est déjà initialisé
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
      resolve();
      return;
    }

    // Charger Firebase SDK
    const script1 = document.createElement('script');
    script1.src = 'https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js';
    document.head.appendChild(script1);

    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://www.gstatic.com/firebasejs/12.6.0/firebase-functions-compat.js';
      document.head.appendChild(script2);

      script2.onload = () => {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        resolve();
      };

      script2.onerror = () => {
        reject(new Error('Erreur lors du chargement de Firebase Functions'));
      };
    };

    script1.onerror = () => {
      reject(new Error('Erreur lors du chargement de Firebase App'));
    };
  });
}

/**
 * Crée une session Stripe Checkout et redirige l'utilisateur
 * @param {string} product - 'rdv-clarte' pour le RDV Clarté
 * @param {string} locale - 'fr' ou 'en' (défaut: 'fr')
 * @param {Event} event - Événement de clic (optionnel, pour désactiver le bouton)
 * @param {string|null} variant - 'unique' (paiement unique) ou 'abonnement' (abonnement mensuel) pour rdv-clarte
 */
async function redirectToStripeCheckout(product, locale = 'fr', event = null, variant = null) {
  // Récupérer le bouton depuis l'événement ou depuis window.event (fallback)
  const button = event?.target || window.event?.target || null;
  const originalText = button ? button.textContent : null;

  try {
    // Désactiver le bouton et afficher un indicateur de chargement
    if (button) {
      button.disabled = true;
      button.textContent = locale === 'fr' ? 'Chargement...' : 'Loading...';
    }

    // Charger Firebase si pas déjà chargé
    await loadFirebase();

    // Obtenir l'instance Firebase Functions
    const app = firebase.app();
    const functions = app.functions('europe-west1');
    const createStripeCheckoutSession = functions.httpsCallable('createStripeCheckoutSession');

    // Préparer les données
    const data = {
      product: product,
      locale: locale,
    };

    // Ajouter variant si nécessaire (pour 'rdv-clarte' avec abonnement)
    if (product === 'rdv-clarte' && variant) {
      data.variant = variant;
    }

    // Appeler la fonction Firebase
    const result = await createStripeCheckoutSession(data);

    if (result.data && result.data.success && result.data.url) {
      // Rediriger vers Stripe Checkout
      window.location.href = result.data.url;
    } else {
      throw new Error('Erreur lors de la création de la session de paiement');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe:', error);
    const errorMessage = locale === 'fr' 
      ? 'Une erreur est survenue. Veuillez réessayer.'
      : 'An error occurred. Please try again.';
    alert(errorMessage);
    
    // Réactiver le bouton en cas d'erreur
    if (button && originalText) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

// Exposer les fonctions globalement pour utilisation dans les pages
window.CedricVPayment = {
  redirectToStripe: redirectToStripeCheckout,
};

// Fonctions de compatibilité (pour utilisation directe dans onclick)
window.redirectToStripeCheckout = redirectToStripeCheckout;

// Log pour vérifier que le script est chargé
console.log('[Payment] Script payment.js chargé, CedricVPayment disponible');

