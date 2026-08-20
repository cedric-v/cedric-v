# Recherche : rendre le site plus chaleureux (sans refonte)

**Date :** août 2025
**Statut :** itération 3 — Playfair et bordure dorée du header retirés à la demande ; corrections de contraste conservées

Historique :
- **Itération 1** (annulée) : blanc vanille sur cartes → jugé trop subtile
- **Itération 2** (partiellement retirée) : Playfair sur titres + ligne dorée header/footer + contrastes corrigés
- **Itération 3** (actuelle) : retour à Inter sur les titres, bordure dorée du **header** retirée
  (celle du footer conservée), corrections de contraste **conservées**

---

## 1. Objectif

Rendre le site plus chaleureux sans le modifier totalement (pas de refonte, pas de changement d'identité).
Piste de départ : remplacer le blanc par une couleur plus chaude à certains endroits.

## 2. Audit de la palette actuelle

| Rôle | Couleur | Utilisation |
|---|---|---|
| Bleu identité | `#0A6BCE` | Header, footer, liens, titres, boutons secondaires |
| Jaune / or | `#FFD700` / `#ffce2d` / `#ffd84d` | Accents header/footer, bouton principal, étoiles, `mark` |
| Blanc pur | `#ffffff` | Cartes (`section-card`, `testimonial-card`, `bg-white`) |
| Fond de page | `#fdfaf6` | Crème très clair (déjà chaud) |
| Bleu hero | `#648ED8` | Fond de la section hero (photo + dégradé) |
| Textes | `#1f1f1f`, `#0f172a` | Corps de texte, titres |

**Constat :** le fond de page est déjà crème ; ce sont les cartes en blanc pur (`#fff`)
qui créent des « flashs » froids et cassent l'ambiance chaleureuse.

## 3. Modifications testées (puis annulées)

### 3.1 Variables CSS ajoutées (`src/assets/css/styles.css`, bloc `:root`)
```css
--warm-white: #fffaf2;                 /* blanc cassé ton vanille */
--warm-shadow-color: 146 98 38;        /* ambre discret pour les ombres */
```

### 3.2 Surfaces blanches → vanille
- `.section-card` : `background-color: white` → `var(--warm-white)`
- `.testimonial-card` : idem
- `.bg-white` (classe utilitaire, utilisée partout) : idem

### 3.3 Ombres réchauffées
- Ombres des cartes : `rgb(0 0 0 / 0.1)` → `rgb(var(--warm-shadow-color) / 0.08)` (ambre très léger)

### 3.4 Harmonisation page `site-web-rapide.njk` (FR + EN)
- `background: white` (cartes portfolio inline) → `var(--warm-white)`
- bordures `#e2e8f0` (gris froid) → `#ece2d2` (ton sable)

### 3.5 Volontairement laissés en blanc pur
- `text-white`, `border-white` (sur fonds bleus — doivent rester blancs)
- `bg-white/10` (overlay translucide sur fond bleu)
- Lightbox photos (`#ffffff` dans `individuel.md` — standard pour afficher des images)

## 4. Résultat & retour utilisateur

**Verdict : « ce n'est pas encore cela. »**

Le changement était trop subtil / insuffisant :
- `#fffaf2` est quasi identique à `#fff` à l'œil nu → pas de différence perçue.
- Réchauffer uniquement les surfaces (cartes) sans toucher au reste (bleu vif, hero bleu)
  ne change pas la sensation globale de froideur.
- Le bleu `#0A6BCE` très vif domine visuellement (header, footer, CTA) et reste « froid »
  quel que soit le fond des cartes.

## 4bis. Itération 2 appliquée : B + C + contrastes

### C. Ligne dorée
- ~~`.site-header` / `#main-header` : `border-top: 3px solid #FFD700`~~ → **retirée** (itération 3, demande utilisateur)
- `.site-footer` : `border-top: 3px solid #FFD700` → **conservée**
- Cohérent avec le cookie-banner qui avait déjà un liseré doré de 4px

### B. (retiré à l'itération 3)
- ~~Playfair Display sur `h1–h6`~~ → **retour à Inter** (demande utilisateur)
- ~~Chargement de Playfair dans `base.njk`~~ → **retiré du `<link>` Google Fonts** (itération 4,
  demande utilisateur) : le site ne charge plus que `Inter:wght@400;500;600;700`

### Autres correctifs (itération 4)
- `p-6` et 25 autres utilitaires d'espacement utilisés dans les templates mais **jamais définis**
  dans le CSS ont été ajoutés (le bloc « Basé à Fribourg… » n'avait aucun padding → texte collé au bord).
  Classes ajoutées : `p-6`, `py-1`, `pt-2`, `pt-3`, `pt-4`, `pt-6`, `px-8`, `pl-5`, `pl-6`, `pr-4`,
  `mt-1`, `mt-2`, `mt-3`, `mt-6`, `mb-0`, `mb-1`, `mb-3`, `ml-4`, `mr-3`, `my-4`, `my-6`, `my-12`,
  `pl-0`, `pt-8`, `pb-4`, `pb-16`, `py-2`.

### Corrections de contraste (demande utilisateur : « vérifie le contraste des box »)

**Audit complet réalisé** (calculs WCAG 2.1, ratio de luminance) :

| Élément | Avant | Après | Statut |
|---|---|---|---|
| Hero : blanc sur bleu `#648ED8` | 2.6–2.9 ❌ | blanc sur `#356DAE` → **5.32** (desktop), **4.81** (mobile) ✅ | Corrigé |
| Footer : liens dorés `#FFD700CC` sur bleu | 2.82 ❌ | blanc cassé `rgba(255,255,255,.92)` → **4.69** ✅ | Corrigé |
| Bloc « Pour qui » : `bg-white/10` sur bleu | 4.39 ❌ | `bg-black/10` → **6.18** ✅ | Corrigé |
| Label « Bon à savoir » bleu sur `#dceeff` | 4.42 ≈ | `text-[#095FAE]` → **5.31** ✅ | Corrigé |
| Textes foncés sur cartes claires (box) | 7–17 ✅ | inchangé ✅ | OK |
| Titres footer dorés `#FFD700` sur bleu | 3.74 | inchangé (assumé : décoratif, gras 18px) | Assumé |
| Slogan header doré (opacité 80%) | 2.86 | inchangé (assumé : décoratif 12px italic) | Assumé |

**Fichiers modifiés (itération 2) :**
- `src/assets/css/styles.css` — Playfair, ligne dorée, footer-muted blanc, nouvelles classes de dégradé/bg/text
- `src/fr/index.md`, `src/en/index.md` — hero : fond `#356DAE`, dégradé `via-[#4a7cb8]/75 to-[#356DAE]`, texte `text-white`
- `src/fr/fluance-particuliers.md`, `src/en/...` — idem (même hero)
- `src/fr/accompagnement/individuel.md`, `src/en/...` — idem
- `src/fr/cours-en-ligne/approche-fluance-complete.md`, `src/en/...` — idem
- `src/fr/site-web-rapide.njk`, `src/en/...` — bloc `bg-black/10`, label `#095FAE`

**Note** : classes inertes repérées (écrites mais jamais définies dans le CSS, donc sans effet) :
`bg-black/30`, `md:bg-transparent`, `drop-shadow-[…]`, `md:via-[…]`, `md:to-[…]` dans
`approche-fluance-complete.md` — à nettoyer ou à définir un jour.

## 5. Pistes restantes (non testées, par ordre d'impact estimé)

### A. Réchauffer le bleu identité (impact fort)
- `#0A6BCE` → un bleu plus doux/teinté : `#2E6FA3`, `#3A6D8C`, `#2563A8`…
- À faire dans les variables `:root` de `styles.css` (header/footer/cookie-banner)
  **et** dans `components/footer.css` (variables dupliquées) — attention, la valeur
  est aussi en dur dans les templates (`bg-[#0A6BCE]`, `text-[#0A6BCE]`, bordures…)
  → **risque :** toucher à l'identité, changement visible sur tout le site.

### B. Activer Playfair Display sur les titres (impact moyen, très « chaleureux »)
- La police est déjà chargée dans `base.njk` (`fonts.googleapis.com`) mais **jamais utilisée**.
- Appliquer sur `h1`, `h2`, `h3` : serif élégant + chaleur immédiate, coût quasi nul.

### C. Ligne dorée sur le header / footer (impact faible à moyen)
- Rappeler le jaune `#FFD700` (déjà présent dans le slogan/accents) :
  `border-top: 3px solid #FFD700` sur `.site-header` et `.site-footer`.

### D. Dégradé du hero plus chaud (`fr/index.md`)
- Le hero est bleu `#648ED8` avec dégradé : injecter une pointe de doré dans le dégradé
  (`via-#648ED8/70` → mélange ambré) pour une lumière « golden hour ».

### E. Fond de page légèrement plus chaud
- `#fdfaf6` → `#faf3e8` ou `#f8f0e3` (beige/lin plus marqué) pour un socle plus chaud.

### F. Boutons & CTA
- Le bouton primaire est déjà doré (`#ffce2d`), le secondaire est bleu/blanc :
  passer les hover à des tons dorés plus doux, ou décaler le jaune vers l'ambre
  (`#f5b942` / `#e8a33d`).

## 6. Comment réappliquer / annuler

- **Réappliquer une piste :** voir les fichiers ci-dessus, les variables sont au même endroit.
- **Annuler :** `git checkout -- <fichier>` ou revenir à HEAD (tout était versionné).
- Les 3 fichiers modifiés étaient : `src/assets/css/styles.css`,
  `src/fr/site-web-rapide.njk`, `src/en/site-web-rapide.njk`.
- `_site/` est généré (`npm run build`) — pas versionné.

## 7. Recommandation

Commencer par **B (Playfair)** et **C (ligne dorée)** : impact visible immédiat,
zéro risque pour l'identité, modifications minuscules. Puis tester **E** et **D**.
Ne toucher à **A (le bleu)** qu'en dernier recours et avec validation visuelle du client.
