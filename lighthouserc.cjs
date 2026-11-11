/** Budgets Lighthouse — alertes non bloquantes. */
module.exports = {
  ci: {
    collect: {
      url: [
        'https://cedricv.com/fr/',
        'https://cedricv.com/blog/',
        'https://cedricv.com/en/',
      ],
      numberOfRuns: 1,
      settings: {
        formFactor: 'mobile',
        screenEmulation: { mobile: true },
        throttlingMethod: 'simulate',
      },
      chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.95 }],
        'categories:seo': ['warn', { minScore: 0.95 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 102400 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 30720 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './.lighthouseci' },
  },
};
