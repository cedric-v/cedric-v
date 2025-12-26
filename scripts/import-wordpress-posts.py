#!/usr/bin/env python3
"""
Script pour importer les posts WordPress depuis un CSV et créer des fichiers Markdown pour Eleventy
"""
import csv
import re
import os
from pathlib import Path
from html import unescape
from urllib.parse import quote
import unicodedata

def slugify(text):
    """Convertit un texte en slug URL-friendly"""
    # Normaliser les caractères Unicode
    text = unicodedata.normalize('NFKD', text)
    # Convertir en minuscules
    text = text.lower()
    # Remplacer les espaces et caractères spéciaux par des tirets
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    # Supprimer les tirets en début/fin
    text = text.strip('-')
    return text

def clean_html(html_content):
    """Nettoie le HTML WordPress/Divi et extrait le texte formaté"""
    if not html_content:
        return ""
    
    # Décoder les entités HTML
    text = unescape(html_content)
    
    # Supprimer les commentaires HTML
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    
    # Supprimer les balises et_pb_* (Divi)
    text = re.sub(r'\[et_pb_[^\]]+\]', '', text)
    text = re.sub(r'\[/et_pb_[^\]]+\]', '', text)
    
    # Supprimer les balises wp:*
    text = re.sub(r'<!-- wp:[^\s]+.*?-->', '', text, flags=re.DOTALL)
    text = re.sub(r'<!-- /wp:[^\s]+ -->', '', text)
    
    # Remplacer <br /> et <br> par des sauts de ligne
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    
    # Extraire le contenu des balises <p>
    paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', text, flags=re.DOTALL | re.IGNORECASE)
    
    # Nettoyer chaque paragraphe
    cleaned_paragraphs = []
    for para in paragraphs:
        # Supprimer les balises <span> mais garder le contenu
        para = re.sub(r'<span[^>]*>', '', para)
        para = re.sub(r'</span>', '', para)
        # Supprimer les autres balises HTML
        para = re.sub(r'<[^>]+>', '', para)
        # Nettoyer les espaces multiples
        para = re.sub(r'\s+', ' ', para)
        para = para.strip()
        # Décoder les entités HTML restantes
        para = unescape(para)
        if para:
            cleaned_paragraphs.append(para)
    
    # Si pas de paragraphes trouvés, essayer d'extraire tout le texte
    if not cleaned_paragraphs:
        # Supprimer toutes les balises
        text = re.sub(r'<[^>]+>', '', text)
        # Nettoyer les espaces
        text = re.sub(r'\s+', ' ', text)
        text = unescape(text.strip())
        if text:
            cleaned_paragraphs.append(text)
    
    return '\n\n'.join(cleaned_paragraphs)

def format_content_for_markdown(content):
    """Formate le contenu pour Markdown avec une structure propre"""
    if not content:
        return ""
    
    # Séparer par paragraphes (double saut de ligne)
    paragraphs = content.split('\n\n')
    formatted_lines = []
    
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        
        # Détecter les titres/sections (lignes courtes avec emoji ou numérotation)
        if len(para) < 100 and (para.startswith('☀') or para.startswith('💡') or 
                                para.startswith(('1.', '2.', '3.', '4.', '5.')) or
                                (':' in para and len(para.split(':')) == 2 and len(para) < 80)):
            if para.startswith('☀') or para.startswith('💡'):
                formatted_lines.append(f"<h3 class=\"text-2xl font-semibold text-[#0A6BCE] mb-3\">{para}</h3>")
            elif para.startswith(('1.', '2.', '3.', '4.', '5.')):
                formatted_lines.append(f"<h3 class=\"text-2xl font-semibold text-[#0A6BCE] mb-3\">{para}</h3>")
            else:
                formatted_lines.append(f"<p class=\"text-lg leading-relaxed font-semibold\">{para}</p>")
        else:
            # Paragraphe normal - diviser en phrases pour meilleure lisibilité
            # Détecter les listes
            if para.startswith('- '):
                formatted_lines.append(f"<p class=\"text-lg leading-relaxed\">{para}</p>")
                else:
                    # Paragraphe normal - garder tel quel
                    formatted_lines.append(f"<p class=\"text-lg leading-relaxed\">{para}</p>")
    
    return '\n'.join(formatted_lines)

