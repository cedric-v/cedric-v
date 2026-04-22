const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const skillsRoot = path.join(__dirname, "..", "..", "agent-skills");

const definitions = [
  {
    name: "cedricv-site-navigation",
    type: "skill-md",
    description: "Navigate Fluance Pro pages, understand key offers, and choose the right entry point for entrepreneurs.",
    source: "cedricv-site-navigation/SKILL.md",
    url: "/.well-known/agent-skills/cedricv-site-navigation/SKILL.md"
  }
];

module.exports = definitions.map((skill) => {
  const absolutePath = path.join(skillsRoot, skill.source);
  const digest = crypto
    .createHash("sha256")
    .update(fs.readFileSync(absolutePath))
    .digest("hex");

  return {
    name: skill.name,
    type: skill.type,
    description: skill.description,
    url: skill.url,
    digest: `sha256:${digest}`
  };
});
