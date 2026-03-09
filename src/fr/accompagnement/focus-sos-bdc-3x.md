---
layout: base.njk
title: "Validation de votre inscription - Focus SOS"
description: "Paiement en ligne sécurisé pour le programme d'accompagnement Focus SOS par Cédric Vonlanthen."
locale: fr
permalink: /accompagnement/formules/focus-sos/bdc/3x/
eleventyExcludeFromCollections: true
---

<section class="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 py-16 space-y-12">
  <header class="text-center space-y-6">
    <h1 class="text-4xl md:text-5xl font-semibold text-[#0A6BCE]">
      Validation de votre inscription
    </h1>
    <p class="text-xl text-[#0f172a]/80">
      Accompagnement individuel : <strong>Focus SOS</strong>
    </p>
  </header>

  <div class="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-8">
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-[#0A6BCE]">Récapitulatif de votre commande</h2>
      <ul class="space-y-3 text-[#0f172a]/80">
        <li class="flex items-start gap-3">
          <svg class="text-green-500 shrink-0" style="width: 1.5rem; height: 1.5rem; min-width: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <span>1 session de coaching-consulting-mentoring (60 min)</span>
        </li>
        <li class="flex items-start gap-3">
          <svg class="text-green-500 shrink-0" style="width: 1.5rem; height: 1.5rem; min-width: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <span>Accès à la rediffusion après la séance</span>
        </li>
      </ul>
    </div>

    <div class="border-t border-[#0A6BCE]/20 pt-8">
      <h2 class="text-2xl font-semibold text-[#0A6BCE] mb-6">Choisissez votre modalité de paiement</h2>
      
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Option 1 fois -->
        <div class="section-card p-6 bg-white border border-gray-200 flex flex-col rounded-xl hover:border-[#0A6BCE] transition-colors">
          <div class="text-center mb-6">
            <h3 class="text-xl font-semibold text-[#0f172a] mb-2">Paiement unique</h3>
            <div class="text-3xl font-bold text-[#0A6BCE] my-4">300 CHF</div>
            <p class="text-sm text-[#0f172a]/60">Paiement sécurisé via Mollie</p>
          </div>
          <div class="mt-auto">
            <button onclick="window.CedricVPayment && window.CedricVPayment.redirectToMollie('focus-sos', 'fr', event, 'unique')" class="btn-primary inline-flex items-center gap-2 w-full justify-center">
              Payer 300 CHF
            </button>
          </div>
        </div>

        <!-- Option 3 fois -->
        <div class="section-card p-6 bg-white border-2 border-[#0A6BCE] flex flex-col relative rounded-xl hover:shadow-md transition-shadow">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <div class="bg-[#0A6BCE] text-white px-4 py-1 rounded-full text-sm font-semibold">Mensuel</div>
          </div>
          <div class="text-center mb-6">
            <h3 class="text-xl font-semibold text-[#0f172a] mb-2">Paiement en 3 fois</h3>
            <div class="text-3xl font-bold text-[#0A6BCE] my-4">3 x 100 CHF</div>
            <p class="text-sm text-[#0f172a]/60">Paiement sécurisé via Mollie</p>
          </div>
          <div class="mt-auto">
            <button onclick="window.CedricVPayment && window.CedricVPayment.redirectToMollie('focus-sos', 'fr', event, '3x')" class="btn-primary flex-col items-center gap-1 w-full justify-center text-center">
              <span>S'abonner (3x 100 CHF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pt-6 text-center text-sm text-[#0f172a]/60">
      <p>Paiements traités de manière sécurisée par Mollie (cartes de crédit, Twint, Apple Pay, etc.)</p>
      <p class="mt-2 text-xs">En validant votre paiement, vous acceptez nos <a href="/cgv/" class="text-[#0A6BCE] underline">conditions générales de vente</a>.</p>
    </div>
  </div>
</section>

<!-- Script de paiement -->
<script src="/assets/js/payment.js?v=2"></script>

