---
layout: base.njk
title: Machine Discovery
description: Machine-readable discovery endpoints for Fluance Pro.
locale: en
permalink: /docs/api/
eleventyExcludeFromCollections: true
---

# Machine Discovery

This static site exposes machine-readable discovery endpoints for crawlers and browser-based agents.

## Public endpoints

- `/.well-known/api-catalog`
- `/.well-known/service-desc.json`
- `/.well-known/mcp/server-card.json`
- `/.well-known/agent-skills/index.json`
- `/.well-known/webmcp-context.json`
- `/health.json`
- `/llms.txt`
- `/sitemap.xml`
- `/feed.xml`
- `/en/feed.xml`

These endpoints are now published in production on `https://cedricv.com`.

## WebMCP

The site registers browser-side WebMCP tools when `navigator.modelContext.registerTool()` is available. These tools expose:

- site profile
- current page metadata
- key page search
- safe same-origin navigation

## Hosting limits

The production site is served as a static site on Cloudflare Pages (edge CDN), built and deployed via GitHub Actions.

- HTTP `Link` response headers are supported natively at the Cloudflare edge.

- The `/.well-known/api-catalog` payload is served with the correct MIME type by Cloudflare Pages.
- OAuth discovery endpoints are intentionally not published because these public discovery endpoints do not require authentication.

If the site is later fronted by Cloudflare, Netlify, or another edge layer, response headers and markdown negotiation can be added there without changing the site structure.
