#!/bin/bash

# Script d'aide pour la migration Tailwind CSS v3 → v4
# Usage: ./scripts/migrate-tailwind-v4.sh [--dry-run]

set -e

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "🔍 Mode DRY-RUN activé - Aucune modification ne sera effectuée"
fi

echo "🚀 Migration Tailwind CSS v3 → v4"
echo "=================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour exécuter une commande (avec dry-run)
run_cmd() {
    if [ "$DRY_RUN" = true ]; then
        echo "${YELLOW}[DRY-RUN]${NC} $1"
    else
        eval "$1"
    fi
}

# 1. Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "${RED}❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet.${NC}"
    exit 1
fi

echo "✅ Répertoire du projet détecté"
echo ""

# 2. Vérifier l'état git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "${YELLOW}⚠️  Avertissement: Ce n'est pas un dépôt git${NC}"
else
    if [ -n "$(git status --porcelain)" ]; then
        echo "${YELLOW}⚠️  Avertissement: Des modifications non commitées sont présentes${NC}"
        echo "   Considérez de créer une branche de migration :"
        echo "   git checkout -b migration/tailwind-v4"
        read -p "   Continuer quand même ? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

echo ""

# 3. Vérifier la version actuelle de Tailwind
CURRENT_VERSION=$(npm list tailwindcss 2>/dev/null | grep tailwindcss@ | sed 's/.*@\([0-9]\+\.[0-9]\+\.[0-9]\+\).*/\1/' || echo "non installé")
echo "📦 Version actuelle de Tailwind CSS: ${CURRENT_VERSION}"

if [[ "$CURRENT_VERSION" == 4.* ]]; then
    echo "${GREEN}✅ Tailwind CSS v4 est déjà installé${NC}"
    exit 0
fi

echo ""

# 4. Afficher les fichiers qui seront modifiés
echo "📝 Fichiers qui seront modifiés :"
echo "   - package.json"
echo "   - package-lock.json"
echo "   - src/assets/css/styles.css"
echo "   - src/fr/rdv/clarte.md (flex-shrink-0 → shrink-0)"
echo "   - src/en/rdv/clarte.md (flex-shrink-0 → shrink-0)"
echo "   - src/en/confirmation.md (flex-shrink-0 → shrink-0)"
echo "   - src/fr/confirmation.md (flex-shrink-0 → shrink-0)"
echo "   - src/index.njk (bg-fluance → bg-[#0A6BCE])"
echo ""

# 5. Fichiers qui seront créés
echo "✨ Fichiers qui seront créés :"
echo "   - postcss.config.js"
echo ""

# 6. Fichiers qui seront supprimés
echo "🗑️  Fichiers qui seront supprimés :"
echo "   - tailwind.config.js"
echo ""

# 7. Confirmation
if [ "$DRY_RUN" = false ]; then
    read -p "Continuer avec la migration ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Migration annulée"
        exit 0
    fi
fi

echo ""
echo "🔄 Début de la migration..."
echo ""

# 8. Installer Tailwind CSS v4
echo "📦 Installation de Tailwind CSS v4..."
run_cmd "npm install -D tailwindcss@latest @tailwindcss/postcss@latest"

# 9. Créer postcss.config.js
echo ""
echo "📝 Création de postcss.config.js..."
if [ "$DRY_RUN" = false ]; then
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
EOF
    echo "${GREEN}✅ postcss.config.js créé${NC}"
else
    echo "${YELLOW}[DRY-RUN]${NC} postcss.config.js serait créé"
fi

# 10. Mettre à jour styles.css (nécessite une modification manuelle)
echo ""
echo "⚠️  Modification de src/assets/css/styles.css requise manuellement :"
echo "   - Remplacer @tailwind base/components/utilities par @import \"tailwindcss\""
echo "   - Ajouter @theme avec --color-fluance: #0A6BCE"
echo ""

# 11. Supprimer tailwind.config.js
if [ -f "tailwind.config.js" ]; then
    echo "🗑️  Suppression de tailwind.config.js..."
    run_cmd "rm tailwind.config.js"
    if [ "$DRY_RUN" = false ]; then
        echo "${GREEN}✅ tailwind.config.js supprimé${NC}"
    fi
else
    echo "ℹ️  tailwind.config.js n'existe pas (déjà supprimé ?)"
fi

# 12. Remplacer flex-shrink-0 par shrink-0
echo ""
echo "🔄 Remplacement de flex-shrink-0 par shrink-0..."
FILES_TO_UPDATE=(
    "src/fr/rdv/clarte.md"
    "src/en/rdv/clarte.md"
    "src/en/confirmation.md"
    "src/fr/confirmation.md"
)

for file in "${FILES_TO_UPDATE[@]}"; do
    if [ -f "$file" ]; then
        if [ "$DRY_RUN" = false ]; then
            if grep -q "flex-shrink-0" "$file"; then
                sed -i '' 's/flex-shrink-0/shrink-0/g' "$file"
                echo "${GREEN}✅ $file mis à jour${NC}"
            fi
        else
            if grep -q "flex-shrink-0" "$file"; then
                echo "${YELLOW}[DRY-RUN]${NC} $file serait mis à jour"
            fi
        fi
    fi
done

# 13. Mettre à jour package.json scripts (nécessite une modification manuelle)
echo ""
echo "⚠️  Modification de package.json requise manuellement :"
echo "   - Supprimer --config ./tailwind.config.js des scripts dev:css et build:css"
echo "   - Optionnel: Remplacer tailwindcss par @tailwindcss/cli@latest"
echo ""

# 14. Résumé
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Résumé de la migration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$DRY_RUN" = false ]; then
    echo "${GREEN}✅ Actions automatiques terminées${NC}"
    echo ""
    echo "📝 Actions manuelles restantes :"
    echo "   1. Modifier src/assets/css/styles.css :"
    echo "      - Remplacer @tailwind par @import \"tailwindcss\""
    echo "      - Ajouter @theme avec vos couleurs"
    echo ""
    echo "   2. Modifier package.json :"
    echo "      - Mettre à jour les scripts dev:css et build:css"
    echo ""
    echo "   3. Modifier src/index.njk :"
    echo "      - Remplacer bg-fluance par bg-[#0A6BCE]"
    echo ""
    echo "   4. Tester :"
    echo "      - npm start (dev)"
    echo "      - npm run build (prod)"
    echo ""
    echo "📖 Consultez MIGRATION_TAILWIND_V4.md pour les détails complets"
else
    echo "${YELLOW}🔍 Mode DRY-RUN terminé${NC}"
    echo "   Exécutez sans --dry-run pour appliquer les changements"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
