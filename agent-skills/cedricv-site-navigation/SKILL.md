---
name: cedricv-site-navigation
description: Navigate Fluance Pro pages and route users to the right service or contact path.
---

# Cédricv Site Navigation

Use this skill when a user wants help finding the right Fluance Pro page, understanding the main offers, or choosing the best next step on `cedricv.com`.

## Main journeys

- Learn the coaching approach: `/a-propos/approche-fluance/` or `/en/a-propos/approche-fluance/`
- Discover the website offer: `/fr/site-web-rapide/` or `/en/site-web-rapide/`
- Contact Cédric: `/contact/` or `/en/contact/`
- Book a clarity meeting: `/rdv/clarte/` or `/en/rdv/clarte/`

## Operating rules

- Prefer French pages unless the user explicitly asks for English.
- For conversion intent, prefer `RDV Clarté` before generic contact.
- For website-performance questions, start with `site-web-rapide`.
- For background or positioning questions, start with the Fluance approach page.

## Machine-readable support

The site publishes:

- `/.well-known/api-catalog`
- `/.well-known/service-desc.json`
- `/.well-known/mcp/server-card.json`
- `/.well-known/agent-skills/index.json`
- `/.well-known/webmcp-context.json`

When WebMCP is available in the browser, use the site tools for page search and navigation instead of guessing URLs.
