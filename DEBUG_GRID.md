# Guide de débogage pour les colonnes grid

## Comment vérifier dans le navigateur

1. **Ouvrez les outils de développement** (F12 ou Cmd+Option+I sur Mac)

2. **Onglet Elements/Éléments** :
   - Trouvez l'élément avec `class="grid grid-cols-1 md:grid-cols-3..."`
   - Vérifiez que les classes sont bien appliquées

3. **Onglet Console** :
   - Tapez : `window.getComputedStyle(document.querySelector('.grid')).display`
   - Devrait retourner `"grid"`

4. **Onglet Network/Réseau** :
   - Rechargez la page (Cmd+R ou F5)
   - Vérifiez que `styles.css` est bien chargé (status 200)
   - Cliquez sur `styles.css` pour voir son contenu

5. **Vérification de la largeur du viewport** :
   - Dans la console, tapez : `window.innerWidth`
   - Pour que `md:grid-cols-3` s'applique, il faut que la largeur soit >= 768px
   - Si < 768px, les colonnes seront empilées verticalement (comportement normal)

6. **Vérification des styles appliqués** :
   - Sélectionnez l'élément `.grid` dans l'inspecteur
   - Dans l'onglet "Styles", cherchez `grid-template-columns`
   - Sur desktop (>=768px), vous devriez voir : `grid-template-columns: repeat(3, minmax(0, 1fr))`

## Vérifications côté code

- Le fichier source contient : `class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full"`
- Le CSS généré doit contenir les classes `md:grid-cols-3`
- Le conteneur parent doit avoir une largeur suffisante (`max-w-7xl`)

