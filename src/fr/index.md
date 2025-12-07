---
layout: base.njk
title: Accueil
description: "Fluance Pro : accompagnement pour entrepreneurs et indépendants. Retrouve fluidité, clarté stratégique et sérénité dans ton activité professionnelle."
locale: fr
---

<section id="fond-cedric" class="relative min-h-screen flex items-center justify-end px-6 md:px-12 pt-32 pb-20 overflow-hidden -mt-28">
  <div class="absolute inset-0 z-0">
    {% image "assets/img/fond-cedric.jpg", "Cédric Vonlanthen au bord du lac", "w-full h-full object-cover object-center md:object-right", "eager", "high", "1280", "960" %}
    <!-- Mobile: fond bleu uniforme -->
    <div class="absolute inset-0 bg-[#648ED8]/80 md:hidden"></div>
    <!-- Desktop: dégradé -->
    <div class="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-[#648ED8]/70 to-[#648ED8]/90"></div>
  </div>
  <div class="relative z-10 max-w-2xl text-white space-y-8">
    <div class="space-y-4">
      <h1 class="text-4xl md:text-6xl font-semibold leading-tight">
        Retrouve la fluidité<br>
        dans ton activité professionnelle.<br>
        Clarté stratégique et sérénité.
      </h1>
      <p class="text-lg md:text-xl text-white/90">
        Accompagnement individuel pour entrepreneurs et indépendants.<br><br>
        Sors du stress, de la surcharge et de l'éparpillement.<br>
        (Re)trouve un modèle d'affaires qui te correspond pleinement.
      </p>
    </div>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="{{ '/accompagnement/individuel/' | relativeUrl }}" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] text-center flex flex-col">
        <span>Découvrir l'accompagnement</span>
        <span class="text-sm font-normal opacity-90">pour entrepreneurs</span>
      </a>
      <a href="{{ '/rdv/clarte/' | relativeUrl }}" class="btn-secondary border-white/80 text-white hover:bg-white/10 text-center flex flex-col">
        <span>Workshop clarté</span>
        <span class="text-sm font-normal opacity-90">en ligne, chaque mois</span>
      </a>
    </div>
  </div>
</section>

<section class="max-w-6xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-[2fr_1fr] gap-8 items-center">
  <div class="text-left space-y-4">
    <h2 class="text-3xl md:text-4xl font-semibold text-[#0f172a]">Qu'est-ce que Fluance Pro ?</h2>
    <p class="text-lg md:text-xl text-[#0f172a]/75">
      Fluance Pro est un accompagnement individuel pour entrepreneurs et indépendants.<br><br>
      Il t'aide à retrouver la <strong>clarté stratégique</strong> et la <strong>fluidité opérationnelle</strong> dans ton activité professionnelle.
    </p>
  </div>
  <a href="{{ '/a-propos/approche-fluance/' | relativeUrl }}" class="section-card overflow-hidden max-w-xs mx-auto md:mx-0 block hover:opacity-90 transition-opacity">
    <div class="aspect-square overflow-hidden relative">
      <img src="{{ '/assets/img/schema-fluance-pro.webp' | relativeUrl }}" alt="Schéma Fluance Pro" class="w-full h-full object-cover object-center" style="transform: scale(1.0); transform-origin: center;" loading="lazy">
    </div>
  </a>
</section>

<section class="max-w-6xl mx-auto px-6 md:px-12 py-16 space-y-12">
  <div class="text-left space-y-4">
    <h3 class="text-2xl md:text-3xl font-semibold text-[#0f172a]">Sortir du stress et de la surcharge</h3>
    <p class="text-lg text-[#0f172a]/75">
       En tant qu'entrepreneur ou indépendant, tu fais face à de nombreux défis : gestion du temps, charge de travail, pression financière, décisions stratégiques...<br /><br />
       Fluance Pro t'accompagne pour sortir de ces tensions et retrouver une approche plus fluide et sereine de ton activité professionnelle.
    </p>
  </div>
  <div class="grid md:grid-cols-2 gap-8 items-center">
    <div class="section-card overflow-hidden mx-auto md:mx-0">
      {% image "assets/img/approche-3-axes.webp", "Approche unique en 3 axes pour une activité rayonnante", "w-full h-auto object-contain", "lazy", "", "980", "479" %}
    </div>
    <div class="text-left space-y-4">
      <h3 class="text-2xl md:text-3xl font-semibold text-[#0f172a]">Un modèle d'affaires qui te correspond</h3>
      <p class="text-lg text-[#0f172a]/75">
        Parfois, le stress et la surcharge viennent d'un modèle d'affaires qui ne te correspond plus ou qui n'a jamais vraiment été aligné avec tes valeurs et tes aspirations.<br /><br />
        L'accompagnement Fluance Pro t'aide à (re)trouver un modèle d'affaires qui te correspond pleinement, en harmonie avec qui tu es et ce que tu souhaites créer.
      </p>
    </div>
  </div>
</section>

<section class="max-w-6xl mx-auto px-6 md:px-12 py-16">
  <div class="text-center space-y-4 mb-12">
    <h2 class="text-3xl font-semibold text-[#0A6BCE]">Prêt·e à retrouver la fluidité ?</h2>
  </div>
  <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12 mt-12">
    <a href="{{ '/accompagnement/individuel/' | relativeUrl }}" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] text-center flex flex-col">
      <span>Découvrir l'accompagnement</span>
      <span class="text-sm font-normal opacity-90">pour entrepreneurs</span>
    </a>
    <a href="{{ '/contact/' | relativeUrl }}" class="inline-flex flex-col items-center justify-center rounded-full border-[3px] border-[#0A6BCE] text-[#0A6BCE] bg-white hover:bg-[#0A6BCE] hover:text-white px-6 py-3 font-bold shadow-lg transition-all duration-200">
      <span>Prendre contact</span>
      <span class="text-sm font-normal opacity-90">échange gratuit</span>
    </a>
  </div>

  <!-- Widget Senja -->
  <div class="text-center space-y-4 mb-8">
    <h2 class="text-3xl font-semibold text-[#0A6BCE]">Ce qu'ils en disent</h2>
  </div>
  <script src="https://widget.senja.io/widget/394c3378-ecb6-40fa-bbcd-de175ee23c25/platform.js" type="text/javascript" async></script>
  <div class="senja-embed" data-id="394c3378-ecb6-40fa-bbcd-de175ee23c25" data-mode="shadow" data-lazyload="false" style="display: block; width: 100%;"></div>

  <div class="flex flex-col sm:flex-row gap-4 justify-center mt-12">
    <a href="{{ '/accompagnement/individuel/' | relativeUrl }}" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] text-center flex flex-col">
      <span>Découvrir l'accompagnement</span>
      <span class="text-sm font-normal opacity-90">pour entrepreneurs</span>
    </a>
    <a href="{{ '/contact/' | relativeUrl }}" class="inline-flex flex-col items-center justify-center rounded-full border-[3px] border-[#0A6BCE] text-[#0A6BCE] bg-white hover:bg-[#0A6BCE] hover:text-white px-6 py-3 font-bold shadow-lg transition-all duration-200">
      <span>Prendre contact</span>
      <span class="text-sm font-normal opacity-90">échange gratuit</span>
    </a>
  </div>
</section>
