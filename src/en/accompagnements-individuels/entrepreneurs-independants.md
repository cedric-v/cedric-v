---
layout: base.njk
title: Redirect - Individual Coaching
description: Redirect to individual coaching page
locale: en
permalink: /en/accompagnements-individuels/entrepreneurs-independants/
redirect: /en/accompagnements-individuels/accompagnement-individuel/
---

<script>
  // Immediate redirect to the new page
  window.location.replace('{{ "/en/accompagnements-individuels/accompagnement-individuel/" | relativeUrl }}');
</script>

<div class="flex items-center justify-center min-h-[60vh]">
  <div class="text-center space-y-4">
    <p class="text-lg text-[#0f172a]/80">
      Redirecting...
    </p>
    <a href="{{ '/en/accompagnements-individuels/accompagnement-individuel/' | relativeUrl }}" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] inline-block">
      Go to coaching page
    </a>
  </div>
</div>

