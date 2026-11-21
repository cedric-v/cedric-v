/**
 * Lightbox des témoignages (images agrandissables).
 *
 * Contrat HTML :
 *   <a href="/image.jpg"
 *      data-testimonial-lightbox-trigger
 *      data-testimonial-lightbox-src="/image.jpg"
 *      data-testimonial-lightbox-label="Témoignage de …">…</a>
 *
 * - Sans JavaScript, ou si <dialog> n'est pas supporté, le lien fonctionne
 *   normalement (repli vers l'image).
 * - Avec JavaScript : ouverture dans une modale native sur la page courante.
 *   ESC, focus piégé dans la modale et fermeture au clic sur le fond sont
 *   gérés par <dialog> + le code ci-dessous.
 */
(function () {
  'use strict';

  var SUPPORTS_DIALOG = typeof HTMLDialogElement !== 'undefined' &&
    typeof HTMLDialogElement.prototype.showModal === 'function';

  var dialog = null;
  var img = null;
  var titleEl = null;
  var lastFocused = null;

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'testimonial-lightbox';
    dialog.setAttribute('aria-labelledby', 'testimonial-lightbox-title');

    var card = document.createElement('div');
    card.className = 'testimonial-lightbox-card';

    var header = document.createElement('div');
    header.className = 'testimonial-lightbox-header';

    titleEl = document.createElement('p');
    titleEl.className = 'testimonial-lightbox-title';
    titleEl.id = 'testimonial-lightbox-title';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'testimonial-lightbox-close';
    closeBtn.setAttribute('aria-label', 'Fermer l’aperçu');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function () {
      dialog.close();
    });

    header.appendChild(titleEl);
    header.appendChild(closeBtn);

    var body = document.createElement('div');
    body.className = 'testimonial-lightbox-body';

    var wrap = document.createElement('div');
    wrap.className = 'testimonial-lightbox-image-wrap';

    img = document.createElement('img');
    img.className = 'testimonial-lightbox-img';
    img.decoding = 'async';
    img.alt = '';

    wrap.appendChild(img);
    body.appendChild(wrap);

    card.appendChild(header);
    card.appendChild(body);
    dialog.appendChild(card);
    document.body.appendChild(dialog);

    // Clic sur le fond (hors carte) = fermeture
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    // Fermeture (ESC, bouton, fond) : rendu du focus, déverrouillage du scroll
    dialog.addEventListener('close', function () {
      document.documentElement.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus({ preventScroll: true });
      }
      // Libère la mémoire de l'image affichée
      img.removeAttribute('src');
    });
  }

  function open(trigger) {
    var src = trigger.getAttribute('data-testimonial-lightbox-src') ||
      trigger.getAttribute('href');
    if (!src) return;

    var label = trigger.getAttribute('data-testimonial-lightbox-label') ||
      trigger.getAttribute('aria-label') || '';

    if (!dialog) build();

    titleEl.textContent = label;
    img.alt = label;
    img.src = src;

    lastFocused = trigger;
    document.documentElement.style.overflow = 'hidden';

    dialog.showModal();

    // Focus sur le bouton de fermeture : action principale attendue
    var closeBtn = dialog.querySelector('.testimonial-lightbox-close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  if (!SUPPORTS_DIALOG) return;

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest
      ? event.target.closest('[data-testimonial-lightbox-trigger]')
      : null;
    if (!trigger) return;

    // Laisser le comportement natif pour un clic « nouvel onglet » explicite
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    open(trigger);
  });
})();
