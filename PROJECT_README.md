## Fluance Pro / cedricv.com

Website for Fluance Pro (cedricv.com) - Coaching for entrepreneurs and independents.  
Multilingual static site (FR/EN) built with [Eleventy](https://www.11ty.dev/) and Native CSS (utility classes).  
Designed to be simple to develop locally, deploy on static hosting (GitHub Pages, Netlify, etc.), and easy to maintain over time.

---

### Tech stack

- **Eleventy 3** as static site generator
- **Nunjucks** templates
- **Native CSS** for styling (utility-based)
- **Node.js / npm** for tooling

---

### Performance optimizations

The site includes several performance optimizations to ensure fast loading and smooth user experience:

#### Image optimization

- **WebP support with automatic fallback**: Images are automatically served in WebP format when available, with fallback to original formats (JPG/PNG) for compatibility
- **Explicit dimensions**: All images include `width` and `height` attributes to prevent Cumulative Layout Shift (CLS)
- **Lazy loading**: Images below the fold use `loading="lazy"` for faster initial page load
- **Eager loading for LCP**: Hero images and critical images use `loading="eager"` and `fetchpriority="high"` for optimal Largest Contentful Paint (LCP)
- **Responsive positioning**: Hero images use responsive `object-position` (centered on mobile, right-aligned on desktop)

#### Navigation optimization

- **Link prefetching**: Menu links are prefetched on hover (with 100ms delay) to accelerate page transitions
- **Smooth transitions**: CSS transitions reduce visual flicker during navigation
- **Optimized event listeners**: Uses `passive: true` for better scroll performance

#### Font loading

- **Preconnect**: Early connection to Google Fonts and external resources
- **Preload**: Critical Inter font is preloaded for faster rendering
- **Font-display**: Uses `font-display: optional` to prevent layout shifts

#### CSS and resource loading

- **CSS preload**: Critical CSS is preloaded asynchronously
- **Minification**: Production builds include minified HTML, CSS, and JavaScript
- **Will-change optimization**: Applied only during active transitions to avoid unnecessary layer creation

#### Tracking and Analytics

- **Cloudflare Web Tag Management (Zaraz)**: Site tracking and analytics are managed via Cloudflare Zaraz at the edge.
- **Custom Consent Banner**: A custom cookie consent banner integrates with the Zaraz Consent API (`zaraz.consent.set`) to manage user privacy preferences.
- **Zero GTM scripts**: No Google Tag Manager scripts are included in the codebase for better performance and privacy.

#### Core Web Vitals

The site is optimized for Google's Core Web Vitals:
- **LCP (Largest Contentful Paint)**: Optimized with eager loading and preconnect hints
- **FID/INP (First Input Delay / Interaction to Next Paint)**: Reduced with passive event listeners and optimized JavaScript
- **CLS (Cumulative Layout Shift)**: Minimized with explicit image dimensions and stable font loading

---

### Prerequisites

- **Node.js** (recommended: latest LTS)
- **npm** (comes with Node)
- A **GitHub** account (for deployment with GitHub Pages or CI)

---

### Installation

Clone the repository and install dependencies:

```bash
cd cedric-v
npm install
```

---

### Local development

Start the Eleventy dev server:

```bash
npm start
```

This will:

- Run Eleventy in dev mode with live reload at `http://localhost:8080/`
- Serves CSS from `src/assets/css/styles.css` (copied to `_site/assets/css/styles.css`)

The main pages are:

- Root (redirects to FR): `http://localhost:8080/`
- French homepage: `http://localhost:8080/fr/`
- English homepage: `http://localhost:8080/en/`

Stop the dev server with `Ctrl + C`.

---

### Project structure

- `src/` – source content and templates
  - `_includes/` – base layout, header, footer
  - `fr/` – French content (e.g. `index.md`, `a-propos/philosophie.md`)
  - `en/` – English content (e.g. `index.md`)
  - `index.njk` – root index, redirects to `/fr/`
  - `sitemap.njk` – sitemap.xml generator template
  - `assets/css/styles.css` – Native CSS with utility classes
- `_site/` – generated static site (ignored by git)
  - `sitemap.xml` – automatically generated sitemap
- `eleventy.config.js` – Eleventy configuration (i18n, filters, transforms)

---

### Available npm scripts

From `package.json`:

- **`npm start`**

  Runs both dev servers:

  ```bash
  npm-run-all --parallel dev:*
  ```

- **`npm run dev:11ty`**

  Eleventy dev server with live reload:

  ```bash
  cross-env ELEVENTY_ENV=dev eleventy --serve
  ```

- **`npm run build`**

  Production build for deployment:

  ```bash
  cross-env ELEVENTY_ENV=prod eleventy
  ```


---

### Building for production

Generate a production build (minified HTML, CSS, JS):

```bash
npm run build
```

Output:

- Static files are written to the `_site/` directory.
- This folder can be served by any static hosting provider (GitHub Pages, Netlify, S3, etc.).

---

### Deployment

You can deploy the content of `_site/` **as a static website**. The project is configured to use **GitHub Pages** via GitHub Actions.

#### GitHub Pages (via GitHub Actions)

Recommended: automatically build and deploy the site on each push to `main` using GitHub Actions.

1. In your repo, create the directory `.github/workflows/` (if it does not exist).
2. Add a file `.github/workflows/deploy.yml` with this content:

```yaml
name: Deploy site to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        env:
          ELEVENTY_ENV: prod
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. In GitHub → **Settings → Pages**:
   - Set **Source** to "GitHub Actions".

On each push to `main`, GitHub will:

- Install dependencies
- Run `npm run build`
- Deploy the `_site/` folder to GitHub Pages.

#### Manual or other hosts (Netlify, S3, etc.)

1. Build the site:

   ```bash
   npm run build
   ```

2. Deploy the contents of `_site/` to your static host (e.g. connect Netlify to the repo with build command `npm run build` and publish directory `_site`, etc.).

---

### Automated smoke tests

The project includes **automatic smoke tests** that run on every deployment to ensure critical pages load correctly and prevent 404 errors from going unnoticed.

#### What are smoke tests?

Smoke tests are basic validation checks that verify:
- **Critical files exist**: `index.html`, `404.html`, `fr/index.html`, `.nojekyll`
- **Pages are accessible**: HTTP status codes are correct (200 for existing pages, 404 for non-existent pages)
- **HTML content is valid**: Pages contain valid HTML structure

#### When do they run?

Smoke tests run **automatically** on every push to `main`, before deployment:
1. After the build completes successfully
2. Before the site is deployed to GitHub Pages
3. If any test fails, the deployment is **blocked** and the workflow stops

#### What is tested?

**File existence checks:**
- `index.html` at the root (homepage)
- `404.html` at the root (custom 404 page)
- `fr/index.html` (French homepage)
- `.nojekyll` (required for GitHub Pages)

**HTTP accessibility tests:**
- Homepage (`/`) → Must return status 200
- Custom 404 page (`/404.html`) → Must return status 200
- French homepage (`/fr/`) → Must return status 200
- English homepage (`/en/`) → Must return status 200
- Non-existent page → Must return status 404

**HTML content validation:**
- Pages must contain valid HTML (`<!DOCTYPE html>` or `<html>`)
- `404.html` must contain "404" or "Page non trouvée" text

#### Viewing test results

To view smoke test results:

1. Go to your repository on GitHub
2. Click on the **"Actions"** tab
3. Click on the latest workflow run
4. Click on the **"smoke-test"** job
5. Review the test output in the logs

**If tests pass:**
- You'll see green checkmarks (✓) for each test
- The deployment will proceed automatically

**If tests fail:**
- You'll see red X marks (❌) indicating which test failed
- The deployment will be blocked
- You must fix the issue and push again

#### Benefits

- **Early detection**: Problems are caught before deployment
- **Automatic blocking**: Broken pages won't be deployed
- **No manual checking**: You don't need to manually verify after each deployment
- **Fast feedback**: Tests complete in seconds

#### Troubleshooting

**If smoke tests fail:**

1. Check the test output to see which specific test failed
2. Common issues:
   - Missing `index.html` → Check `src/index.njk` permalink configuration
   - Missing `404.html` → Ensure `src/404.njk` exists
   - Wrong HTTP status → Verify the page exists and is accessible
   - Invalid HTML → Check for syntax errors in templates
3. Fix the issue locally, test with `npm run build`, then push again

**If you need to skip tests temporarily** (not recommended):
- You can modify the workflow, but this is discouraged as it defeats the purpose of automated testing

---

### Quality assurance and validation reports

The project includes automated quality checks using **Google Lighthouse** and **W3C HTML Validator**. These validations are **optional** and can be triggered manually when needed to avoid slowing down regular deployments.

#### Running validations

**By default**, validations are **not executed** during automatic deployments (push to `main`). This keeps deployments fast and efficient.

**To run validations manually:**

1. Go to your repository on GitHub
2. Click on the **"Actions"** tab
3. Select the **"Build and Deploy"** workflow from the left sidebar
4. Click on **"Run workflow"** button (top right)
5. Check the box **"Exécuter les validations Lighthouse et W3C"**
6. Click **"Run workflow"** to start the deployment with validations

The workflow will:
- Build and deploy the site (as usual)
- **Additionally** run Lighthouse and W3C validations
- Generate and upload validation reports as artifacts

#### Accessing the reports

After a deployment with validations enabled, reports are generated and uploaded as GitHub Actions artifacts:

1. Go to your repository on GitHub
2. Click on the **"Actions"** tab
3. Click on the workflow run that included validations
4. Click on the **"validate"** job
5. Scroll down to the **"Artifacts"** section at the bottom of the page
6. Click on **"validation-reports"** to download the ZIP file
7. Extract the ZIP file to access the reports

**Note:** 
- Artifacts are retained for 30 days. After this period, they are automatically deleted.
- If you don't see the "validate" job, it means validations were not enabled for that workflow run.

#### Report contents

The `validation-reports` artifact contains:

**Google Lighthouse reports:**
- `lighthouse-home.html` - Full Lighthouse report for the homepage (HTML format)
- `lighthouse-fr.html` - Full Lighthouse report for the French homepage (HTML format)
- `lighthouse-en.html` - Full Lighthouse report for the English homepage (HTML format, if available)
- `lighthouse-home.json` - Lighthouse data for the homepage (JSON format)
- `lighthouse-fr.json` - Lighthouse data for the French homepage (JSON format)

**W3C HTML Validation reports:**
- `w3c/` directory containing validation reports for up to 10 HTML pages
  - Each page has both HTML and JSON format reports
  - Files are named based on the page path (e.g., `index.html`, `fr_index.html`, `a-propos_philosophie_index.html`)

**Summary:**
- `summary.md` - Overview of available reports and how to use them

#### Using the reports

**Lighthouse reports:**
- Open the HTML files in your browser for a visual, interactive report
- Lighthouse evaluates:
  - **Performance** - Page load speed and optimization
  - **Accessibility** - WCAG compliance and screen reader support
  - **Best Practices** - Security, modern web standards
  - **SEO** - Search engine optimization
- Use the JSON files for programmatic analysis or integration with CI/CD tools
- Aim for scores above 90 in each category for optimal results

**W3C Validation reports:**
- Open the HTML reports to see detailed validation errors and warnings
- The JSON format is useful for automated parsing and error detection
- Fix any errors (marked in red) and review warnings (marked in yellow)
- Valid HTML ensures better browser compatibility and accessibility

#### Troubleshooting

**If you don't see the "validate" job:**
- This is normal for automatic deployments (push to `main`)
- Validations only run when explicitly enabled via "Run workflow" with the validation checkbox checked
- To run validations, use the manual workflow trigger as described above

**If you don't see the "Artifacts" section:**
- Wait a few seconds after the workflow completes (upload may take time)
- Refresh the page
- Check the "Upload validation reports" step logs to verify the upload succeeded
- Ensure the "validate" job completed (it may show warnings but should still generate reports)

**If W3C reports are missing:**
- Check the workflow logs for the "Validate HTML with W3C" step
- The reports use the local server URLs, so ensure the server started successfully
- Some validation errors won't prevent report generation

---

### Environment variables

This project uses environment variables for:

- **`ELEVENTY_ENV`**
  - `dev` for local development (`npm start`)
  - `prod` for production builds (`npm run build`)

---

### Maintenance

To keep the project healthy over time:

- **Update dependencies periodically:**

  ```bash
  npm outdated   # see what is out of date
  npm update     # safe minor/patch updates
  ```

- **Rebuild Tailwind and Eleventy after changes:**

  - For dev: `npm start`
  - For prod: `npm run build`

- **Add new content:**
  - French pages under `src/fr/` (Markdown or Nunjucks).
  - Shared layouts/partials under `src/_includes/`.

- **Internationalization (i18n):**
  - The site supports **French (FR)** and **English (EN)** languages.
  - Basic i18n is configured via `eleventy-plugin-i18n` in `eleventy.config.js`.
  - French content is located in `src/fr/`, English content in `src/en/`.
  - Language switching is handled in the header navigation.
  - Each page includes `hreflang` tags for proper SEO and language targeting.
  - You can extend the `translations` object and add new languages as needed.

- **Sitemap:**
  - A `sitemap.xml` is automatically generated during the build process.
  - The sitemap includes all pages (excluding JSON files and 404 pages).
  - Pages are prioritized: homepage (1.0), "À propos" pages (0.8), others (0.6).
  - Multilingual pages include `hreflang` tags for proper language targeting.
  - The sitemap is accessible at `https://cedricv.com/sitemap.xml` after deployment.
  - You can submit it to Google Search Console for better indexing.

- **Open Graph (OG) Tags:**
  - Open Graph meta tags are automatically generated for all pages to optimize social media sharing (Facebook, Twitter, LinkedIn, etc.).
  - All OG tags are included in the base template (`src/_includes/base.njk`).
  - **Default description**: If a page doesn't have a `description` in its frontmatter, it uses:
    - **FR**: "Fluance : le mouvement qui éveille et apaise. Libérez votre corps des tensions grâce à une approche simple basée sur le mouvement, le souffle et le jeu."
    - **EN**: "Fluance: the movement that awakens and soothes. Release tension from your body through a simple approach based on movement, breath and play."
  - **Custom OG image**: To use a specific image for social media sharing, add `ogImage` to the page frontmatter:
    ```yaml
    ---
    layout: base.njk
    title: My Page
    description: My page description
    ogImage: assets/img/my-hero-image.jpg
    ---
    ```
  - **Default OG image**: If `ogImage` is not specified, the default image `assets/img/fond-cedric.jpg` (homepage hero image) is used.
  - **OG tags included**:
    - `og:type` - Always set to "website"
    - `og:url` - Canonical URL of the page
    - `og:title` - Page title + "| Fluance"
    - `og:description` - Page description (or default)
    - `og:image` - Full URL to the OG image (1200x630 recommended)
    - `og:image:width` and `og:image:height` - Image dimensions
    - `og:locale` - Language locale (fr_FR or en_US)
    - `og:locale:alternate` - Alternate language version
    - `og:site_name` - "Fluance"
  - **Twitter Card tags** are also included for optimal Twitter sharing:
    - `twitter:card` - Set to "summary_large_image"
    - `twitter:url`, `twitter:title`, `twitter:description`, `twitter:image`
  - **Image URL generation**: The `buildOgImageUrl` filter automatically converts relative image paths to full URLs (`https://cedricv.com/...`).
  - **Testing**: Use Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) or Twitter's [Card Validator](https://cards-dev.twitter.com/validator) to preview how your pages appear when shared.

