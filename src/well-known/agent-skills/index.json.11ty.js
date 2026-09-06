const skills = require("../../_data/agentSkills");

class AgentSkillsIndexTemplate {
  data() {
    return {
      permalink: "/.well-known/agent-skills/index.json"
    };
  }

  render() {
    return JSON.stringify(
      {
        $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
        skills
      },
      null,
      2
    );
  }
}

module.exports = AgentSkillsIndexTemplate;
