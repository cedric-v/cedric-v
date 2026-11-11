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
  report: 'seo-report.json',
};
