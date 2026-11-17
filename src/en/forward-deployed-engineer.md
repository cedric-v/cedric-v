---
layout: "base.njk"
title: "Forward Deployed Engineer: the role that builds AI inside the client's company"
description: "Forward Deployed Engineer (FDE): an engineer who designs, builds and deploys AI inside the company instead of advising. What it changes for an SME."
locale: "en"
permalink: "/en/forward-deployed-engineer/"
date: "2026-11-17"
translation: "/forward-deployed-engineer/"
---

<section class="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-12">
  <header class="space-y-4 text-center">
    <h1 class="text-4xl md:text-5xl font-semibold text-[#0f172a] p-name">
      Forward Deployed Engineer: the role that builds AI inside the client's company
    </h1>
  </header>

  <article class="max-w-none space-y-8 text-[#1f1f1f] prose prose-lg h-entry">

    <div class="section-card p-8 bg-white space-y-6">
      <p class="text-xl leading-relaxed">Most companies don't have an AI problem. They have an execution problem.</p>
      <p class="text-lg leading-relaxed">Over the past two years, almost every SME has tried ChatGPT. One team member uses it to write a difficult email, another to summarise a contract, a third to draft a sales reply. The gain is real, but it stays individual, informal and hard to measure.</p>
      <p class="text-lg leading-relaxed">The prototype that impressed everyone in the demo never made it to production. The data is spread across three systems, the ERP has no open API, the process is half manual, and nobody really knows who is supposed to validate the model's output.</p>
      <p class="text-lg leading-relaxed">That gap is exactly what a still little-known role fills: the <strong>Forward Deployed Engineer</strong>.</p>
    </div>

    <div class="section-card p-8 bg-white space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">What is a Forward Deployed Engineer?</h2>
      <p class="text-lg leading-relaxed">"Forward deployed" means deployed at the front, in contact. An FDE is an engineer who leaves headquarters to work inside the client's real environment, with its data, its tools and its constraints.</p>
      <p class="text-lg leading-relaxed">The term was popularised by Palantir, which sent engineers to clients with highly heterogeneous systems (industrial groups, institutions, large organisations) to connect data and build tools on site. AI companies then adopted the model, where it takes a very concrete form: integrating language models into enterprise systems that were never designed for them.</p>
      <p class="text-lg leading-relaxed">The key difference with neighbouring roles fits in one sentence: an FDE doesn't deliver a report or a demo. It delivers a system that runs, that people use on Monday morning, and whose result can be measured.</p>
    </div>

    <div class="section-card p-8 bg-white space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">What sets it apart from neighbouring roles</h2>
      <p class="text-lg leading-relaxed">The skills often overlap. What changes is the responsibility taken at the end of the assignment.</p>
      <ul class="text-lg leading-relaxed space-y-2">
        <li><strong>Consultant</strong>: analyses and recommends. Responsible for the recommendation.</li>
        <li><strong>Developer</strong>: builds from specifications. Responsible for the code.</li>
        <li><strong>Architect</strong>: designs. Responsible for technical coherence.</li>
        <li><strong>Project manager</strong>: steers time, budget and resources. Responsible for the project.</li>
        <li><strong>Solution Engineer</strong>: demonstrates and adapts before the sale. Responsible for the demo.</li>
        <li><strong>Forward Deployed Engineer</strong>: builds and deploys at the client. Responsible for the result in production.</li>
      </ul>
    </div>

    <div class="section-card p-8 bg-white space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">What an assignment actually looks like</h2>
      <p class="text-lg leading-relaxed">Take an SME that processes its supplier invoices by hand. Here is how that kind of assignment unfolds.</p>
      <ol class="text-lg leading-relaxed space-y-3">
        <li><strong>Understand.</strong> Half a day with the person who actually does the work, not only with management. That's where the real exceptions surface.</li>
        <li><strong>Analyse what exists.</strong> Where invoices arrive, in which formats, who opens them, which accounting system is used, which data is already reliable and which isn't.</li>
        <li><strong>Design.</strong> Information extraction with a model, consistency checks, a queue for human validation, then writing into the accounting tool.</li>
        <li><strong>Prototype.</strong> Two or three days on fifty real invoices, not on carefully selected examples.</li>
        <li><strong>Deploy.</strong> Access rights, logging, error handling, a fallback procedure when the model gets it wrong.</li>
        <li><strong>Measure.</strong> Time per invoice, error rate, cost per processed document.</li>
      </ol>
      <p class="text-lg leading-relaxed">The prototype takes a few days. Reliability takes a few weeks. That is exactly where most AI projects stop: nobody planned the time to make the thing reliable.</p>
    </div>

    <div class="section-card p-8 bg-white space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">Why it matters so much with AI</h2>
      <p class="text-lg leading-relaxed">A language model isn't classic software. It is sometimes wrong, in unpredictable ways, and with a lot of confidence. So AI integration isn't about "calling an API": it's about designing a system that accepts errors without breaking the process.</p>
      <p class="text-lg leading-relaxed">The skills actually involved are:</p>
      <ul class="text-lg leading-relaxed space-y-2">
        <li>connecting a model to the company's internal data (RAG, indexes, permissions);</li>
        <li>building agents that can use tools and chain actions;</li>
        <li>handling access rights, confidentiality and traceability;</li>
        <li>measuring reliability, costs and performance;</li>
        <li>planning for errors and human checkpoints.</li>
      </ul>
      <p class="text-lg leading-relaxed">Important point: an FDE doesn't need to train models. The work is to assemble existing building blocks and make them reliable in a given environment.</p>
    </div>

    <div class="section-card p-8 bg-white space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">What it changes for an SME</h2>
      <p class="text-lg leading-relaxed">An SME doesn't need a data scientist or a research department. It needs someone who takes on the real constraints: an ERP installed twelve years ago with no API, Excel files that keep production running, a process only one person in the company truly knows.</p>
      <p class="text-lg leading-relaxed">At our scale, that's actually an advantage: small structures, fast decisions, and a single person who can cover a need end to end.</p>
      <p class="text-lg leading-relaxed">The most frequent cases look like this: lead qualification, preparation of sales proposals, email processing and classification, extracting information from documents, automated reporting, an internal assistant based on the company's documents.</p>
    </div>

    <div class="section-card p-8 bg-white space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">The limits, before you start</h2>
      <p class="text-lg leading-relaxed">This model has a classic flaw: becoming the dedicated developer of every client. If each assignment starts from scratch, the engineer burns out and the client becomes dependent on one person. The answer lies in three habits: standardise reusable building blocks, document, and transfer knowledge to internal teams.</p>
      <p class="text-lg leading-relaxed">Second limit: dependency on one person. A system whose operation is understood only by its designer is a risk, not progress.</p>
      <p class="text-lg leading-relaxed">Third limit: promising total autonomy. In an SME, a system with no human checkpoint is rarely a good idea. The right question isn't "how do we remove the human?", but "where is the human genuinely necessary, and where not?".</p>
    </div>

    <div class="section-card p-8 bg-white space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">How I apply it</h2>
      <p class="text-lg leading-relaxed">My path is that of a computer engineer who became a developer, then a product and project manager, before becoming an entrepreneur. I built and operated platforms that served tens of thousands of customers. I also experienced the opposite: accumulated complexity, tools that stopped talking to each other, and the need to simplify everything. That journey is told in <a href="{{ '/en/a-propos/histoire-cedric/' | relativeUrl }}" class="text-[#0A6BCE] hover:underline">my background</a>.</p>
      <p class="text-lg leading-relaxed">Today I don't position myself as a full-time Forward Deployed Engineer. My role remains that of a <strong>fractional Digital Manager</strong>. But I apply this approach in my assignments: understand the need, design the architecture, build, deploy, then measure.</p>
      <p class="text-lg leading-relaxed">In practice, that translates into three formats:</p>
      <ul class="text-lg leading-relaxed space-y-2">
        <li>the <strong>Diagnostic Clarté</strong>, to understand the situation and prioritise what genuinely deserves attention;</li>
        <li>the <strong>AI &amp; Automation Sprint</strong>, to build and deploy a solution on one specific process;</li>
        <li>the <strong>fractional Digital Manager</strong>, to follow the whole picture over time.</li>
      </ul>
      <p class="text-lg leading-relaxed">For independents and entrepreneurs who'd rather clarify their positioning and simplify their activity, the format is different: it's <a href="{{ '/en/accompagnement/individuel/' | relativeUrl }}" class="text-[#0A6BCE] hover:underline">individual coaching</a>.</p>
    </div>

    <div class="section-card p-8 bg-white space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">One question to finish</h2>
      <p class="text-lg leading-relaxed">Does your company have an AI project that works as a pilot but never made it to production? If the answer is yes, the starting point isn't a new tool or a new model. It's understanding why the last attempt never crossed the line.</p>
      <p class="text-lg leading-relaxed">That's exactly what the <a href="{{ '/en/digital-manager/' | relativeUrl }}" class="text-[#0A6BCE] hover:underline">Diagnostic Clarté</a> is for: five hours to look at your real environment, identify friction points and leave with a prioritised roadmap.</p>
    </div>

  </article>

  <!-- CTA -->
  <div class="max-w-4xl mx-auto px-6 md:px-12 pb-16">
    <div class="section-card p-8 bg-white text-center space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">
        An AI project that never made it to production?
      </h2>
      <p class="text-lg text-[#1f1f1f]/80">
        Start by looking at your real situation, your tools and your processes. The <a href="{{ '/en/digital-manager/' | relativeUrl }}" class="text-[#0A6BCE] hover:underline">fractional Digital Manager support</a> begins with a Diagnostic Clarté.
      </p>
      <a href="{{ '/en/digital-manager/' | relativeUrl }}" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] text-center inline-block">
        Discover the Diagnostic Clarté
      </a>
    </div>
  </div>

  {% blogNavigation page, collections %}
</section>
