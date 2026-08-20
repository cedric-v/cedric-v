---
layout: "base.njk"
title: "Regain fluidity and clarity in your activity"
description: "Fluance Pro: coaching for entrepreneurs and independents. Regain fluidity, strategic clarity and serenity in your professional activity."
locale: "en"
permalink: "/en/"
ogImage: "assets/img/miniature-cedricv-accueil-en.jpg"
---



<section id="fond-cedric" class="relative min-h-screen flex items-center justify-end px-6 md:px-12 pt-32 pb-20 overflow-hidden -mt-28" style="min-height: 100vh; background-color: #356DAE;">
  <div class="absolute inset-0 z-0">
    {% image "assets/img/fond-cedric.jpg", "Cédric Vonlanthen by the lake", "w-full h-full object-cover object-center md:object-right", "eager", "high", "1280", "960", "100vw" %}
    <!-- Mobile: fond bleu uniforme -->
    <div class="absolute inset-0 bg-[#356DAE]/95 md:hidden"></div>
    <!-- Desktop: dégradé -->
    <div class="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-[#4a7cb8]/75 to-[#356DAE]"></div>
  </div>
  <div class="relative z-10 max-w-2xl text-white space-y-8">
    <div class="space-y-4">
      <h1 class="text-4xl md:text-6xl font-semibold leading-tight">
        More clarity. More fluidity.<br>
        More results in your business.
      </h1>
      <p class="text-lg md:text-xl text-white">
        Support tailored to your reality, whether you're an independent, an entrepreneur or an SME leader.
      </p>
    </div>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="{{ '/en/accompagnement/individuel/' | relativeUrl }}" class="flex-1 rounded-2xl border-2 border-white/70 text-white backdrop-blur-sm px-6 py-4 shadow-lg transition-all duration-200 hover:opacity-90" style="background-color: rgba(255, 255, 255, 0.08);">
        <span class="block text-lg font-semibold">I'm an independent / entrepreneur</span>
        <span class="block text-sm font-normal opacity-90 mt-1">Clarify my offer and grow my business →</span>
        <span class="block text-sm font-normal text-white/90 mt-2">Regain clarity in your positioning, your offer and your strategy to grow a business that suits you.</span>
      </a>
      <a href="{{ '/en/digital-manager/' | relativeUrl }}" class="flex-1 rounded-2xl border-2 border-white/70 text-white backdrop-blur-sm px-6 py-4 shadow-lg transition-all duration-200 hover:opacity-90" style="background-color: rgba(255, 255, 255, 0.08);">
        <span class="block text-lg font-semibold">I run a small business / SME</span>
        <span class="block text-sm font-normal opacity-90 mt-1">Start with the Diagnostic Clarté →</span>
        <span class="block text-sm font-normal text-white/90 mt-2">Take back control of your digital, simplify your tools and leverage AI to gain efficiency and move your projects forward.</span>
      </a>
    </div>
  </div>
</section>

<section class="max-w-6xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-[2fr_1fr] gap-8 items-center">
  <div class="text-left space-y-4">
    <h2 class="text-3xl md:text-4xl font-semibold text-[#0f172a]">What is Fluance Pro?</h2>
    <p class="text-lg md:text-xl text-[#0f172a]/75">
      Fluance Pro is individual coaching for entrepreneurs and independents.<br><br>
      It helps you regain <strong>strategic clarity</strong> and <strong>operational fluidity</strong> in your professional activity.
    </p>
  </div>
  <a href="{{ '/en/a-propos/approche-fluance/' | relativeUrl }}" class="section-card overflow-hidden max-w-xs mx-auto md:mx-0 block hover:opacity-90 transition-opacity">
    <div class="aspect-square overflow-hidden relative">
      {% image "assets/img/schema-fluance-pro.webp", "Fluance Pro diagram", "w-full h-full object-cover object-center", "lazy", "", "", "", "transform: scale(1.0); transform-origin: center;" %}
    </div>
  </a>
</section>

<section class="max-w-6xl mx-auto px-6 md:px-12 py-16 space-y-12">
  <div class="text-left space-y-4">
    <h3 class="text-2xl md:text-3xl font-semibold text-[#0f172a]">Getting out of stress and overload</h3>
    <p class="text-lg text-[#0f172a]/75">
       As an entrepreneur or independent, you face many challenges: time management, workload, financial pressure, strategic decisions...<br /><br />
       Fluance Pro accompanies you to get out of these tensions and regain a more fluid and serene approach to your professional activity.
    </p>
  </div>
  <div class="grid md:grid-cols-2 gap-8 items-center">
    <div class="section-card overflow-hidden mx-auto md:mx-0">
      {% image "assets/img/approche-3-axes.webp", "Unique 3-axis approach for a thriving business", "w-full h-auto object-contain", "lazy", "", "980", "479" %}
    </div>
    <div class="text-left space-y-4">
      <h3 class="text-2xl md:text-3xl font-semibold text-[#0f172a]">A business model that fits you</h3>
      <p class="text-lg text-[#0f172a]/75">
        Sometimes, stress and overload come from a business model that no longer fits you or that was never really aligned with your values and aspirations.<br /><br />
        Fluance Pro coaching helps you (re)find a business model that fully fits you, in harmony with who you are and what you want to create.
      </p>
    </div>
  </div>
</section>

<section class="max-w-6xl mx-auto px-6 md:px-12 py-16">
  <div class="text-center space-y-4 mb-12">
    <h2 class="text-3xl font-semibold text-[#0A6BCE]">Ready to regain fluidity?</h2>
  </div>
  <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12 mt-12">
    <a href="{{ '/en/accompagnement/individuel/' | relativeUrl }}" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] text-center flex flex-col">
      <span>Discover the coaching</span>
      <span class="text-sm font-normal opacity-90">for entrepreneurs</span>
    </a>
  </div>

  <!-- Client Testimonials -->
  <div class="text-center space-y-4 mb-8">
    <h2 class="text-3xl font-semibold text-[#0A6BCE]">What they say</h2>
  </div>
  {% include "testimonials.njk" %}

  <div class="flex flex-col sm:flex-row gap-4 justify-center mt-12">
    <a href="{{ '/en/accompagnement/individuel/' | relativeUrl }}" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] text-center flex flex-col">
      <span>Discover the coaching</span>
      <span class="text-sm font-normal opacity-90">for entrepreneurs</span>
    </a>
    <a href="{{ '/en/rdv/clarte/' | relativeUrl }}" class="inline-flex flex-col items-center justify-center rounded-full border-[3px] border-[#0A6BCE] text-[#0A6BCE] bg-white hover:bg-[#0A6BCE] hover:text-white px-6 py-3 font-bold shadow-lg transition-all duration-200">
      <span>Clarity Meeting</span>
      <span class="text-sm font-normal opacity-90">online, every month</span>
    </a>
  </div>
</section>
