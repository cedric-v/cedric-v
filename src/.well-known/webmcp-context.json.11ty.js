const discovery = require("../_data/agentDiscovery");

class WebMcpContextTemplate {
  data() {
    return {
      permalink: "/.well-known/webmcp-context.json"
    };
  }

  render() {
    return JSON.stringify(
      {
        site: {
          name: discovery.siteName,
          url: discovery.baseUrl,
          docsUrl: discovery.docsUrl,
          llmsUrl: discovery.llmsUrl
        },
        keyPages: discovery.keyPages,
        tools: discovery.webmcpTools
      },
      null,
      2
    );
  }
}

module.exports = WebMcpContextTemplate;
