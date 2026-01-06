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
  eleventyConfig.addFilter("date", function(value, format, locale) {
    const date = value === "now" || !value ? new Date() : new Date(value);
    if (format === "yyyy") {
      return date.getFullYear().toString();
    }
    if (format === "MMMM d, yyyy") {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    if (format === "d MMMM yyyy" && locale === 'fr') {
      const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    if (format === "d MMMM yyyy" && (locale === 'en' || !locale)) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    // Format RFC 822 pour RSS
    if (format === "rss") {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = days[date.getUTCDay()];
      const dayNum = date.getUTCDate().toString().padStart(2, '0');
      const month = months[date.getUTCMonth()];
      const year = date.getUTCFullYear();
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      const seconds = date.getUTCSeconds().toString().padStart(2, '0');
      return `${day}, ${dayNum} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
    }
    return date.toISOString();
  });

  // 2b-bis. Filtre pour tronquer le texte
  eleventyConfig.addFilter("truncate", function(str, length) {
    if (!str || str.length <= length) return str;
    return str.substring(0, length).trim() + '...';
  });

  // 2b-ter. Filtre pour limiter un tableau (utilisé pour les flux RSS)
  eleventyConfig.addFilter("limit", function(array, limit) {
    if (!array || !Array.isArray(array)) return array;
    return array.slice(0, limit);
  });

  // 2b-quater. Filtre pour diviser une chaîne en tableau
  eleventyConfig.addFilter("split", function(str, separator) {
    if (!str || typeof str !== 'string') return [];
    return str.split(separator);
  });

  // 2b-bis. Filtre pour calculer le nombre d'années depuis une date donnée
  // Utilisé pour afficher automatiquement le nombre d'années d'entrepreneuriat
  eleventyConfig.addFilter("yearsSince", function(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const monthDiff = now.getMonth() - start.getMonth();
    const dayDiff = now.getDate() - start.getDate();

    // Si on n'a pas encore atteint la date anniversaire cette année, on retire 1 an
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years -= 1;
    }

    return years;
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

  // 2c-bis. Filtre pour normaliser les URLs canoniques
  // S'assure que les URLs se terminent par / pour les répertoires (sauf pour les fichiers)
  eleventyConfig.addFilter("canonicalUrl", function(url) {
    if (!url) return '/';
    
    // Nettoyer l'URL
    let cleanUrl = url.startsWith('/') ? url : '/' + url;
    
    // Si l'URL se termine par index.html, la remplacer par /
    cleanUrl = cleanUrl.replace(/\/index\.html$/, '/');
    
    // Si l'URL n'a pas d'extension de fichier et ne se termine pas par /, ajouter /
    // Sauf pour la racine qui doit rester /
    if (cleanUrl !== '/' && !cleanUrl.match(/\.[a-z0-9]+$/i) && !cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl + '/';
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
      "jobTitle": locale === 'fr' 
        ? "Consultant en marketing stratégique & fluidité opérationnelle" 
        : "Strategic Marketing & Operational Fluidity Consultant",
      "worksFor": {
        "@type": "Organization",
        "name": "Fluance Pro"
      },
      "url": baseUrl,
      "image": `${baseUrl}/assets/img/fondateur.png`,
      "description": locale === 'fr'
        ? "J'aide les entrepreneurs à aligner leur marketing stratégique avec une fluidité opérationnelle pour une croissance sereine et durable."
        : "I help entrepreneurs align their strategic marketing with operational fluidity for serene and sustainable growth.",
      "knowsAbout": locale === 'fr' 
        ? [
            "Marketing stratégique",
            "Optimisation des processus métier",
            "Efficacité opérationnelle",
            "Stratégie digitale",
            "Mentalité entrepreneuriale"
          ]
        : [
            "Strategic Marketing",
            "Business Process Optimization",
            "Operational Efficiency",
            "Digital Strategy",
            "Entrepreneurial Mindset"
          ]
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
      
      // Service schema avec AggregateRating pour la page d'accueil
      let testimonials = [];
      try {
        const testimonialsPath = path.join(__dirname, 'src', '_data', 'testimonials.json');
        if (fs.existsSync(testimonialsPath)) {
          const testimonialsFile = fs.readFileSync(testimonialsPath, 'utf8');
          const testimonialsJson = JSON.parse(testimonialsFile);
          testimonials = testimonialsJson.testimonials || [];
        }
      } catch (e) {
        // Si erreur de lecture, on continue sans témoignages
      }
      
      // Calculer l'AggregateRating basé sur les témoignages réels
      const ratingCount = testimonials.length;
      const ratingValue = ratingCount > 0 ? "5" : "5"; // Tous les témoignages sont à 5/5
      
      const homepageService = {
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
          "serviceUrl": baseUrl + (locale === 'en' ? '/en/' : '/'),
          "serviceType": "Online"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": ratingValue,
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": ratingCount.toString()
        }
      };
      schemas.push(homepageService);
      
      // Reviews individuels pour chaque témoignage affiché sur la page d'accueil
      testimonials.forEach(testimonial => {
        // Nettoyer le texte des balises HTML pour le reviewBody
        // Supprimer toutes les balises HTML tout en préservant le texte
        let cleanText = (testimonial.text[locale] || testimonial.text['fr'] || '')
          .replace(/<mark><strong>/g, '')
          .replace(/<\/strong><\/mark>/g, '')
          .replace(/<strong>/g, '')
          .replace(/<\/strong>/g, '')
          .replace(/<mark>/g, '')
          .replace(/<\/mark>/g, '')
          .replace(/<[^>]+>/g, '') // Supprimer toutes les autres balises HTML
          .replace(/\\n\\n/g, ' ')
          .replace(/\\n/g, ' ')
          .replace(/\n\n/g, ' ')
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ') // Normaliser les espaces multiples
          .trim();
        
        const review = {
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "Service",
            "name": locale === 'fr' ? "Accompagnement Fluance Pro" : "Fluance Pro Coaching",
            "url": baseUrl + (locale === 'en' ? '/en/' : '/')
          },
          "author": {
            "@type": "Person",
            "name": testimonial.author.name
          },
          "reviewBody": cleanText,
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": testimonial.rating.toString(),
            "bestRating": "5",
            "worstRating": "1"
          },
          "datePublished": testimonial.date
        };
        
        // Ajouter l'URL Google Review si disponible
        if (testimonial.googleReviewUrl) {
          review.url = testimonial.googleReviewUrl;
        }
        
        schemas.push(review);
      });
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
            "name": locale === 'fr' ? "Accompagnement Fluance Pro" : "Fluance Pro Coaching",
            "url": baseUrl + page.url
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
      
      // Schema VideoObject pour les vidéos de témoignages
      const testimonialVideos = [
        {
          videoId: "cc515dd1-9f38-4d3a-a158-12158c9dee8c",
          name: locale === 'fr' ? "Témoignage d'Alain Cordey - Partie 1" : "Alain Cordey's Testimonial - Part 1",
          description: locale === 'fr' 
            ? "Témoignage vidéo d'Alain Cordey, coach sportif, sur son expérience avec l'accompagnement Fluance Pro de Cédric Vonlanthen."
            : "Video testimonial from Alain Cordey, sports coach, about his experience with Cédric Vonlanthen's Fluance Pro coaching.",
          thumbnailUrl: `${baseUrl}/assets/img/temoignage-alain-cordey.webp`
        },
        {
          videoId: "1a4a3cf1-9380-47fc-97a8-ba685f00e33b",
          name: locale === 'fr' ? "Témoignage d'Alain Cordey - Partie 2" : "Alain Cordey's Testimonial - Part 2",
          description: locale === 'fr' 
            ? "Témoignage vidéo d'Alain Cordey, coach sportif, sur son expérience avec l'accompagnement Fluance Pro de Cédric Vonlanthen."
            : "Video testimonial from Alain Cordey, sports coach, about his experience with Cédric Vonlanthen's Fluance Pro coaching.",
          thumbnailUrl: `${baseUrl}/assets/img/temoignage-alain-cordey.webp`
        },
        {
          videoId: "3fb25f9c-b59f-4d1c-aa50-71194f08f686",
          name: locale === 'fr' ? "Témoignage de Nathalie Varlet" : "Nathalie Varlet's Testimonial",
          description: locale === 'fr' 
            ? "Témoignage vidéo de Nathalie Varlet sur son expérience avec l'accompagnement Fluance Pro de Cédric Vonlanthen."
            : "Video testimonial from Nathalie Varlet about her experience with Cédric Vonlanthen's Fluance Pro coaching.",
          thumbnailUrl: `${baseUrl}/assets/img/temoignage-nathalie-varlet.webp`
        },
        {
          videoId: "93e33e57-5e78-440b-9fec-796829c73016",
          name: locale === 'fr' ? "Témoignage de Laure Figoni" : "Laure Figoni's Testimonial",
          description: locale === 'fr' 
            ? "Témoignage vidéo de Laure Figoni, directrice d'agence active dans les démarches de Qualité de Vie et des Conditions de Travail (QCVT), sur son expérience avec l'accompagnement Fluance Pro."
            : "Video testimonial from Laure Figoni, agency director active in Quality of Life and Working Conditions (QCVT) initiatives, about her experience with Fluance Pro coaching.",
          thumbnailUrl: `${baseUrl}/assets/img/fond-cedric.jpg`
        },
        {
          videoId: "6be5ab5c-8170-444e-a13d-c4d479e03376",
          name: locale === 'fr' ? "Témoignage de Céline Joyce Douay" : "Céline Joyce Douay's Testimonial",
          description: locale === 'fr' 
            ? "Témoignage vidéo de Céline Joyce Douay, entrepreneure nomade, médium et artiste, sur son expérience avec l'accompagnement Fluance Pro."
            : "Video testimonial from Céline Joyce Douay, nomadic entrepreneur, medium and artist, about her experience with Fluance Pro coaching.",
          thumbnailUrl: `${baseUrl}/assets/img/fond-cedric.jpg`
        },
        {
          videoId: "ba098d4d-7f15-40c1-b6af-a27b439cf04f",
          name: locale === 'fr' ? "Témoignage de Marine Corgier" : "Marine Corgier's Testimonial",
          description: locale === 'fr' 
            ? "Témoignage vidéo de Marine Corgier sur son expérience avec l'accompagnement Fluance Pro de Cédric Vonlanthen, incluant des résultats concrets obtenus rapidement."
            : "Video testimonial from Marine Corgier about her experience with Cédric Vonlanthen's Fluance Pro coaching, including concrete results obtained quickly.",
          thumbnailUrl: `${baseUrl}/assets/img/marine-profil.webp`
        }
      ];
      
      testimonialVideos.forEach(video => {
        const videoSchema = {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": video.name,
          "description": video.description,
          "thumbnailUrl": video.thumbnailUrl,
          "uploadDate": "2023-01-01T00:00:00+01:00",
          "contentUrl": `https://iframe.mediadelivery.net/embed/25452/${video.videoId}`,
          "embedUrl": `https://iframe.mediadelivery.net/embed/25452/${video.videoId}`,
          "publisher": {
            "@type": "Organization",
            "name": "Fluance Pro",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/assets/img/fondateur.png`
            }
          }
        };
        schemas.push(videoSchema);
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
          "name": "Cédric Vonlanthen"
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
          "@type": "Service",
          "name": locale === 'fr' ? "RDV Clarté" : "Clarity Meeting",
          "url": baseUrl + page.url
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

  // 3b. Créer .nojekyll et copier CNAME dans _site pour GitHub Pages
  eleventyConfig.on('eleventy.after', async function() {
    const fs = require('fs');
    const path = require('path');
    
    // Créer .nojekyll
    const nojekyllPath = path.join(__dirname, '_site', '.nojekyll');
    try {
      fs.writeFileSync(nojekyllPath, '', 'utf8');
      console.log('✓ .nojekyll créé dans _site');
    } catch (error) {
      console.error('✗ Erreur lors de la création de .nojekyll:', error);
    }
    
    // Copier CNAME pour le domaine personnalisé
    const cnameSource = path.join(__dirname, 'CNAME');
    const cnameDest = path.join(__dirname, '_site', 'CNAME');
    try {
      if (fs.existsSync(cnameSource)) {
        fs.copyFileSync(cnameSource, cnameDest);
        console.log('✓ CNAME copié dans _site');
      } else {
        console.warn('⚠️  CNAME source non trouvé à la racine');
      }
    } catch (error) {
      console.error('✗ Erreur lors de la copie de CNAME:', error);
    }
  });

  // 3c. Collection des articles de blog (fichiers .md dans src/fr et src/en avec date)
  eleventyConfig.addCollection("blogPosts", function(collectionApi) {
    const excluded = ['index.md', 'contact.md', 'cadeau.md', 'connexion.md', 'confirmation.md', 'fluance-particuliers.md', 'blog.njk'];
    
    // Récupérer les articles FR
    const frPosts = collectionApi.getFilteredByGlob("src/fr/*.md")
      .filter(item => {
        const filename = item.inputPath.split('/').pop();
        return !excluded.includes(filename) && item.data.date;
      });
    
    // Récupérer les articles EN
    const enPosts = collectionApi.getFilteredByGlob("src/en/*.md")
      .filter(item => {
        const filename = item.inputPath.split('/').pop();
        return !excluded.includes(filename) && item.data.date;
      });
    
    // Combiner et trier par date
    const allPosts = [...frPosts, ...enPosts].sort((a, b) => {
      const dateA = new Date(a.data.date);
      const dateB = new Date(b.data.date);
      return dateB - dateA;
    });
    
    return allPosts;
  });

  // 3c-bis. Collections séparées par langue pour faciliter l'affichage
  eleventyConfig.addCollection("blogPostsFr", function(collectionApi) {
    const excluded = ['index.md', 'contact.md', 'cadeau.md', 'connexion.md', 'confirmation.md', 'fluance-particuliers.md', 'blog.njk'];
    return collectionApi.getFilteredByGlob("src/fr/*.md")
      .filter(item => {
        const filename = item.inputPath.split('/').pop();
        return !excluded.includes(filename) && item.data.date && item.data.locale === 'fr';
      })
      .sort((a, b) => {
        const dateA = new Date(a.data.date);
        const dateB = new Date(b.data.date);
        return dateB - dateA; // Plus récent en premier
      });
  });

  eleventyConfig.addCollection("blogPostsEn", function(collectionApi) {
    const excluded = ['index.md', 'contact.md', 'cadeau.md', 'connexion.md', 'confirmation.md', 'fluance-particuliers.md', 'blog.njk'];
    return collectionApi.getFilteredByGlob("src/en/*.md")
      .filter(item => {
        const filename = item.inputPath.split('/').pop();
        return !excluded.includes(filename) && item.data.date && item.data.locale === 'en';
      })
      .sort((a, b) => {
        const dateA = new Date(a.data.date);
        const dateB = new Date(b.data.date);
        return dateB - dateA; // Plus récent en premier
      });
  });

  // 3d. Shortcode pour la navigation entre articles de blog
  eleventyConfig.addShortcode("blogNavigation", function(page, collections) {
    // Utiliser les paramètres passés, ou le contexte si non fournis
    const currentPage = page || this.page || this;
    const blogPosts = (collections && collections.blogPosts) || (this.collections && this.collections.blogPosts) || [];
    if (!blogPosts || blogPosts.length === 0) return '';
    
    // Filtrer les articles par langue pour la navigation
    // Détecter la locale depuis les données ou l'URL
    let currentLocale = 'fr';
    if (currentPage && currentPage.data && currentPage.data.locale) {
      currentLocale = currentPage.data.locale;
    } else if (currentPage && currentPage.url && currentPage.url.startsWith('/en/')) {
      currentLocale = 'en';
    } else if (currentPage && currentPage.url && currentPage.url.startsWith('/en')) {
      currentLocale = 'en';
    }
    let postsInSameLanguage = blogPosts.filter(post => (post.data.locale || 'fr') === currentLocale);
    
    // Trier les articles par date (du plus récent au plus ancien) pour cette langue
    // En cas d'égalité de date, trier par permalink pour un ordre déterministe
    postsInSameLanguage = postsInSameLanguage.sort((a, b) => {
      const dateA = new Date(a.data.date || 0);
      const dateB = new Date(b.data.date || 0);
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB - dateA; // Plus récent en premier
      }
      // Si même date, trier par permalink (ordre alphabétique)
      const permalinkA = (a.data.permalink || a.url || '').toLowerCase();
      const permalinkB = (b.data.permalink || b.url || '').toLowerCase();
      return permalinkA.localeCompare(permalinkB);
    });
    
    // Normaliser les URLs pour la comparaison (enlever les trailing slashes)
    const normalizeUrl = (url) => {
      if (!url) return '';
      return url.replace(/\/$/, '') || '/';
    };
    
    const currentUrl = normalizeUrl(currentPage.url);
    
    // Trouver l'index de l'article actuel dans sa langue
    const currentIndex = postsInSameLanguage.findIndex(post => {
      const postUrl = normalizeUrl(post.url);
      return postUrl === currentUrl;
    });
    
    if (currentIndex === -1) {
      // Debug: log pour comprendre pourquoi l'index n'est pas trouvé
      console.log('[blogNavigation] Article non trouvé:', {
        currentUrl: currentUrl,
        currentLocale: currentLocale,
        totalPosts: postsInSameLanguage.length,
        sampleUrls: postsInSameLanguage.slice(0, 3).map(p => normalizeUrl(p.url))
      });
      return '';
    }
    
    const prevPost = currentIndex < postsInSameLanguage.length - 1 ? postsInSameLanguage[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? postsInSameLanguage[currentIndex - 1] : null;
    
    // Vérifier si une traduction existe
    const hasTranslation = (currentPage && currentPage.data && currentPage.data.translation) ? true : false;
    const translationUrl = (currentPage && currentPage.data && currentPage.data.translation) ? currentPage.data.translation : null;
    const translationLabel = currentLocale === 'fr' ? 'Read in English' : 'Lire en français';
    
    if (!prevPost && !nextPost && !hasTranslation) return '';
    
    let html = '<nav class="max-w-4xl mx-auto px-6 md:px-12 pb-8 border-t border-[#0A6BCE]/20 pt-8 mt-8">';
    
    // Lien de traduction si disponible
    if (hasTranslation && translationUrl) {
      html += '<div class="mb-6 text-center">';
      html += `<a href="${translationUrl}" class="text-[#0A6BCE] hover:underline font-medium inline-flex items-center gap-2">`;
      html += `<span>🌐 ${translationLabel}</span>`;
      html += '</a>';
      html += '</div>';
    }
    
    html += '<div class="flex flex-col md:flex-row justify-between gap-4">';
    
    // Fonction pour échapper les caractères HTML
    const escapeHtml = (text) => {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    
    // Article précédent
    if (prevPost) {
      html += '<div class="flex-1">';
      html += `<p class="text-sm text-[#1f1f1f]/60 mb-2">${currentLocale === 'fr' ? 'Article précédent' : 'Previous article'}</p>`;
      html += `<a href="${prevPost.url}" class="text-[#0A6BCE] hover:underline font-semibold block">`;
      html += `<span class="text-lg">← ${escapeHtml(prevPost.data.title)}</span>`;
      html += '</a>';
      html += '</div>';
    } else {
      html += '<div class="flex-1"></div>';
    }
    
    // Article suivant
    if (nextPost) {
      html += '<div class="flex-1 text-right md:text-left md:ml-auto">';
      html += `<p class="text-sm text-[#1f1f1f]/60 mb-2">${currentLocale === 'fr' ? 'Article suivant' : 'Next article'}</p>`;
      html += `<a href="${nextPost.url}" class="text-[#0A6BCE] hover:underline font-semibold block">`;
      html += `<span class="text-lg">${escapeHtml(nextPost.data.title)} →</span>`;
      html += '</a>';
      html += '</div>';
    }
    
    html += '</div>';
    html += '</nav>';
    
    return html;
  });

  // 4. Copie des assets statiques (images, audio, js, PDFs, etc.) — le CSS est généré dans _site par Tailwind
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/audio": "assets/audio" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/*.pdf": "assets" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  // Copie de la favicon à la racine
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  // Note: CNAME et .nojekyll sont créés/copiés automatiquement via le hook eleventy.after (voir ci-dessus)
  // Copie de llms.txt à la racine
  eleventyConfig.addPassthroughCopy("llms.txt");
  
  // Ajouter le support des fichiers XML pour les flux RSS
  eleventyConfig.setTemplateFormats(["html", "md", "njk", "xml"]);
  
  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    xmlTemplateEngine: "njk",
    pathPrefix: PATH_PREFIX !== undefined ? PATH_PREFIX : ""
  };
};