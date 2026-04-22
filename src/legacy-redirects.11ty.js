const redirects = require("./_data/legacyRedirects");

class LegacyRedirectsTemplate {
  data() {
    return {
      pagination: {
        data: "legacyRedirects",
        size: 1,
        alias: "redirect"
      },
      permalink: (data) => data.redirect.from,
      eleventyExcludeFromCollections: true,
      noindex: true
    };
  }

  render(data) {
    const target = data.redirect.to;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting…</title>
  <meta name="robots" content="noindex,follow">
  <link rel="canonical" href="https://cedricv.com${target}">
  <meta http-equiv="refresh" content="0; url=${target}">
  <script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p>Redirecting to <a href="${target}">${target}</a>.</p>
</body>
</html>`;
  }
}

module.exports = LegacyRedirectsTemplate;
