const discovery = require("../_data/agentDiscovery");

class ServiceDescriptionTemplate {
  data() {
    return {
      permalink: "/.well-known/service-desc.json"
    };
  }

  render() {
    return JSON.stringify(
      {
        openapi: "3.1.0",
        info: {
          title: "Fluance Pro Public Discovery API",
          version: discovery.siteVersion,
          description:
            "Public read-only endpoints that help agents discover Fluance Pro content, WebMCP capabilities, and machine-readable metadata."
        },
        servers: [
          {
            url: discovery.baseUrl
          }
        ],
        paths: {
          "/.well-known/api-catalog": {
            get: {
              summary: "API catalog",
              description: "RFC 9727 API catalog for public discovery.",
              responses: {
                "200": {
                  description: "Linkset describing public discovery endpoints."
                }
              }
            }
          },
          "/.well-known/service-desc.json": {
            get: {
              summary: "OpenAPI description",
              responses: {
                "200": {
                  description: "This OpenAPI document."
                }
              }
            }
          },
          "/.well-known/mcp/server-card.json": {
            get: {
              summary: "MCP server card",
              responses: {
                "200": {
                  description: "Machine-readable MCP server metadata for the site's browser tools."
                }
              }
            }
          },
          "/.well-known/agent-skills/index.json": {
            get: {
              summary: "Agent skills index",
              responses: {
                "200": {
                  description: "Discovery index for site-specific agent skills."
                }
              }
            }
          },
          "/.well-known/webmcp-context.json": {
            get: {
              summary: "WebMCP context",
              responses: {
                "200": {
                  description: "Static context used by the browser-side WebMCP tools."
                }
              }
            }
          },
          "/health.json": {
            get: {
              summary: "Health check",
              responses: {
                "200": {
                  description: "Build-time health payload for availability checks."
                }
              }
            }
          },
          "/llms.txt": {
            get: {
              summary: "LLMs.txt",
              responses: {
                "200": {
                  description: "Plain-text summary for language models."
                }
              }
            }
          },
          "/sitemap.xml": {
            get: {
              summary: "XML sitemap",
              responses: {
                "200": {
                  description: "Sitemap of public URLs."
                }
              }
            }
          },
          "/feed.xml": {
            get: {
              summary: "French RSS feed",
              responses: {
                "200": {
                  description: "French blog feed."
                }
              }
            }
          },
          "/en/feed.xml": {
            get: {
              summary: "English RSS feed",
              responses: {
                "200": {
                  description: "English blog feed."
                }
              }
            }
          }
        }
      },
      null,
      2
    );
  }
}

module.exports = ServiceDescriptionTemplate;
