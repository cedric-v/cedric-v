#!/usr/bin/env python3
"""
Script pour corriger les liens dans le CTA - les enlever car ils ne devraient pas être là
"""
import re
from pathlib import Path

def fix_cta_links(file_path):
    """Enlève les liens du CTA"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Pattern pour le titre du CTA avec liens
    content = re.sub(
        r'<h2[^>]*>Prêt·e à <a[^>]*>retrouver la fluidité dans votre activité</a> \?</h2>',
        '<h2 class="text-2xl md:text-3xl font-semibold text-[#0A6BCE]">\n        Prêt·e à retrouver la fluidité dans votre activité ?\n      </h2>',
        content
    )
    
    # Pattern pour la description du CTA avec liens
    content = re.sub(
        r'<p class="text-lg text-\[#1f1f1f\]/80">\s*Découvrez comment je peux vous accompagner pour clarifier votre vision et <a[^>]*>développer votre activité</a> avec <a[^>]*>simplicité</a>\.\s*</p>',
        '<p class="text-lg text-[#1f1f1f]/80">\n        Découvrez comment je peux vous accompagner pour clarifier votre vision et développer votre activité avec simplicité.\n      </p>',
        content
    )
    
    # Nettoyer les liens dupliqués
    content = re.sub(r'<a[^>]*><a[^>]*>([^<]*)</a></a>', r'\1', content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    blog_dir = Path("/Users/cedric 1/Documents/coding/cedric-v/src/fr")
    excluded = {'index.md', 'contact.md', 'cadeau.md', 'connexion.md', 'confirmation.md', 'fluance-particuliers.md'}
    
    fixed = 0
    for md_file in sorted(blog_dir.glob('*.md')):
        if md_file.name in excluded:
            continue
        if fix_cta_links(md_file):
            fixed += 1
            print(f"✓ Corrigé: {md_file.name}")
    
    print(f"\n{fixed} fichier(s) corrigé(s)")

if __name__ == '__main__':
    main()
