---
layout: base.njk
title: Fluance Individuals - Fluance Pro
description: "Discover Fluance, the approach to release tension and regain fluidity in your body."
locale: en
permalink: /en/fluance-particuliers/
---

<section id="fond-cedric-fluance" class="relative min-h-screen flex items-center justify-end px-6 md:px-12 pt-32 pb-20 overflow-hidden -mt-28">
  <div class="absolute inset-0 z-0">
    {% image "assets/img/cedric-dehors-fluance.jpg", "Cédric Vonlanthen in nature", "w-full h-full object-cover object-center md:object-right", "eager", "high", "1280", "960" %}
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[#648ED8]/70 to-[#648ED8]/90"></div>
  </div>
  <div class="relative z-10 max-w-2xl text-white space-y-8">
    <div class="space-y-4">
      <h1 class="text-4xl md:text-6xl font-semibold leading-tight">
        Fluance Individuals
      </h1>
      <p class="text-lg md:text-xl text-white/90">
        Release tension and regain fluidity in your body.
      </p>
    </div>
    <div class="flex flex-col sm:flex-row gap-4">
      <button onclick="const target = document.querySelector('#fluance-content'); const offset = 100; const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset; window.scrollTo({ top: targetPosition, behavior: 'smooth' });" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] text-center flex flex-col">
        <span>Discover this new approach <span>↓</span></span>
      </button>
    </div>
  </div>
</section>

<section id="fluance-content" class="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-12">
  <article class="max-w-none space-y-8 text-[#1f1f1f]">
    <div class="section-card p-8 bg-white space-y-6">
      <div class="space-y-4 text-lg leading-relaxed text-[#0f172a]/80">
        <p>
          In addition to the coaching for entrepreneurs, I also help <strong>everyone release tension and regain fluidity in their body</strong> through <strong>Fluance</strong>.
        </p>
        <p>
          Fluance is a new approach to the relationship with the body and its tensions. Through conscious movement and its playful aspect, it progressively rebalances your nervous system, brings mental clarity and provides vitality.
        </p>
        <p>
          No equipment necessary. No prerequisites.
        </p>
      </div>
    </div>

    <div class="text-center">
      <a href="https://fluance.io/en/" target="_blank" rel="noopener noreferrer" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] inline-flex items-center gap-2">
        Discover Fluance
        <span>→</span>
      </a>
    </div>
  </article>
</section>

