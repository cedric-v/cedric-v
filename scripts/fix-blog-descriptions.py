#!/usr/bin/env python3
"""
Script pour corriger les descriptions SEO des articles de blog
- Corriger les descriptions tronquées
- Optimiser la longueur (150-160 caractères recommandés)
"""
import re
from pathlib import Path

def extract_first_sentence(text, max_length=160):
    """Extrait la première phrase complète jusqu'à max_length caractères"""
    # Nettoyer le texte
    text = text.strip()
    
    # Si le texte est déjà court et complet, le retourner
    if len(text) <= max_length and text.endswith(('.', '!', '?')):
        return text
    
    # Chercher la première phrase complète
    # Fin de phrase : . ! ? suivi d'un espace ou fin de texte
    match = re.search(r'^(.{0,' + str(max_length) + r'}[.!?])(?:\s|$)', text)
    if match:
        return match.group(1).strip()
    
    # Si pas de phrase complète, tronquer à max_length et ajouter ...
    if len(text) > max_length:
        # Tronquer au dernier espace avant max_length
        truncated = text[:max_length]
        last_space = truncated.rfind(' ')
        if last_space > max_length * 0.7:  # Si on trouve un espace pas trop tôt
            return truncated[:last_space].strip() + '...'
        return truncated.strip() + '...'
    
    return text

def fix_description(file_path):
    """Corrige la description d'un article"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Extraire le frontmatter
    frontmatter_match = re.match(r'^(---\n)(.*?)(\n---\n)', content, re.DOTALL)
    if not frontmatter_match:
        return False
    
    frontmatter = frontmatter_match.group(2)
    body = content[frontmatter_match.end():]
    
    # Extraire la description actuelle
    desc_match = re.search(r'^description:\s*(.+)$', frontmatter, re.MULTILINE)
    if not desc_match:
        return False
    
    current_desc = desc_match.group(1).strip()
    # Enlever les guillemets
    current_desc = re.sub(r'^["\']|["\']$', '', current_desc)
    
    # Vérifier si la description est tronquée bizarrement
    is_truncated = current_desc.endswith(('at', 'l\'', 'd\'', 'n\'', 's\'', 't\'', 'm\'')) and len(current_desc) < 100
    
    # Si tronquée ou trop longue/courte, la corriger
    desc_length = len(current_desc)
    needs_fix = is_truncated or desc_length < 120 or desc_length > 165
    
    if needs_fix:
        # Extraire le contenu de l'article pour créer une meilleure description
        # Prendre le premier paragraphe du contenu
        first_para_match = re.search(r'<p[^>]*class="text-lg[^"]*">(.+?)</p>', body, re.DOTALL)
        if first_para_match:
            first_para = first_para_match.group(1)
            # Nettoyer le HTML
            first_para = re.sub(r'<[^>]+>', '', first_para)
            first_para = re.sub(r'\s+', ' ', first_para).strip()
            
            # Créer une nouvelle description optimisée
            new_desc = extract_first_sentence(first_para, 160)
        else:
            # Si pas de paragraphe, utiliser le titre
            title_match = re.search(r'^title:\s*(.+)$', frontmatter, re.MULTILINE)
            if title_match:
                title = title_match.group(1).strip()
                title = re.sub(r'^["\']|["\']$', '', title)
                new_desc = title + '. Découvrez des conseils pratiques pour développer votre activité avec simplicité.'
                new_desc = extract_first_sentence(new_desc, 160)
            else:
                new_desc = current_desc
        
        # Remplacer la description dans le frontmatter
        new_frontmatter = re.sub(
            r'^description:\s*.+$',
            f'description: "{new_desc}"',
            frontmatter,
            flags=re.MULTILINE
        )
        
        new_content = frontmatter_match.group(1) + new_frontmatter + frontmatter_match.group(3) + body
        
        if new_content != original:
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
        if fix_description(md_file):
            fixed += 1
            print(f"✓ Description corrigée: {md_file.name}")
    
    print(f"\n{fixed} fichier(s) corrigé(s)")

if __name__ == '__main__':
    main()
