#!/usr/bin/env python3
"""
Script pour ajouter les microformats h-entry aux articles de blog
"""
import re
from pathlib import Path

def add_h_entry_to_post(file_path):
    """Ajoute h-entry et les classes microformats à un article de blog"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = False
    
    # Vérifier si c'est un article de blog (a une date)
    if 'date:' not in content:
        return False
    
    # Vérifier si h-entry est déjà présent
    if 'h-entry' in content:
        return False
    
    # Trouver la balise <article> et ajouter h-entry
    # Pattern pour trouver <article class="...">
    article_pattern = r'<article\s+class="([^"]*)"'
    
    def replace_article(match):
        classes = match.group(1)
        # Ajouter h-entry si pas déjà présent
        if 'h-entry' not in classes:
            new_classes = classes + ' h-entry'
            return f'<article class="{new_classes}"'
        return match.group(0)
    
    if re.search(article_pattern, content):
        content = re.sub(article_pattern, replace_article, content)
        changes_made = True
    
    # Trouver le <h1> dans le header et ajouter p-name
    h1_pattern = r'(<h1[^>]*class="([^"]*)"[^>]*>)'
    
    def replace_h1(match):
        full_tag = match.group(1)
        classes = match.group(2) if match.group(2) else ''
        if 'p-name' not in classes:
            if classes:
                new_classes = classes + ' p-name'
            else:
                new_classes = 'p-name'
            return full_tag.replace(f'class="{classes}"', f'class="{new_classes}"') if classes else full_tag.replace('<h1', f'<h1 class="{new_classes}"')
        return full_tag
    
    if re.search(h1_pattern, content):
        content = re.sub(h1_pattern, replace_h1, content)
        changes_made = True
    
    # Trouver le <time> et ajouter dt-published
    time_pattern = r'(<time[^>]*datetime="([^"]*)"[^>]*>)'
    
    def replace_time(match):
        full_tag = match.group(1)
        if 'dt-published' not in full_tag:
            if 'class=' in full_tag:
                full_tag = full_tag.replace('class="', 'class="dt-published ')
            else:
                full_tag = full_tag.replace('<time', '<time class="dt-published"')
        return full_tag
    
    if re.search(time_pattern, content):
        content = re.sub(time_pattern, replace_time, content)
        changes_made = True
    
    # Ajouter u-url sur les liens vers l'article lui-même (dans le header si présent)
    # Pour l'instant, on se concentre sur les éléments principaux
    
    if changes_made:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    blog_dirs = [
        Path("/Users/cedric 1/Documents/coding/cedric-v/src/fr"),
        Path("/Users/cedric 1/Documents/coding/cedric-v/src/en")
    ]
    
    updated_count = 0
    
    for blog_dir in blog_dirs:
        if not blog_dir.exists():
            print(f"Directory {blog_dir} does not exist, skipping...")
            continue
        
        # Trouver tous les fichiers .md qui ont une date (articles de blog)
        for md_file in blog_dir.glob("*.md"):
            if add_h_entry_to_post(md_file):
                updated_count += 1
                print(f"Updated: {md_file.name}")
    
    print(f"\nTotal articles updated: {updated_count}")

if __name__ == "__main__":
    main()
