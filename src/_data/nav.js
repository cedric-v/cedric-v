// Navigation du site, partagée par header.njk (desktop + mobile) et footer.njk.
// Les URL sont les chemins français (sans préfixe) ; elles sont passées au filtre
// `locale_url` de l'I18nPlugin d'Eleventy, qui ajoute /en/ sur les pages anglaises.
// `url` : chaîne (chemin français) ou objet { fr, en } quand les deux URL
// diffèrent vraiment (ancre, page FR servie sous /fr/).
// `label` : clé du dictionnaire src/_data/i18n/{fr,en}.json (filtre `t`).

const groups = {
  about: {
    id: "a-propos",
    label: "header.about",
    links: [
      { label: "nav.philosophy", url: "/a-propos/philosophie/" },
      { label: "nav.story", url: "/a-propos/histoire-cedric/" },
      { label: "nav.approach", url: "/a-propos/approche-fluance/" },
    ],
  },
  independents: {
    id: "accompagnement",
    label: "header.independents",
    large: true,
    links: [
      { label: "nav.coaching", url: "/accompagnement/individuel/" },
      { label: "nav.testimonials", url: { fr: "/accompagnement/individuel/#temoignages", en: "/accompagnement/individuel/#testimonials" } },
      { label: "nav.formulas", url: "/accompagnement/formules/" },
    ],
  },
};

module.exports = {
  header: {
    groups: [groups.about, groups.independents],
    links: [
      { label: "nav.sme", url: "/digital-manager/" },
      { label: "nav.cta", url: "/contact/", cta: true },
    ],
  },
  footer: [
    { type: "link", label: "nav.home", url: "/" },
    {
      type: "group",
      label: "header.about",
      links: [
        { label: "nav.philosophy", url: "/a-propos/philosophie/" },
        { label: "nav.story", url: "/a-propos/histoire-cedric/" },
        { label: "nav.approach", url: "/a-propos/approche-fluance/" },
      ],
    },
    {
      type: "group",
      label: "header.independents",
      links: [
        { label: "nav.coaching", url: "/accompagnement/individuel/" },
        { label: "nav.testimonials", url: { fr: "/accompagnement/individuel/#temoignages", en: "/accompagnement/individuel/#testimonials" } },
        { label: "nav.formulas", url: "/accompagnement/formules/" },
        { label: "nav.clarte", url: "/rdv/clarte/" },
      ],
    },
    {
      type: "group",
      label: "nav.sme",
      links: [{ label: "nav.diagnostic", url: "/digital-manager/" }],
    },
    { type: "link", label: "nav.site", url: "/fr/site-web-rapide/" },
    { type: "link", label: "nav.blog", url: "/blog/" },
    { type: "link", label: "nav.newsletter", url: "/newsletter/" },
    { type: "link", label: "nav.cta", url: "/contact/" },
    { type: "separator", label: "nav.fluance", url: "/fluance-particuliers/" },
    { type: "language" },
  ],
};
