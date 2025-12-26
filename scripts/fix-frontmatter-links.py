#!/usr/bin/env python3
"""
Script pour enlever les liens du frontmatter YAML
"""
import re
from pathlib import Path

def fix_frontmatter(file_path):
    """Enlève les liens du frontmatter"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Séparer le frontmatter du contenu
    frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not frontmatter_match:
        return False
    
    frontmatter = frontmatter_match.group(1)
    body = content[frontmatter_match.end():]
    
    # Enlever les liens HTML du frontmatter
    frontmatter_clean = re.sub(r'<a[^>]*>([^<]*)</a>', r'\1', frontmatter)
    
    if frontmatter_clean != frontmatter:
        new_content = f'---\n{frontmatter_clean}\n---\n{body}'
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    
    return False

def main():
    blog_dir = Path("/Users/cedric 1/Documents/coding/cedric-v/src/fr")
    excluded = {'index.md', 'contact.md', 'cadeau.md', 'connexion.md', 'confirmation.md', 'fluance-particuliers.md'}
    
    fixed = 0
    for md_file in sorted(blog_dir.glob('*.md')):
        if md_file.name in excluded:
            continue
        if fix_frontmatter(md_file):
            fixed += 1
            print(f"✓ Frontmatter corrigé: {md_file.name}")
    
    print(f"\n{fixed} fichier(s) corrigé(s)")

if __name__ == '__main__':
    main()