- **Schema.org JSON-LD structured data:**
  - The site includes comprehensive Schema.org structured data in JSON-LD format for enhanced SEO and rich snippets in search results.
  - **Organization schema**: Includes Fluance Pro organization details, address, contact information, and related sites.
  - **Person schema**: Contains information about Cédric Vonlanthen, including job title, expertise areas (`knowsAbout`), and professional description.
  - **Service schema**: Automatically added to coaching pages with service description, provider information, and aggregate ratings.
  - **Event schema**: Generated for the monthly "RDV Clarté" meeting pages with event details, dates, and location.
  - **Review schemas**: Multiple customer testimonials are structured as Review schemas with ratings (5/5) and review text.
  - **AggregateRating**: Service pages include aggregate rating information (5/5 based on 11+ reviews).
  - **Security**: Email addresses are intentionally excluded from JSON-LD to prevent spam scraping (contact information is available via the contact page).
  - **Implementation**: Schemas are automatically generated via the `schemaOrg` shortcode in `eleventy.config.js` and included in the base template (`src/_includes/base.njk`).
  - **Testing**: Use Google's [Rich Results Test](https://search.google.com/test/rich-results) to validate structured data.

- **llms.txt file:**
  - The site includes a `llms.txt` file at the root (`https://cedricv.com/llms.txt`) to help Large Language Models (LLMs) better understand and reference the site.
  - **Purpose**: Provides structured information about the site, services, owner, and how to properly reference Fluance Pro and Cédric Vonlanthen.
  - **Content**: Includes site description, main services, expertise areas, important pages, contact information, and guidelines for LLMs on how to reference the site.
  - **Benefits**: Improves how AI assistants and LLMs understand, cite, and recommend the site in their responses.
  - **File location**: The `llms.txt` file is in the project root and is automatically copied to `_site/llms.txt` during the build process via `eleventyConfig.addPassthroughCopy("llms.txt")`.

