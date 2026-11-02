#!/usr/bin/env node
/**
 * scripts/verify-hreflang.js
 *
 * Vérifie la cohérence des balises hreflang générées dans _site :
 * 1. Chaque cible hreflang correspond à une page réellement générée (pas de 404).
 * 2. Chaque page qui déclare des hreflang se référence elle-même avec sa langue.
 * 3. Chaque page qui déclare des hreflang déclare aussi x-default.
 * 4. Réciprocité : si /a/ pointe vers /en/a/, alors /en/a/ doit pointer vers /a/.
 *
 * Les pages sans équivalent dans l'autre langue (pages de remerciement,
 * focus SOS…) n'ont pas de hreflang : elles sont simplement ignorées.
 *
 * Usage : node scripts/verify-hreflang.js (appelé à la fin de `npm run build`)
 */

const fs = require('fs');
const path = require('path');

const HREFLANG_RE = /<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/g;
const SITE_URL = 'https://cedricv.com';

function outputPathForUrl(siteDir, url) {
  const clean = url.replace(SITE_URL, '').split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return path.join(siteDir, 'index.html');
  const relative = clean.replace(/^\//, '');
  if (path.extname(relative)) return path.join(siteDir, relative);
  return path.join(siteDir, relative.replace(/\/$/, ''), 'index.html');
}

function urlForOutputPath(siteDir, filePath) {
  const relative = path.relative(siteDir, filePath).split(path.sep).join('/');
  const withoutIndex = relative.replace(/(^|\/)index\.html$/, '$1');
  return '/' + (withoutIndex === '' ? '' : withoutIndex);
}

function walkHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'functions') continue; // Code des Pages Functions
      walkHtmlFiles(full, out);
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function runHreflangVerification(rootDir = process.cwd()) {
  const siteDir = path.join(rootDir, '_site');
  if (!fs.existsSync(siteDir)) {
    console.error('❌ _site introuvable : lancez `npm run build` avant cette vérification.');
    return false;
  }

  console.log('🔍 Vérification des balises hreflang...');

  const files = walkHtmlFiles(siteDir);
  const linksByUrl = new Map();
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    linksByUrl.set(urlForOutputPath(siteDir, file), new Map(
      [...html.matchAll(HREFLANG_RE)].map((m) => [m[1], m[2]]),
    ));
  }

  const errors = [];
  let pagesWithHreflang = 0;
  let checkedLinks = 0;

  for (const [url, links] of linksByUrl) {
    if (links.size === 0) continue;
    pagesWithHreflang++;

    const alternates = new Map([...links].filter(([lang]) => lang !== 'x-default'));

    for (const [lang, href] of links) {
      checkedLinks++;
      const targetPath = outputPathForUrl(siteDir, href);
      if (!fs.existsSync(targetPath)) {
        errors.push(`${url} → hreflang="${lang}" pointe vers ${href} qui n'existe pas`);
        continue;
      }
      // Réciprocité : la page cible doit pointer en retour vers la page courante.
      const targetUrl = urlForOutputPath(siteDir, targetPath);
      const backLinks = linksByUrl.get(targetUrl);
      if (backLinks && ![...backLinks.values()].includes(SITE_URL + url)) {
        errors.push(`${url} → hreflang="${lang}" ${href}, mais ${targetUrl} ne pointe pas en retour`);
      }
    }

    // Auto-référence : un hreflang pour sa propre langue doit exister.
    const selfHref = [...links.values()].find((href) => {
      const p = outputPathForUrl(siteDir, href);
      return fs.existsSync(p) && urlForOutputPath(siteDir, p) === url;
    });
    if (!selfHref) {
      errors.push(`${url} n'a pas de hreflang auto-référent (sa propre langue)`);
    }
    if (!links.has('x-default')) {
      errors.push(`${url} n'a pas de hreflang="x-default"`);
    }
    if (alternates.size < 2) {
      errors.push(`${url} ne déclare qu'une seule langue (${[...alternates.keys()].join(', ')})`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ ÉCHEC DU TEST HREFLANG : ${errors.length} erreur(s) :`);
    errors.slice(0, 40).forEach((e) => console.error(`   - ${e}`));
    if (errors.length > 40) console.error(`   … et ${errors.length - 40} autres.`);
    return false;
  }

  const skipped = files.length - pagesWithHreflang;
  console.log(`✓ hreflang valide : ${pagesWithHreflang} pages localisées, ${checkedLinks} liens vérifiés (réciprocité + cibles existantes), ${skipped} pages monolingues ignorées.\n`);
  return true;
}

if (require.main === module) {
  process.exit(runHreflangVerification() ? 0 : 1);
}

module.exports = { runHreflangVerification };
