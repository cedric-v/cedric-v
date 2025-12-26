#!/usr/bin/env python3
"""
Script pour mettre à jour les articles de blog :
1. Remplacer "Cercle Rayonnez" par "RDV Clarté"
2. Remplacer les liens vers cercle-rayonnez par /rdv/clarte/
3. Ajouter un bouton CTA en bas de chaque article
"""
import os
import re
from pathlib import Path

def update_blog_post(file_path):
    """Met à jour un article de blog"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = False
    
    # 1. Remplacer "Cercle Rayonnez" par "RDV Clarté"
    if 'Cercle Rayonnez' in content:
        content = content.replace('Cercle Rayonnez', 'RDV Clarté')
        changes_made = True
    
    # 2. Remplacer les liens vers cercle-rayonnez
    content = re.sub(
        r'https?://go\.cedricv\.com/cercle-rayonnez',
        '/rdv/clarte/',
        content,
        flags=re.IGNORECASE
    )
    content = re.sub(
        r'href=["\']https?://go\.cedricv\.com/cercle-rayonnez["\']',
        'href="{{ \'/rdv/clarte/\' | relativeUrl }}"',
        content,
        flags=re.IGNORECASE
    )
    
    # 3. Ajouter le bouton CTA en bas si pas déjà présent
    cta_section = '''  <!-- CTA pour l'accompagnement -->
  <div class="max-w-4xl mx-auto px-6 md:px-12 pb-16">
    <div class="section-card p-8 bg-white text-center space-y-6">
      <h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">
        Prêt·e à retrouver la fluidité dans votre activité ?
      </h2>
      <p class="text-lg text-[#1f1f1f]/80">
        Découvrez comment je peux vous accompagner pour clarifier votre vision et développer votre activité avec simplicité.
      </p>
      <a href="{{ '/accompagnement/individuel/' | relativeUrl }}" class="btn-primary text-[#0f172a] bg-[#ffce2d] hover:bg-[#ffd84d] text-center inline-block">
        Découvrir l'accompagnement
      </a>
    </div>
  </div>'''
    
    # Vérifier si le CTA est déjà présent
    if 'CTA pour l\'accompagnement' not in content and '</section>' in content:
        # Ajouter le CTA avant la fermeture de la dernière section
        # Chercher la dernière </section> avant </article> ou à la fin
        if '</article>' in content:
            content = content.replace('</article>\n</section>', f'</article>\n{cta_section}\n</section>')
        elif content.rstrip().endswith('</section>'):
            # Remplacer la dernière </section> par le CTA + </section>
            lines = content.rstrip().split('\n')
            # Trouver la dernière ligne </section>
            last_section_idx = None
            for i in range(len(lines) - 1, -1, -1):
                if lines[i].strip() == '</section>':
                    last_section_idx = i
                    break
            
            if last_section_idx is not None:
                # Insérer le CTA avant la dernière </section>
                new_lines = lines[:last_section_idx] + [cta_section] + lines[last_section_idx:]
                content = '\n'.join(new_lines)
        changes_made = True
    
    if changes_made and content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    blog_dir = Path("/Users/cedric 1/Documents/coding/cedric-v/src/fr")
    
    # Liste des fichiers à exclure (pages principales, pas des articles de blog)
    excluded_files = {
        'index.md', 'contact.md', 'cadeau.md', 'connexion.md', 
        'confirmation.md', 'fluance-particuliers.md',
        'la-difference-entre-un-formateur-et-un-accompagnateur.md'  # Déjà modifié
    }
    
    updated_count = 0
    
    # Parcourir tous les fichiers .md dans src/fr (niveau racine uniquement)
    for md_file in blog_dir.glob('*.md'):
        if md_file.name in excluded_files:
            continue
        
        if update_blog_post(md_file):
            updated_count += 1
            print(f"✓ Mis à jour: {md_file.name}")
    
    # Mettre à jour aussi le fichier spécifique
    specific_file = blog_dir / 'quand-je-ferai-100-000-de-chiffre-daffaires-puis-1-million-etc.md'
    if specific_file.exists():
        if update_blog_post(specific_file):
            updated_count += 1
            print(f"✓ Mis à jour: {specific_file.name}")
    
    print(f"\n{'='*60}")
    print(f"Résumé: {updated_count} fichier(s) mis à jour")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
