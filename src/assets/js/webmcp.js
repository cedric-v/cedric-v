(async function () {
  if (typeof window === "undefined") return;
  if (window.__cedricvWebMcpRegistered) return;

  const modelContext = navigator.modelContext;
  if (!modelContext || typeof modelContext.registerTool !== "function") return;

  const currentPage = window.__cedricvCurrentPage || {};
  const response = await fetch("/.well-known/webmcp-context.json", {
    headers: { Accept: "application/json" }
  }).catch(() => null);

  if (!response || !response.ok) return;

  const context = await response.json().catch(() => null);
  if (!context) return;

  const keyPages = Array.isArray(context.keyPages) ? context.keyPages : [];
  const site = context.site || {};

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function searchPages(query, locale, category, limit) {
    const normalizedQuery = normalize(query);
    const normalizedLocale = normalize(locale);
    const normalizedCategory = normalize(category);

    return keyPages
      .filter((page) => {
        if (normalizedLocale && normalize(page.locale) !== normalizedLocale) {
          return false;
        }

        if (normalizedCategory && normalize(page.category) !== normalizedCategory) {
          return false;
        }

        if (!normalizedQuery) return true;

        const haystack = normalize([
          page.title,
          page.description,
          page.category,
          page.path,
          page.locale
        ].join(" "));

        return haystack.includes(normalizedQuery);
      })
      .slice(0, Math.max(1, Math.min(Number(limit) || 5, 10)));
  }

  function resolveTarget(input) {
    const requested = String(input || "").trim();
    if (!requested) return null;

    const directMatch = keyPages.find(
      (page) => page.path === requested || page.url === requested
    );
    if (directMatch) return directMatch;

    try {
      const url = new URL(requested, window.location.origin);
      if (url.origin !== window.location.origin) {
        return null;
      }

      return keyPages.find(
        (page) => page.path === url.pathname || page.url === url.href
      ) || {
        title: url.pathname,
        url: url.href,
        path: url.pathname,
        locale: "",
        category: "direct",
        description: "Direct same-origin navigation target."
      };
    } catch (error) {
      return null;
    }
  }

  modelContext.registerTool({
    name: "get_site_profile",
    title: "Get Site Profile",
    description:
      "Return Fluance Pro site metadata, key discovery endpoints, and the main user journeys.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {}
    },
    async execute() {
      return {
        site,
        discovery: {
          apiCatalog: "/.well-known/api-catalog",
          serviceDesc: "/.well-known/service-desc.json",
          mcpServerCard: "/.well-known/mcp/server-card.json",
          agentSkillsIndex: "/.well-known/agent-skills/index.json",
          llms: "/llms.txt"
        },
        journeys: [
          "Learn about the Fluance approach",
          "Review the website offer",
          "Open the contact page",
          "Book a clarity meeting"
        ]
      };
    }
  });

  modelContext.registerTool({
    name: "get_current_page",
    title: "Get Current Page",
    description: "Return structured metadata about the current page in the active tab.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {}
    },
    async execute() {
      return currentPage;
    }
  });

  modelContext.registerTool({
    name: "find_site_pages",
    title: "Find Site Pages",
    description:
      "Search Fluance Pro key pages by keyword, locale, and category, then return the best matching URLs.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "string" },
        locale: { type: "string", enum: ["fr", "en"] },
        category: { type: "string" },
        limit: { type: "integer", minimum: 1, maximum: 10 }
      }
    },
    async execute(input) {
      return {
        matches: searchPages(input.query, input.locale, input.category, input.limit)
      };
    }
  });

  modelContext.registerTool({
    name: "open_site_page",
    title: "Open Site Page",
    description:
      "Navigate the current tab to a validated same-origin Fluance Pro page selected by path or absolute URL.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["target"],
      properties: {
        target: {
          type: "string",
          description: "A same-origin path like /contact/ or a full https://cedricv.com URL."
        }
      }
    },
    async execute(input, client) {
      const target = resolveTarget(input.target);
      if (!target) {
        return {
          ok: false,
          error: "Unknown or unsafe navigation target."
        };
      }

      const navigate = () => {
        window.location.assign(target.url);
        return Promise.resolve({
          ok: true,
          navigated: true,
          target
        });
      };

      if (client && typeof client.requestUserInteraction === "function") {
        return client.requestUserInteraction(navigate);
      }

      return navigate();
    }
  });

  window.__cedricvWebMcpRegistered = true;
})().catch(() => {
  // Fail closed: the site should behave normally when WebMCP is unavailable.
});
