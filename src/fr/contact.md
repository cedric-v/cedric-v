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
        <p class="contact-channel-note">Messages textuels ou vocaux, pas d’appel.</p>
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
        <p class="contact-map-note">Les accompagnements se déroulent principalement en ligne. Cette adresse correspond au siège postal.</p>
        <a href="https://www.google.com/maps/search/?api=1&amp;query=1782+Belfaux+Suisse" target="_blank" rel="noopener noreferrer" class="contact-map-link">Ouvrir dans Google Maps →</a>
      </section>
    </aside>
  </div>
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
