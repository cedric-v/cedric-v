#!/usr/bin/env python3
"""
Script pour corriger le formatage des listes numérotées dans les articles de blog
Sépare les points numérotés en paragraphes distincts pour améliorer la lisibilité
"""
import re
from pathlib import Path

def fix_numbered_list(content):
    """Corrige les listes numérotées dans le contenu"""
    original = content
    changes_made = False
    
    # Pattern pour détecter plusieurs points numérotés dans un paragraphe
    # Cherche des patterns comme "1. ... 2. ... 3. ..." dans un seul <p>
    pattern = r'<p class="text-lg leading-relaxed">([^<]*?)(\d+)\.\s+([^<]*?)(\d+)\.\s+([^<]*?)</p>'
    
    def replace_list(match):
        full_text = match.group(0)
        before = match.group(1)
        first_num = match.group(2)
        first_text = match.group(3)
        second_num = match.group(4)
        second_text = match.group(5)
        
        # Vérifier s'il y a plus de points dans le texte
        remaining = second_text
        points = []
        
        # Extraire tous les points numérotés
        point_pattern = r'(\d+)\.\s+([^0-9<]+?)(?=\d+\.|$)'
        all_points = list(re.finditer(point_pattern, full_text))
        
        if len(all_points) >= 2:
            # Reconstruire avec séparation
            result = []
            if before.strip():
                result.append(f'<p class="text-lg leading-relaxed">{before.strip()}</p>')
            
            result.append('<div class="space-y-4">')
            
            for point_match in all_points:
                num = point_match.group(1)
                text = point_match.group(2).strip()
                # Nettoyer la fin du texte (enlever les espaces avant le prochain point)
                text = re.sub(r'\s+\d+\.\s*$', '', text).strip()
                if text:
                    result.append(f'  <div>')
                    result.append(f'    <p class="text-lg leading-relaxed"><strong>{num}.</strong> {text}</p>')
                    result.append(f'  </div>')
            
            result.append('</div>')
            return '\n'.join(result)
        
        return full_text
    
    # Chercher et remplacer les listes dans les paragraphes
    new_content = re.sub(
        r'<p class="text-lg leading-relaxed">([^<]*?)(\d+)\.\s+([^<]*?)(\d+)\.\s+',
        replace_list,
        content,
        flags=re.DOTALL
    )
    
    if new_content != original:
        changes_made = True
    
    return new_content, changes_made

