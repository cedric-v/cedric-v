---
layout: base.njk
title: Contact
description: Let’s talk about your situation and identify the next useful step for your business.
locale: en
newsletterPopup: false
contactPage: true
permalink: /en/contact/
templateEngineOverride: njk
---

<section class="contact-page max-w-6xl mx-auto px-6 md:px-12 py-16 space-y-12">
  <header class="contact-hero text-center space-y-5">
    <p class="cta-pill">Let’s talk about your situation</p>
    <h1 class="text-4xl md:text-5xl font-semibold text-[#0f172a]">A first conversation to regain clarity</h1>
    <p class="text-xl text-[#1f1f1f]/80 max-w-3xl mx-auto">
      You do not need to have the perfect question yet. Simply describe what is on your mind; I will reply with a clear first direction.
    </p>
  </header>

  <div class="contact-main-grid">
    <article class="contact-form-card section-card bg-white">
      <div class="contact-card-heading">
        <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">Tell me where you are</h2>
        <p>A few lines are enough to get started. I will reply personally, usually within two business days.</p>
      </div>
      {% set contactFormId = 'contact-form-en' %}
      {% include "contact-form.njk" %}
    </article>

    <aside class="contact-aside">
      <section class="contact-channel-card section-card bg-white">
        <h2 class="text-xl font-semibold text-[#0A6BCE]">Prefer a direct conversation?</h2>
        <p>Choose the channel that suits you best.</p>
        <a href="https://wa.me/message/J3EROZAQFOSJM1" target="_blank" rel="noopener noreferrer" class="contact-whatsapp">Write on WhatsApp</a>
        <p class="contact-channel-note">Text or voice messages, no calls.</p>
        <p class="contact-email-line"><a href="#" id="contact-email-link-en" class="text-[#0A6BCE] hover:underline"></a></p>
      </section>

      <section class="contact-map-card section-card bg-white">
        <div class="contact-map-heading">
          <h2 class="text-xl font-semibold text-[#0A6BCE]">Geographic reference</h2>
          <p>Instants Zen Sàrl · 1782 Belfaux, Switzerland</p>
        </div>
        <div class="contact-map-frame">
          <iframe
            title="Map of Belfaux, Switzerland"
            src="https://www.google.com/maps?q=1782+Belfaux,+Switzerland&amp;output=embed"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen></iframe>
        </div>
        <p class="contact-map-note">Coaching sessions mainly take place online. This address is the registered postal address.</p>
        <a href="https://www.google.com/maps/search/?api=1&amp;query=1782+Belfaux+Switzerland" target="_blank" rel="noopener noreferrer" class="contact-map-link">Open in Google Maps →</a>
      </section>
    </aside>
  </div>
</section>

<script>
  // Spam protection: build the email address dynamically.
  (function() {
    const emailParts = ['support', 'fluance', 'io'];
    const email = emailParts[0] + '@' + emailParts[1] + '.' + emailParts[2];
    const emailLink = document.getElementById('contact-email-link-en');
    if (emailLink) {
      emailLink.href = 'mailto:' + email;
      emailLink.textContent = email;
    }
  })();
</script>
