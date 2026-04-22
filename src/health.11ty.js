class HealthTemplate {
  data() {
    return {
      permalink: "/health.json"
    };
  }

  render() {
    return JSON.stringify(
      {
        status: "ok",
        service: "cedricv.com",
        generatedAt: new Date().toISOString()
      },
      null,
      2
    );
  }
}

module.exports = HealthTemplate;