- **Static assets:**
  - Add images, icons, etc. under `src/assets/img/`.
  - They are copied to `_site/assets/img/` via `eleventyConfig.addPassthroughCopy`.
  - **WebP optimization**: For better performance, convert images to WebP format and place them alongside the original files (e.g., `image.jpg` and `image.webp`). The `image` shortcode automatically serves WebP when available, with fallback to the original format.
  - **Image shortcode usage**: Use `{% image "assets/img/filename.jpg", "alt text", "classes", "loading", "fetchpriority", "width", "height" %}` in templates. Always provide width and height to prevent layout shifts.

---

### Security and dependency management

#### Automated dependency updates with Dependabot

The project uses **GitHub Dependabot** to automatically monitor and update dependencies, ensuring security patches and latest versions are applied promptly.

**Configuration:**

- **Location**: `.github/dependabot.yml`
- **Monitored ecosystems**:
  - **npm** (Node.js dependencies)
  - **GitHub Actions** (workflow actions)

**Update schedule:**

- **Frequency**: Weekly (every Monday at 9:00 AM)
- **npm dependencies**: Up to 10 open pull requests at a time
- **GitHub Actions**: Up to 5 open pull requests at a time

**Features:**

- **Automatic security alerts**: Dependabot automatically detects and creates alerts for known security vulnerabilities in dependencies
- **Grouped updates**: Minor and patch updates are grouped together to reduce the number of pull requests:
  - Production dependencies grouped separately
  - Development dependencies grouped separately
