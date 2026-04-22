module.exports = {
  baseUrl: "https://cedricv.com",
  siteName: "Fluance Pro",
  siteVersion: "1.0.0",
  docsUrl: "https://cedricv.com/docs/api/",
  apiCatalogUrl: "https://cedricv.com/.well-known/api-catalog",
  serviceDescUrl: "https://cedricv.com/.well-known/service-desc.json",
  mcpCardUrl: "https://cedricv.com/.well-known/mcp/server-card.json",
  agentSkillsIndexUrl: "https://cedricv.com/.well-known/agent-skills/index.json",
  webmcpContextUrl: "https://cedricv.com/.well-known/webmcp-context.json",
  healthUrl: "https://cedricv.com/health.json",
  llmsUrl: "https://cedricv.com/llms.txt",
  sitemapUrl: "https://cedricv.com/sitemap.xml",
  feeds: [
    "https://cedricv.com/feed.xml",
    "https://cedricv.com/en/feed.xml"
  ],
  keyPages: [
    {
      title: "Accueil",
      locale: "fr",
      url: "https://cedricv.com/fr/",
      path: "/fr/",
      category: "general",
      description: "Présentation de Fluance Pro et des accompagnements pour entrepreneurs."
    },
    {
      title: "Home",
      locale: "en",
      url: "https://cedricv.com/en/",
      path: "/en/",
      category: "general",
      description: "English home page for Fluance Pro services."
    },
    {
      title: "RDV Clarté",
      locale: "fr",
      url: "https://cedricv.com/rdv/clarte/",
      path: "/rdv/clarte/",
      category: "conversion",
      description: "Prendre un rendez-vous de clarté pour faire le point sur l'activité."
    },
    {
      title: "Clarity Meeting",
      locale: "en",
      url: "https://cedricv.com/en/rdv/clarte/",
      path: "/en/rdv/clarte/",
      category: "conversion",
      description: "Book a clarity meeting."
    },
    {
      title: "Contact",
      locale: "fr",
      url: "https://cedricv.com/contact/",
      path: "/contact/",
      category: "conversion",
      description: "Coordonnees de contact, WhatsApp et email."
    },
    {
      title: "Contact",
      locale: "en",
      url: "https://cedricv.com/en/contact/",
      path: "/en/contact/",
      category: "conversion",
      description: "Contact details in English."
    },
    {
      title: "Site web rapide",
      locale: "fr",
      url: "https://cedricv.com/fr/site-web-rapide/",
      path: "/fr/site-web-rapide/",
      category: "service",
      description: "Offre de site web rapide, statique, securise et sans maintenance."
    },
    {
      title: "Digital Clarity",
      locale: "en",
      url: "https://cedricv.com/en/site-web-rapide/",
      path: "/en/site-web-rapide/",
      category: "service",
      description: "High-performance website offer with no maintenance."
    },
    {
      title: "Approche Fluance Pro",
      locale: "fr",
      url: "https://cedricv.com/a-propos/approche-fluance/",
      path: "/a-propos/approche-fluance/",
      category: "about",
      description: "Vision, methode et principes d'accompagnement."
    },
    {
      title: "Fluance Pro Approach",
      locale: "en",
      url: "https://cedricv.com/en/a-propos/approche-fluance/",
      path: "/en/a-propos/approche-fluance/",
      category: "about",
      description: "Fluance Pro methodology and positioning."
    },
    {
      title: "Fluance particuliers",
      locale: "fr",
      url: "https://cedricv.com/fluance-particuliers/",
      path: "/fluance-particuliers/",
      category: "service",
      description: "Offre Fluance pour particuliers."
    },
    {
      title: "Fluance Individuals",
      locale: "en",
      url: "https://cedricv.com/en/fluance-particuliers/",
      path: "/en/fluance-particuliers/",
      category: "service",
      description: "Fluance offer for individuals."
    }
  ],
  webmcpTools: [
    {
      name: "get_site_profile",
      description: "Return site-level metadata, discovery endpoints, and the main user journeys."
    },
    {
      name: "get_current_page",
      description: "Return structured metadata about the current page."
    },
    {
      name: "find_site_pages",
      description: "Search key site pages by keyword, language, or category."
    },
    {
      name: "open_site_page",
      description: "Navigate the current browser tab to a validated Fluance Pro page."
    }
  ]
};