def fix_specific_articles(file_path):
    """Corrige des articles spécifiques avec des listes numérotées"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    changes_made = False
    
    # Extraire le contenu de l'article (hors frontmatter et CTA)
    frontmatter_match = re.match(r'^(---\n.*?\n---\n)(.*?)(<!-- CTA.*?</section>)', content, re.DOTALL)
    if not frontmatter_match:
        return False
    
    frontmatter = frontmatter_match.group(1)
    article_body = frontmatter_match.group(2)
    cta_section = frontmatter_match.group(3)
    
    # Articles spécifiques à corriger
    filename = file_path.name
    
    if filename == 'les-10-points-que-je-transmettrais-au-cedric-dil-y-a-5-ans.md':
        # Séparer les 10 points
        pattern = r'<p class="text-lg leading-relaxed">Spoiler : cela pourrait aussi te parler\. 😉\s+(.*?)</p>'
        match = re.search(pattern, article_body, re.DOTALL)
        if match:
            points_text = match.group(1)
            # Extraire chaque point
            points = re.findall(r'(\d+)\.\s+([^0-9]+?)(?=\d+\.|Est-ce qu)', points_text, re.DOTALL)
            
            if len(points) >= 10:
                new_body = article_body.replace(
                    match.group(0),
                    '<p class="text-lg leading-relaxed">Spoiler : cela pourrait aussi te parler. 😉</p>\n      \n      <div class="space-y-4">\n' +
                    '\n'.join([f'        <div>\n          <p class="text-lg leading-relaxed"><strong>{num}.</strong> {text.strip()}</p>\n        </div>' for num, text in points]) +
                    '\n      </div>\n      <p class="text-lg leading-relaxed">Est-ce qu\'un de ces points te parle particulièrement ? Lequel ?</p>'
                )
                article_body = new_body
                changes_made = True
    
    elif filename == 'quelle-offre-mettre-en-avant-voici-3-pistes-pour-taider-a-optimiser.md':
        # Séparer les 3 points
        pattern = r'<p class="text-lg leading-relaxed">Tu as plusieurs offres.*?Voici 3 pistes.*?:\s+(.*?)</p>'
        match = re.search(pattern, article_body, re.DOTALL)
        if match:
            points_text = match.group(0)
            # Extraire les 3 points
            intro = 'Tu as plusieurs offres qui fonctionnent moyennement et tu te demandes laquelle mettre en avant ? Voici 3 pistes pour t\'aider à optimiser :'
            points = re.findall(r'(\d+)\.\s+([^0-9]+?)(?=\d+\.|Combien)', points_text, re.DOTALL)
            
            if len(points) >= 3:
                new_body = article_body.replace(
                    points_text,
                    f'<p class="text-lg leading-relaxed">{intro}</p>\n      \n      <div class="space-y-4">\n' +
                    '\n'.join([f'        <div>\n          <p class="text-lg leading-relaxed"><strong>{num}.</strong> {text.strip()}</p>\n        </div>' for num, text in points]) +
                    '\n      </div>\n      <p class="text-lg leading-relaxed">Combien as-tu d\'offres ? As-tu l\'une d\'elle qui sort particulièrement du lot ?</p>'
                )
                article_body = new_body
                changes_made = True
    
    elif filename == 'clarte-focus-perseverance-le-trio-puissant-des-entrepreneures.md':
        # Séparer les 3 points
        pattern = r'<p class="text-lg leading-relaxed">Je développe 👇\s+(.*?)</p>'
        match = re.search(pattern, article_body, re.DOTALL)
        if match:
            points_text = match.group(1)
            # Extraire les 3 points
            points = re.findall(r'(\d+)\.\s+([^0-9]+?)(?=\d+\.|Déjà)', points_text, re.DOTALL)
            
            if len(points) >= 3:
                new_body = article_body.replace(
                    match.group(0),
                    '<p class="text-lg leading-relaxed">Je développe 👇</p>\n      \n      <div class="space-y-4">\n' +
                    '\n'.join([f'        <div>\n          <p class="text-lg leading-relaxed"><strong>{num}.</strong> {text.strip()}</p>\n        </div>' for num, text in points]) +
                    '\n      </div>\n      <p class="text-lg leading-relaxed">Déjà essayé ? Quelle est ton approche générant des progrès ?</p>'
                )
                article_body = new_body
                changes_made = True
    
    elif filename == '5-predictions-pour-les-entreprises-en-2030.md':
        # Séparer les 5 points
        pattern = r'<p class="text-lg leading-relaxed">(.*?)</p>'
        match = re.search(pattern, article_body, re.DOTALL)
        if match:
            full_text = match.group(1)
            # Extraire les 5 points
            points = re.findall(r'(\d+)\.\s+([^0-9]+?)(?=\d+\.|D\'accord)', full_text, re.DOTALL)
            
            if len(points) >= 5:
                new_body = article_body.replace(
                    match.group(0),
                    '<div class="space-y-4">\n' +
                    '\n'.join([f'        <div>\n          <p class="text-lg leading-relaxed"><strong>{num}.</strong> {text.strip()}</p>\n        </div>' for num, text in points]) +
                    '\n      </div>\n      <p class="text-lg leading-relaxed">D\'accord, pas d\'accord ? Des nuances à ajouter ? Quelles sont vos prédictions pour 2030 ?</p>'
                )
                article_body = new_body
                changes_made = True
    
    if changes_made:
        new_content = frontmatter + article_body + cta_section
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    
    return False

def main():
    blog_dir = Path("/Users/cedric 1/Documents/coding/cedric-v/src/fr")
    excluded = {'index.md', 'contact.md', 'cadeau.md', 'connexion.md', 'confirmation.md', 'fluance-particuliers.md'}
    
    # Articles spécifiques à corriger
    specific_files = [
        'les-10-points-que-je-transmettrais-au-cedric-dil-y-a-5-ans.md',
        'quelle-offre-mettre-en-avant-voici-3-pistes-pour-taider-a-optimiser.md',
        'clarte-focus-perseverance-le-trio-puissant-des-entrepreneures.md',
        '5-predictions-pour-les-entreprises-en-2030.md'
    ]
    
    fixed = 0
    for filename in specific_files:
        md_file = blog_dir / filename
        if md_file.exists():
            if fix_specific_articles(md_file):
                fixed += 1
                print(f"✓ Corrigé: {filename}")
    
    print(f"\n{fixed} fichier(s) corrigé(s)")

if __name__ == '__main__':
    main()
