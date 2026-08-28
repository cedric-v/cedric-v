---
layout: base.njk
title: Contact
description: Parlons de votre situation et identifions la prochaine étape la plus utile pour votre activité.
locale: fr
newsletterPopup: false
contactPage: true
permalink: /contact/
templateEngineOverride: njk
---

<section class="contact-page max-w-6xl mx-auto px-6 md:px-12 py-16 space-y-12">
  <header class="contact-hero text-center space-y-5">
    <p class="cta-pill">Parlons de votre situation</p>
    <h1 class="text-4xl md:text-5xl font-semibold text-[#0f172a]">Un premier échange pour retrouver de la clarté</h1>
    <p class="text-xl text-[#1f1f1f]/80 max-w-3xl mx-auto">
      Vous n’avez pas besoin d’avoir déjà formulé la bonne question. Décrivez simplement ce qui vous préoccupe ; je vous répondrai avec une première orientation claire.
    </p>
  </header>

  <div class="contact-main-grid">
    <article class="contact-form-card section-card bg-white">
      <div class="contact-card-heading">
        <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">Dites-moi où vous en êtes</h2>
        <p>Quelques lignes suffisent pour commencer. Je vous réponds personnellement, généralement sous deux jours ouvrables.</p>
      </div>
      {% set contactFormId = 'contact-form-fr' %}
      {% include "contact-form.njk" %}
    </article>

    <aside class="contact-aside">
      <section class="contact-channel-card section-card bg-white">
        <h2 class="text-xl font-semibold text-[#0A6BCE]">Vous préférez un échange direct&nbsp;?</h2>
        <p>Choisissez le canal qui vous convient le mieux.</p>
        <a href="https://wa.me/message/J3EROZAQFOSJM1" target="_blank" rel="noopener noreferrer" class="contact-whatsapp">Écrire sur WhatsApp</a>
        <p class="contact-channel-note">Messages textuels ou vocaux — le canal le plus rapide.</p>
        <p class="contact-phone-line">Par téléphone : <a href="tel:+41766738311">+41 76 673 83 11</a> — appelez et laissez un message, je rappelle sous 24&nbsp;h.</p>
        <p class="contact-email-line"><a href="#" id="contact-email-link" class="text-[#0A6BCE] hover:underline"></a></p>
      </section>

      <section class="contact-map-card section-card bg-white">
        <div class="contact-map-heading">
          <h2 class="text-xl font-semibold text-[#0A6BCE]">Repère géographique</h2>
          <p>Instants Zen Sàrl · 1782 Belfaux, Suisse</p>
        </div>
        <div class="contact-map-frame">
          <iframe
            title="Carte de Belfaux, Suisse"
            src="https://www.google.com/maps?q=1782+Belfaux,+Suisse&amp;output=embed"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen></iframe>
        </div>
        <p class="contact-map-note">Les accompagnements se déroulent principalement en ligne. Si votre activité est géographiquement proche de chez moi (en Suisse romande), je me déplace aussi volontiers.</p>
        <a href="https://www.google.com/maps/search/?api=1&amp;query=1782+Belfaux+Suisse" target="_blank" rel="noopener noreferrer" class="contact-map-link">Ouvrir dans Google Maps →</a>
      </section>
    </aside>
  </div>

  <section class="contact-testimonials" aria-labelledby="contact-testimonials-title">
    <div class="contact-testimonials-heading text-center">
      <h2 id="contact-testimonials-title" class="text-3xl font-semibold text-[#0A6BCE]">
        Quelques avis d’entrepreneurs que j’ai eu la chance d’accompagner
      </h2>
    </div>
    {% set testimonialsCarousel = true %}
    {% include "testimonials.njk" %}
    <p class="text-center mt-6 text-[#1f1f1f]/75">
      Vous en trouverez encore beaucoup d’autres <a href="{{ '/accompagnement/individuel/#temoignages' | relativeUrl }}" class="text-[#0A6BCE] hover:underline font-semibold">ici</a>.
    </p>
  </section>
</section>

<script>
  // Protection anti-spam : construction dynamique de l'adresse e-mail.
  (function() {
    const emailParts = ['support', 'fluance', 'io'];
    const email = emailParts[0] + '@' + emailParts[1] + '.' + emailParts[2];
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink) {
      emailLink.href = 'mailto:' + email;
      emailLink.textContent = email;
    }
  })();
</script>

<script>
  // Carrousel de témoignages : défilement fluide avec boutons précédent/suivant.
  (function () {
    var carousel = document.querySelector('[data-testimonials-carousel]');
    if (!carousel) return;
    var track = carousel.querySelector('[data-testimonials-track]');
    var prevBtn = carousel.querySelector('[data-testimonials-prev]');
    var nextBtn = carousel.querySelector('[data-testimonials-next]');
    var status = carousel.querySelector('[data-testimonials-status]');
    if (!track || !prevBtn || !nextBtn || !status) return;
    var items = Array.prototype.slice.call(track.children);
    if (items.length === 0) return;

    var mqTwo = window.matchMedia('(min-width: 640px)');
    var mqThree = window.matchMedia('(min-width: 1024px)');
    var GAP = 1.5 * 16; // 1.5rem

    function perPage() {
      if (mqThree.matches) return 3;
      if (mqTwo.matches) return 2;
      return 1;
    }

    function step() {
      return items[0].getBoundingClientRect().width + GAP;
    }

    function maxIndex() {
      return Math.max(0, items.length - perPage());
    }

    function currentIndex() {
      return Math.min(maxIndex(), Math.max(0, Math.round(track.scrollLeft / step())));
    }

    function update() {
      var index = currentIndex();
      var page = Math.floor(index / perPage()) + 1;
      var pages = Math.max(1, Math.ceil(items.length / perPage()));
      status.textContent = page + ' / ' + pages;
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= maxIndex();
    }

    function go(index) {
      track.scrollTo({
        left: Math.min(maxIndex(), Math.max(0, index)) * step(),
        behavior: 'smooth'
      });
    }

    prevBtn.addEventListener('click', function () { go(currentIndex() - perPage()); });
    nextBtn.addEventListener('click', function () { go(currentIndex() + perPage()); });

    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(currentIndex() - perPage());
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(currentIndex() + perPage());
      }
    });

    window.addEventListener('resize', update);
    update();
  })();
</script>
