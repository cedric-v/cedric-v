---
layout: base.njk
title: Redirection - Accompagnement Individuel
description: Redirection vers la page d'accompagnement individuel
locale: fr
permalink: /accompagnements-individuels/entrepreneurs-independants/
redirect: /accompagnements-individuels/accompagnement-individuel/
---

<script>
  // Redirection immédiate vers la nouvelle page
  window.location.replace('{{ "/accompagnements-individuels/accompagnement-individuel/" | relativeUrl }}');
</script>

<div class="flex items-center justify-center min-h-[60vh]">
  <div class="text-center space-y-4">
    <p class="text-lg text-[#0f172a]/80">
      Redirection en cours...
    </p>
    <a href="{{ '/accompagnements-individuels/accompagnement-individuel/' | relativeUrl }}" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] inline-block">
      Accéder à la page d'accompagnement
    </a>
  </div>
</div>

