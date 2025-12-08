// eleventy.config.js
const i18n = require("eleventy-plugin-i18n");
const htmlmin = require("html-minifier-next"); // Le paquet sécurisé
const fs = require("fs");
const path = require("path");

// PathPrefix conditionnel : vide en dev, /cedric-v en prod (GitHub Pages)
// Si le dépôt s'appelle "cedric-v.github.io", mettre PATH_PREFIX = ""
// Si le dépôt s'appelle "cedric-v", mettre PATH_PREFIX = "/cedric-v"
const PATH_PREFIX = process.env.ELEVENTY_ENV === 'prod' ? "" : "";

module.exports = function(eleventyConfig) {
  
  // 1. Gestion des Images (local, servies depuis GitHub Pages ou tout autre hébergeur statique)
  // Support WebP avec fallback automatique pour jpg/jpeg/png
  eleventyConfig.addShortcode("image", function(src, alt, cls = "", loading = "lazy", fetchpriority = "", width = "", height = "") {
    const cleanSrc = src.startsWith('/') ? src : `/${src}`;
    const fullSrc = PATH_PREFIX + cleanSrc;
    const loadingAttr = loading ? `loading="${loading}"` : '';
    const fetchpriorityAttr = fetchpriority ? `fetchpriority="${fetchpriority}"` : '';
    const widthAttr = width ? `width="${width}"` : '';
    const heightAttr = height ? `height="${height}"` : '';
    
    // Vérifier si c'est une image jpg/jpeg/png (pour laquelle on peut avoir une version WebP)
    const isConvertibleImage = /\.(jpg|jpeg|png)$/i.test(cleanSrc);
    
    if (isConvertibleImage) {
      // Générer le chemin WebP correspondant
      const webpSrc = cleanSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const webpFullSrc = PATH_PREFIX + webpSrc;
      
      // Vérifier si le fichier WebP existe dans src/assets/img
      // Utiliser path.resolve pour obtenir le chemin absolu depuis le répertoire du projet
      const projectRoot = path.resolve(__dirname);
      const srcPath = path.join(projectRoot, 'src', cleanSrc.replace(/^\//, ''));
      const webpPath = srcPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const webpExists = fs.existsSync(webpPath);
      
      // Utiliser <picture> avec fallback seulement si le fichier WebP existe
      if (webpExists) {
        const sourceWidthAttr = width ? `width="${width}"` : '';
        const sourceHeightAttr = height ? `height="${height}"` : '';
        
        return `<picture>
          <source srcset="${webpFullSrc}" type="image/webp" ${sourceWidthAttr} ${sourceHeightAttr}>
          <img src="${fullSrc}" alt="${alt}" class="${cls}" ${loadingAttr} ${fetchpriorityAttr} ${widthAttr} ${heightAttr}>
        </picture>`;
      }
    }
    
    // Pour les autres formats ou si WebP n'existe pas, utiliser <img> simple
    return `<img src="${fullSrc}" alt="${alt}" class="${cls}" ${loadingAttr} ${fetchpriorityAttr} ${widthAttr} ${heightAttr}>`;
  });

  // 2. Configuration i18n
  eleventyConfig.addPlugin(i18n, {
    translations: {
      "welcome": { "en": "Welcome", "fr": "Bienvenue" } // Exemple
    },
    defaultLanguage: "fr"
  });

  // 2b. Filtre de date simple pour Nunjucks (utilisé dans le footer)
  eleventyConfig.addFilter("date", function(value, format) {
    const date = value === "now" || !value ? new Date() : new Date(value);
    if (format === "yyyy") {
      return date.getFullYear().toString();
    }
    return date.toISOString();
  });

  // 2c. Filtre pour ajouter le pathPrefix de manière relative (sans domaine)
  eleventyConfig.addFilter("relativeUrl", function(url) {
    // Nettoyer l'URL pour commencer par /
    const cleanUrl = url.startsWith('/') ? url : '/' + url;
    // Ajouter le pathPrefix seulement s'il existe et n'est pas vide
    if (PATH_PREFIX && PATH_PREFIX !== '') {
      // S'assurer qu'il n'y a pas de double slash
      const prefix = PATH_PREFIX.endsWith('/') ? PATH_PREFIX.slice(0, -1) : PATH_PREFIX;
      return prefix + cleanUrl;
    }
    return cleanUrl;
  });

  // 2d. Filtre pour construire l'URL complète de l'image OG
  eleventyConfig.addFilter("buildOgImageUrl", function(imagePath) {
    if (!imagePath) imagePath = 'assets/img/fond-cedric.jpg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return 'https://cedricv.com' + imagePath;
    }
    
    return 'https://cedricv.com/' + imagePath;
  });

  // 2e. Shortcode pour générer les schémas Schema.org en JSON-LD
  eleventyConfig.addShortcode("schemaOrg", function(page, locale) {
    const baseUrl = 'https://cedricv.com';
    const schemas = [];
    
    // Schema Organization (toujours présent)
    const organization = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Fluance Pro",
      "url": baseUrl,
      "logo": `${baseUrl}/assets/img/fondateur.png`,
      "description": locale === 'fr' 
        ? "Accompagnement individuel pour entrepreneurs et indépendants. Retrouvez fluidité, clarté stratégique et sérénité dans votre activité professionnelle."
        : "Individual coaching for entrepreneurs and independents. Find clarity, strategic fluidity and serenity in your professional activity.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CH",
        "addressLocality": "Belfaux",
        "postalCode": "1782",
        "streetAddress": "Case postale"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "support@fluance.io",
        "availableLanguage": ["French", "English"]
      },
      "sameAs": [
        "https://fluance.io"
      ]
    };
    schemas.push(organization);
    
    // Schema Person (Cédric Vonlanthen)
    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Cédric Vonlanthen",
      "jobTitle": locale === 'fr' ? "Coach professionnel" : "Professional Coach",
      "worksFor": {
        "@type": "Organization",
        "name": "Fluance Pro"
      },
      "url": baseUrl,
      "image": `${baseUrl}/assets/img/fondateur.png`,
      "description": locale === 'fr'
        ? "Fondateur de Fluance et Fluance Pro, j'accompagne les entrepreneurs et indépendants pour identifier puis activer les plus petits changements générant la plus grande transformation."
        : "Founder of Fluance and Fluance Pro, I accompany entrepreneurs and independents to identify and then activate the smallest changes generating the greatest transformation.",
      "email": "support@fluance.io"
    };
    schemas.push(person);
    
    // Schema WebSite (sur la page d'accueil)
    if (page.url === '/' || page.url === '/en/') {
      const website = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Fluance Pro",
        "url": baseUrl + (locale === 'en' ? '/en/' : '/'),
        "description": locale === 'fr'
          ? "Accompagnement individuel pour entrepreneurs et indépendants. Retrouvez fluidité, clarté stratégique et sérénité dans votre activité professionnelle."
          : "Individual coaching for entrepreneurs and independents. Find clarity, strategic fluidity and serenity in your professional activity.",
        "inLanguage": locale === 'fr' ? 'fr-FR' : 'en-US',
        "publisher": {
          "@type": "Organization",
          "name": "Fluance Pro"
        }
      };
      schemas.push(website);
    }
    
    // Schema Service pour l'accompagnement individuel
    if (page.url && (page.url.includes('/accompagnement/individuel') || page.url.includes('/accompagnement/formules'))) {
      const service = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": locale === 'fr' ? "Accompagnement individuel pour entrepreneurs" : "Individual coaching for entrepreneurs",
        "name": locale === 'fr' ? "Accompagnement Fluance Pro" : "Fluance Pro Coaching",
        "description": locale === 'fr'
          ? "Accompagnement individuel pour entrepreneurs et indépendants pour retrouver la clarté stratégique et la fluidité opérationnelle dans leur activité professionnelle."
          : "Individual coaching for entrepreneurs and independents to regain strategic clarity and operational fluidity in their professional activity.",
        "provider": {
          "@type": "Person",
          "name": "Cédric Vonlanthen"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Switzerland"
        },
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": baseUrl + page.url,
          "serviceType": "Online"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "11"
        }
      };
      schemas.push(service);
      
      // Reviews individuels pour les témoignages principaux
      const reviews = [
        {
          author: "Olivia Sinet",
          jobTitle: locale === 'fr' ? "Photographe et dirigeante" : "Photographer and director",
          reviewBody: locale === 'fr' 
            ? "Suite à nos échanges, j'ai mis en place plusieurs éléments qui fonctionnent vraiment bien. Cela a recréé une dynamique et cela m'a permis de rapporter le cash dont j'avais besoin rapidement. Les 2 actions discutées m'ont ramené au moins 15 clients."
            : "Following our exchanges, I implemented several elements that work really well. This recreated a dynamic and allowed me to bring in the cash I needed quickly. The 2 actions discussed brought me at least 15 clients.",
          ratingValue: 5
        },
        {
          author: "Magali Bourgogne",
          jobTitle: locale === 'fr' ? "Thérapeute" : "Therapist",
          reviewBody: locale === 'fr'
            ? "Avec son écoute et son analyse professionnelle, Cédric a vu très rapidement les points à améliorer sur mon site internet et de quelle façon je pouvais diriger mon offre. J'ai vraiment apprécié recevoir des conseils personnalisés en lien avec qui je suis. Je sais maintenant très clairement comment procéder pour trouver mes clients et leur proposer une offre adaptée autant à leurs besoins qu'aux miens."
            : "With his listening and professional analysis, Cédric quickly saw the points to improve on my website and how I could direct my offer. I really appreciated receiving personalized advice related to who I am. I now know very clearly how to proceed to find my clients and offer them something adapted to both their needs and mine.",
          ratingValue: 5
        },
        {
          author: "Cédric Dupuy",
          jobTitle: locale === 'fr' ? "Dirigeant" : "Director",
          reviewBody: locale === 'fr'
            ? "Ma posture a changée. Je ne regarde plus mon entreprise de la même façon."
            : "My posture has changed. I no longer look at my business the same way.",
          ratingValue: 5
        },
        {
          author: "Eva Baghaï",
          jobTitle: "",
          reviewBody: locale === 'fr'
            ? "Très bons conseils, restant objectif, et qui permet de prendre du recul sur sa propre activité, ce qui n'est pas facile à faire seul..."
            : "Very good advice, staying objective, and which allows you to step back from your own activity, which isn't easy to do alone...",
          ratingValue: 5
        },
        {
          author: "Isabelle Alexandrine Bourgeois",
          jobTitle: "",
          reviewBody: locale === 'fr'
            ? "J'ai apprécié la personnalité chaleureuse, calme et patiente de Cédric Vonlanthen. En quelques conseils, il a redéfini les 3 formules d'abonnement pour mon média en ligne Planète Vagabonde, ce qui a apporté plus de clarté et d'accessibilité à ma plateforme. Une reconfiguration personnalisée de l'automatisation de mes emails marketing a également permis de générer plus de trafic sur mon site."
            : "I appreciated the warm, calm and patient personality of Cédric Vonlanthen. In a few pieces of advice, he redefined the 3 subscription formulas for my online media Planète Vagabonde, which brought more clarity and accessibility to my platform. A personalized reconfiguration of the automation of my marketing emails also allowed to generate more traffic on my site.",
          ratingValue: 5
        },
        {
          author: "Elodie Beaucent",
          jobTitle: locale === 'fr' ? "Fondatrice" : "Founder",
          reviewBody: locale === 'fr'
            ? "Regardez la croissance de mon activité depuis les sessions avec Cédric."
            : "Look at the growth of my activity since the sessions with Cédric.",
          ratingValue: 5
        },
        {
          author: "Anne-Aël Gombert",
          jobTitle: locale === 'fr' ? "Formatrice" : "Trainer",
          reviewBody: locale === 'fr'
            ? "Cela va vite. Ce n'est pas fouillis comme ailleurs."
            : "It goes fast. It's not messy like elsewhere.",
          ratingValue: 5
        },
        {
          author: "Dr. Thomas D. Zweifel",
          jobTitle: locale === 'fr' ? "CEO" : "CEO",
          reviewBody: locale === 'fr'
            ? "Tu maîtrises le sujet. Nous avions des tonnes de possibilités de croissance. Nous en avons maintenant identifiés 3. Cela nous apporte de la clarté et du focus."
            : "You master the subject. We had tons of growth possibilities. We have now identified 3. This brings us clarity and focus.",
          ratingValue: 5
        },
        {
          author: "Philippe Baeriswyl",
          jobTitle: locale === 'fr' ? "CEO" : "CEO",
          reviewBody: locale === 'fr'
            ? "Tu maîtrises le sujet. Nous avions des tonnes de possibilités de croissance. Nous en avons maintenant identifiés 3. Cela nous apporte de la clarté et du focus."
            : "You master the subject. We had tons of growth possibilities. We have now identified 3. This brings us clarity and focus.",
          ratingValue: 5
        },
        {
          author: "Sophie Nozet",
          jobTitle: "",
          reviewBody: locale === 'fr'
            ? "Tu n'imagines pas à quel point il y a un avant et un après pour moi. Tu fais partie des personnes de référence."
            : "You can't imagine how much there is a before and after for me. You are one of the reference people.",
          ratingValue: 5
        },
        {
          author: "Marine Corgier",
          jobTitle: "",
          reviewBody: locale === 'fr'
            ? "Cela rend les choses encore plus rapides et efficaces, cela met du mouvement ! J'avais besoin que ça secoue, et c'est le cas ! Beaucoup de réalisations en seulement 10 jours. Il y a eu 4 ventes en 3 jours grâce à l'accompagnement et plein de passages à l'action. Less is more résonne dans mon esprit et je sens que cela va enclencher un tas de choses."
            : "This makes things even faster and more efficient, it creates movement ! I needed it to shake things up, and it does ! Many achievements in just 10 days. There were 4 sales in 3 days thanks to the coaching and lots of action steps. Less is more resonates in my mind and I feel it will trigger a lot of things.",
          ratingValue: 5
        }
      ];
      
      reviews.forEach(review => {
        const reviewSchema = {
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "Service",
            "name": locale === 'fr' ? "Accompagnement Fluance Pro" : "Fluance Pro Coaching"
          },
          "author": {
            "@type": "Person",
            "name": review.author
          },
          "reviewBody": review.reviewBody,
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.ratingValue,
            "bestRating": "5",
            "worstRating": "1"
          }
        };
        schemas.push(reviewSchema);
      });
    }
    
    // Schema Event pour le RDV Clarté
    if (page.url && page.url.includes('/rdv/clarte')) {
      // Date du prochain RDV : Jeudi 8 janvier 2026 à 14h00 (heure de France/Suisse/Belgique)
      const eventDate = new Date('2026-01-08T14:00:00+01:00');
      const event = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": locale === 'fr' ? "RDV Clarté" : "Clarity Meeting",
        "description": locale === 'fr'
          ? "Rendez-vous mensuel en ligne pour retrouver la clarté dans votre activité professionnelle et votre équilibre pro/perso."
          : "Monthly online meeting to regain clarity in your professional activity and work-life balance.",
        "startDate": eventDate.toISOString(),
        "endDate": new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString(), // +1 heure
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "VirtualLocation",
          "url": "https://go.cedricv.com/workshop/clarte/bdc"
        },
        "organizer": {
          "@type": "Person",
          "name": "Cédric Vonlanthen",
          "email": "support@fluance.io"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://go.cedricv.com/workshop/clarte/bdc",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        },
        "maximumAttendeeCapacity": 5
      };
      schemas.push(event);
      
      // Review pour le témoignage de Nathalie Varlet sur le RDV Clarté
      const review = {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
          "@type": "Event",
          "name": locale === 'fr' ? "RDV Clarté" : "Clarity Meeting"
        },
        "author": {
          "@type": "Person",
          "name": "Nathalie Varlet"
        },
        "reviewBody": locale === 'fr'
          ? "C'est exactement ce dont j'ai besoin. Chaque mois, cela me permet de prendre du recul sur mes activités et d'avoir un chemin clair et cohérent avec qui je suis pour avancer. En plus, c'est abordable !"
          : "This is exactly what I need. Every month, it allows me to take a step back from my activities and have a clear and coherent path aligned with who I am to move forward. Plus, it's affordable !",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      };
      schemas.push(review);
    }
    
    // Générer le JSON-LD pour chaque schéma
    return schemas.map(schema => 
      `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
    ).join('\n');
  });

  // 3. Minification HTML sécurisée
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (process.env.ELEVENTY_ENV === 'prod' && outputPath && outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      });
    }
    return content;
  });

  // 4. Copie des assets statiques (images, audio, etc.) — le CSS est généré dans _site par Tailwind
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/audio": "assets/audio" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  // Copie de la favicon à la racine
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  // Copie de .nojekyll pour désactiver Jekyll sur GitHub Pages
  eleventyConfig.addPassthroughCopy(".nojekyll");
  
  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: PATH_PREFIX || "/"
  };
};