def create_markdown_file(title, content, date_str, output_dir):
    """Crée un fichier Markdown pour Eleventy"""
    # Générer le slug
    slug = slugify(title)
    
    # Parser la date
    try:
        from datetime import datetime
        date_obj = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
        date_formatted = date_obj.strftime('%Y-%m-%d')
    except:
        date_formatted = '2025-01-08'
    
    # Créer la description (premiers 160 caractères)
    description = content[:160].replace('\n', ' ').strip()
    if len(description) > 160:
        description = description[:157] + '...'
    
    # Échapper les guillemets pour YAML
    def escape_yaml_string(s):
        # Si la chaîne contient des guillemets doubles, utiliser des guillemets simples
        if '"' in s:
            # Échapper les guillemets simples dans la chaîne
            s = s.replace("'", "''")
            return f"'{s}'"
        # Sinon, utiliser des guillemets doubles
        return f'"{s}"'
    
    title_escaped = escape_yaml_string(title)
    description_escaped = escape_yaml_string(description)
    
    # Créer le contenu Markdown
    markdown_content = f"""---
layout: base.njk
title: {title_escaped}
description: {description_escaped}
locale: fr
permalink: /{slug}/
date: {date_formatted}
---

<section class="max-w-4xl mx-auto px-6 md:px-12 py-16 space-y-12">
  <header class="space-y-4 text-center">
    <h1 class="text-4xl md:text-5xl font-semibold text-[#0f172a]">
      {title}
    </h1>
  </header>

  <article class="max-w-none space-y-8 text-[#1f1f1f] prose prose-lg">
    <div class="section-card p-8 bg-white space-y-6">
{format_content_for_markdown(content)}
    </div>
  </article>
</section>
"""
    
    # Écrire le fichier
    file_path = output_dir / f"{slug}.md"
    file_path.write_text(markdown_content, encoding='utf-8')
    
    return file_path

def main():
    csv_path = Path("/Users/cedric 1/Downloads/cedricv-wordpress-posts.csv")
    output_dir = Path("/Users/cedric 1/Documents/coding/cedric-v/src/fr")
    
    if not csv_path.exists():
        print(f"Erreur: Le fichier CSV n'existe pas: {csv_path}")
        return
    
    print(f"Lecture du fichier CSV: {csv_path}")
    print(f"Répertoire de sortie: {output_dir}")
    
    created_files = []
    skipped_files = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        # Le CSV n'a pas d'en-têtes, on lit directement les lignes
        reader = csv.reader(f)
        
        for row_num, row in enumerate(reader, 1):
            if len(row) < 4:
                print(f"Ligne {row_num}: Format invalide, ignorée")
                continue
            
            title = row[0].strip()
            html_content = row[1]
            post_type = row[2].strip() if len(row) > 2 else 'post'
            date_str = row[3].strip() if len(row) > 3 else '2025-01-08 00:00:00'
            
            # Ignorer si ce n'est pas un post
            if post_type != 'post':
                continue
            
            # Nettoyer le contenu HTML
            clean_content = clean_html(html_content)
            
            if not clean_content or not title:
                print(f"Ligne {row_num}: Contenu vide, ignorée")
                continue
            
            # Générer le slug
            slug = slugify(title)
            
            # Vérifier si le fichier existe déjà
            file_path = output_dir / f"{slug}.md"
            if file_path.exists():
                skipped_files.append((title, slug))
                print(f"⚠️  Fichier existant ignoré: {slug}.md")
                continue
            
            # Créer le fichier
            try:
                create_markdown_file(title, clean_content, date_str, output_dir)
                created_files.append((title, slug))
                print(f"✓ Créé: {slug}.md - {title[:50]}...")
            except Exception as e:
                print(f"✗ Erreur pour '{title}': {e}")
    
    print(f"\n{'='*60}")
    print(f"Résumé:")
    print(f"  - Fichiers créés: {len(created_files)}")
    print(f"  - Fichiers ignorés (déjà existants): {len(skipped_files)}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
