const discovery = require("../_data/agentDiscovery");

class ApiCatalogTemplate {
  data() {
    return {
      permalink: "/.well-known/api-catalog",
      eleventyAllowMissingExtension: true
    };
  }

  render() {
    return JSON.stringify(
      {
        linkset: [
          {
            anchor: `${discovery.baseUrl}/api/public-site`,
            "service-desc": [
              {
                href: discovery.serviceDescUrl,
                type: "application/vnd.oai.openapi+json"
              }
            ],
            "service-doc": [
              {
                href: discovery.docsUrl,
                type: "text/html"
              }
            ],
            status: [
              {
                href: discovery.healthUrl,
                type: "application/json"
              }
            ]
          }
        ]
      },
      null,
      2
    );
  }
}

module.exports = ApiCatalogTemplate;
