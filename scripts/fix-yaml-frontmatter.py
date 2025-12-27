#!/usr/bin/env python3
"""
Script pour corriger les problèmes YAML dans les frontmatter des articles EN
"""

import re
from pathlib import Path

def fix_yaml_value(value):
    """Corrige une valeur YAML pour éviter les problèmes de guillemets"""
    if not value:
        return '""'
    
    value_str = str(value)
    
    # Si contient des guillemets doubles ET simples, utiliser des guillemets doubles avec échappement
    if '"' in value_str and "'" in value_str:
        value_str = value_str.replace('"', '\\"')
        return f'"{value_str}"'
    # Si contient seulement des guillemets doubles, utiliser des guillemets simples
    elif '"' in value_str:
        value_str = value_str.replace("'", "''")
        return f"'{value_str}'"
    # Si contient seulement des guillemets simples, utiliser des guillemets doubles
    elif "'" in value_str:
        value_str = value_str.replace('"', '\\"')
        return f'"{value_str}"'
    # Sinon, utiliser des guillemets doubles
    else:
        return f'"{value_str}"'

def parse_yaml_frontmatter(text):
    """Parse simple YAML frontmatter"""
    frontmatter = {}
    for line in text.split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
            frontmatter[key] = value
    return frontmatter

def extract_frontmatter(content):
    """Extrait le frontmatter YAML"""
    if not content.startswith('---'):
        return None, content
    parts = content.split('---', 2)
    if len(parts) < 3:
        return None, content
    frontmatter_text = parts[1].strip()
    body = parts[2]
    try:
        frontmatter = parse_yaml_frontmatter(frontmatter_text)
        return frontmatter, body
    except:
        return None, content

def fix_file(file_path):
    """Corrige le frontmatter YAML d'un fichier"""
    try:
        content = file_path.read_text(encoding='utf-8')
    except:
        return False
    
    frontmatter, body = extract_frontmatter(content)
    if not frontmatter:
        return False
    
    # Reconstruire le frontmatter avec des valeurs correctement échappées
    new_frontmatter = "---\n"
    for key, value in frontmatter.items():
        fixed_value = fix_yaml_value(value)
        new_frontmatter += f"{key}: {fixed_value}\n"
    new_frontmatter += "---\n\n"
    
    new_content = new_frontmatter + body
    
    # Écrire seulement si différent
    if new_content != content:
        file_path.write_text(new_content, encoding='utf-8')
        return True
    
    return False

def main():
    en_dir = Path("/Users/cedric 1/Documents/coding/cedric-v/src/en")
    en_files = list(en_dir.glob("*.md"))
    
    print(f"🔧 Correction des frontmatter YAML dans {len(en_files)} fichiers...\n")
    
    fixed_count = 0
    for en_file in sorted(en_files):
        if fix_file(en_file):
            print(f"  ✓ {en_file.name}")
            fixed_count += 1
    
    print(f"\n✅ {fixed_count} fichiers corrigés")

if __name__ == "__main__":
    main()
