/** Configuration de l'audit SEO statique (voir scripts/seo-audit.mjs). */
export default {
  dist: '_site',
  site: 'https://cedricv.com',
  sitemaps: ['sitemap.xml'],
  robots: 'robots.txt',
  redirects: 'src/_redirects',
  routeBaseline: 'scripts/seo-routes.json',
  // Fichiers README générés sous assets/ : artefacts techniques, pas des pages.
  excludeRoutes: [],
  excludePrefixes: ['/assets/'],
  requireOpenGraph: true,
  requireXDefault: true,
  skipInternalLinks: false,
  /**
   * Gravité des contrôles réglables (voir tools/seo-guard) : `fail`, `warn` ou
   * `off`. Les défauts bloquants sont les doublons de titre/description et les
   * H1 multiples — ce sont des signaux d'auto-génération, pas des détails.
   */
  severity: {},
  /**
   * Vérifie que la copie vendue de seo-guard n'a pas été éditée localement.
   * `fail` = garde-fou ; `off` pour un dépôt qui assume un fork.
   */
  vendorGuard: 'fail',
  report: 'seo-report.json',
};
