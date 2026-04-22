const discovery = require("../../_data/agentDiscovery");

class McpServerCardTemplate {
  data() {
    return {
      permalink: "/.well-known/mcp/server-card.json"
    };
  }

  render() {
    return JSON.stringify(
      {
        version: "1.0.0",
        protocolVersion: "2025-03-12",
        serverInfo: {
          name: "cedricv-webmcp",
          version: discovery.siteVersion
        },
        transport: {
          type: "webmcp",
          url: discovery.baseUrl,
          sameOrigin: true
        },
        capabilities: {
          tools: discovery.webmcpTools,
          resources: [
            {
              name: "webmcp-context",
              url: discovery.webmcpContextUrl,
              description: "Static site context shared by WebMCP tools."
            }
          ],
          prompts: []
        }
      },
      null,
      2
    );
  }
}

module.exports = McpServerCardTemplate;
