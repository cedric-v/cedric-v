#!/usr/bin/env python3
"""
Script pour ajouter la navigation entre articles dans tous les articles de blog
"""
import re
from pathlib import Path

def add_navigation(file_path):
    """Ajoute la navigation si elle n'est pas déjà présente"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Vérifier si la navigation est déjà présente
    if 'blogNavigation' in content:
        return False
    
    # Vérifier si c'est un article de blog (a une date)
    if 'date:' not in content:
        return False
    
    # Ajouter la navigation avant la fermeture de </section>
    if '</section>' in content and 'blogNavigation' not in content:
        # Remplacer le dernier </section> par la navigation + </section>
        # Chercher le dernier </section> qui n'est pas dans un commentaire
        lines = content.split('\n')
        last_section_idx = None
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].strip() == '</section>':
                last_section_idx = i
                break
        
        if last_section_idx is not None:
            # Insérer la navigation avant </section>
            nav_lines = ['', '  {% blogNavigation page, collections %}']
            new_lines = lines[:last_section_idx] + nav_lines + lines[last_section_idx:]
            new_content = '\n'.join(new_lines)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
    
    return False

def main():
    blog_dir = Path("/Users/cedric 1/Documents/coding/cedric-v/src/fr")
    excluded = {'index.md', 'contact.md', 'cadeau.md', 'connexion.md', 'confirmation.md', 'fluance-particuliers.md'}
    
    updated = 0
    for md_file in sorted(blog_dir.glob('*.md')):
        if md_file.name in excluded:
            continue
        if add_navigation(md_file):
            updated += 1
            print(f"✓ Navigation ajoutée: {md_file.name}")
    
    print(f"\n{updated} fichier(s) mis à jour")

if __name__ == '__main__':
    main()