- **Labeled pull requests**: All Dependabot PRs are automatically labeled with `dependencies` and either `npm` or `github-actions`
- **Conventional commits**: Commit messages follow conventional commit format with prefixes (`chore:` for npm, `ci:` for GitHub Actions)

**How it works:**

1. **Security alerts**: When a vulnerability is detected, GitHub automatically creates a security alert in the repository's "Security" tab
2. **Pull requests**: Dependabot creates pull requests for:
   - Security updates (high priority)
   - Regular dependency updates (scheduled weekly)
3. **Review and merge**: Review the pull requests and merge them when ready
   - Security updates should be prioritized and merged quickly
   - Regular updates can be reviewed and tested before merging

**Accessing security alerts:**

1. Go to your repository on GitHub
2. Click on the **"Security"** tab
3. View **"Dependabot alerts"** for known vulnerabilities
4. Review and address alerts by merging Dependabot's security update PRs

**Customization:**

The Dependabot configuration can be customized in `.github/dependabot.yml`:
- Adjust update frequency (daily, weekly, monthly)
- Change the number of open PRs
- Add or remove dependency groups
- Ignore specific dependencies if needed (uncomment the `ignore` section)

**Best practices:**

- Review and merge security updates promptly (within 7 days)
- Test regular updates in development before merging
- Keep dependencies up to date to reduce security risks
- Monitor the Security tab regularly for new alerts

---

### Security and secrets
 
 - No API keys or secrets are committed to the repository.
 - **Environment variables**: The site uses environment variables for Firebase and Stripe configuration.
   - **Local**: Loaded from a `.env` file at the root.
   - **Deployment**: Loaded from **GitHub Repository Secrets**.
 - The `.gitignore` file correctly excludes `.env` and other sensitive or generated files.
 - **API Restrictions**: API keys should be restricted by HTTP referrer in the Google Cloud Console to only allow `cedricv.com/*` and `fluance.io/*`.
