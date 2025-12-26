#!/usr/bin/env python3
"""
Script pour ajouter des liens internes pertinents dans les articles de blog
pour améliorer le SEO interne.
"""
import os
import re
from pathlib import Path
from collections import defaultdict

# Mots-clés et leurs pages cibles (priorité décroissante)
KEYWORD_LINKS = [
    # RDV Clarté - priorité haute
    {
        'url': '/rdv/clarte/',
        'keywords': [
            (r'\bRDV Clarté\b', 'RDV Clarté'),
            (r'\bretrouver.*clarté\b', None),  # None = utiliser le texte trouvé
            (r'\bmanque.*clarté\b', None),
            (r'\bavoir.*clarté\b', None),
        ],
        'max_per_article': 1
    },
    # Accompagnement individuel - priorité haute
    {
        'url': '/accompagnement/individuel/',
        'keywords': [
            (r'\baccompagnement individuel\b', 'accompagnement individuel'),
            (r'\bêtre accompagné\b', None),
            (r'\bretrouver.*fluidité.*activité\b', None),
            (r'\bdévelopper.*activité\b', None),
        ],
        'max_per_article': 2
    },
    # Formules
    {
        'url': '/accompagnement/formules/',
        'keywords': [
            (r'\bformules?\b', None),
            (r'\bfocus sos\b', 'Focus SOS'),
            (r'\bformule.*croissance\b', None),
            (r'\bformule.*immersion\b', None),
        ],
        'max_per_article': 1
    },
    # Approche Fluance
    {
        'url': '/a-propos/approche-fluance/',
        'keywords': [
            (r'\bapproche fluance\b', 'approche Fluance'),
            (r'\bméthode fluance\b', 'méthode Fluance'),
        ],
        'max_per_article': 1
    },
    # Philosophie
    {
        'url': '/a-propos/philosophie/',
        'keywords': [
            (r'\bphilosophie\b', None),
        ],
        'max_per_article': 1
    },
]

# Mapping des sujets similaires entre articles
RELATED_ARTICLES = {
    'simplicité': ['moins-mais-mieux-cela-vous-parle', 'la-simplicite-cree-de-la-clarte-et-du-focus-de-la-theorie-a-la-pratique'],
    'clarté': ['la-confusion-mene-a-linaction-et-donc-a-labsence-de-ventes', 'laxe-de-developpement-de-votre-activite-est-il-limpide'],
    'unicité': ['avez-vous-clairement-identifie-votre-unicite-et-celle-de-votre-activitebusiness', 'les-3-piliers-dun-business-simple-pour-vous-base-sur-votre-unicite'],
    'système': ['focalise-toi-sur-les-systemes-plutot-que-sur-les-resultats10-systemes-pour-booster-ton-business'],
    'croissance': ['tout-va-trop-vite-les-dangers-de-lhypercroissance', 'le-2080-comme-levier-de-croissance-pour-booster-votre-activite'],
    'éparpillement': ['comment-eviter-les-journees-entieres-passees-a-separpiller-et-cette-sensation-desagreable-davoir-perdu-son-temps', 'je-meparpille-et-a-la-longue-je-mepuise'],
}

def is_in_html_tag(text, pos):
    """Vérifie si la position est dans un tag HTML"""
    before = text[max(0, pos-100):pos]
    after = text[pos:min(len(text), pos+100)]
    
    # Vérifier si on est dans un tag HTML
    if re.search(r'<[^>]*$', before):
        return True
    if re.search(r'^[^<]*>', after):
        return True
    
    # Vérifier si on est dans un lien existant
    before_link = text[max(0, pos-200):pos]
    if re.search(r'<a\s[^>]*>', before_link):
        # Vérifier si on n'a pas fermé le lien
        after_link = text[pos:min(len(text), pos+200)]
        if not re.search(r'</a>', before_link[-200:]):
            return True
    
    # Vérifier si on est dans un attribut href
    if re.search(r'href\s*=\s*["\'][^"\']*$', before):
        return True
    
    return False

def add_internal_links(content, file_path):
    """Ajoute des liens internes pertinents dans le contenu"""
    original_content = content
    changes_made = False
    links_added = defaultdict(int)  # Compteur par URL
    
    # Séparer le frontmatter du contenu (ne pas modifier le frontmatter)
    frontmatter_match = re.match(r'^(---\n.*?\n---\n)(.*)$', content, re.DOTALL)
    if frontmatter_match:
        frontmatter = frontmatter_match.group(1)
        body = frontmatter_match.group(2)
    else:
        frontmatter = ''
        body = content
    
    # Exclure le CTA de la modification
    cta_match = re.search(r'(<!-- CTA pour l\'accompagnement -->.*?</section>)', body, re.DOTALL)
    if cta_match:
        cta_section = cta_match.group(1)
        body_without_cta = body[:cta_match.start()] + body[cta_match.end():]
    else:
        cta_section = ''
        body_without_cta = body
    
    # Ajouter des liens vers les pages principales (dans le body uniquement)
    for link_config in KEYWORD_LINKS:
        target_url = link_config['url']
        max_per_article = link_config['max_per_article']
        
        for keyword_pattern, link_text_override in link_config['keywords']:
            if links_added[target_url] >= max_per_article:
                break
            
            # Chercher les occurrences dans le body uniquement
            matches = list(re.finditer(keyword_pattern, body_without_cta, re.IGNORECASE))
            
            # Traiter en ordre inverse pour ne pas décaler les positions
            for match in reversed(matches):
                if links_added[target_url] >= max_per_article:
                    break
                
                start, end = match.span()
                
                # Vérifier si on peut ajouter un lien ici
                if is_in_html_tag(body_without_cta, start):
                    continue
                
                matched_text = match.group(0)
                link_text = link_text_override if link_text_override else matched_text
                
                # Créer le lien
                new_link = f'<a href="{{ \'{target_url}\' | relativeUrl }}" class="text-[#0A6BCE] hover:underline">' + link_text + '</a>'
                
                body_without_cta = body_without_cta[:start] + new_link + body_without_cta[end:]
                links_added[target_url] += 1
                changes_made = True
                break  # Une seule occurrence par pattern
    
    # Ajouter des liens vers des articles similaires (maximum 2 par article)
    article_slug = file_path.stem
    added_related = 0
    
    for topic, related_slugs in RELATED_ARTICLES.items():
        if added_related >= 2:
            break
        
        if topic.lower() in body_without_cta.lower() and article_slug not in related_slugs:
            for related_slug in related_slugs[:1]:  # 1 lien par sujet
                if related_slug != article_slug:
                    related_file = file_path.parent / f"{related_slug}.md"
                    if related_file.exists():
                        # Chercher une occurrence naturelle du sujet
                        topic_pattern = r'\b' + re.escape(topic) + r'\b'
                        match = re.search(topic_pattern, body_without_cta, re.IGNORECASE)
                        if match and not is_in_html_tag(body_without_cta, match.start()):
                            start, end = match.span()
                            link = f'<a href="{{ \'/{related_slug}/\' | relativeUrl }}" class="text-[#0A6BCE] hover:underline">' + match.group(0) + '</a>'
                            body_without_cta = body_without_cta[:start] + link + body_without_cta[end:]
                            changes_made = True
                            added_related += 1
                            break
    
    # Reconstruire le contenu complet
    if cta_section:
        new_content = frontmatter + body_without_cta + cta_section
    else:
        new_content = frontmatter + body_without_cta
    
    return new_content, changes_made

def process_blog_post(file_path):
    """Traite un article de blog"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Erreur lecture {file_path.name}: {e}")
        return False
    
    # Ne pas modifier si déjà beaucoup de liens (éviter la sur-optimisation)
    link_count = len(re.findall(r'<a\s+href', content))
    if link_count > 10:
        return False
    
    new_content, changed = add_internal_links(content, file_path)
    
    if changed:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        except Exception as e:
            print(f"Erreur écriture {file_path.name}: {e}")
            return False
    
    return False

def main():
    blog_dir = Path("/Users/cedric 1/Documents/coding/cedric-v/src/fr")
    
    # Fichiers à exclure
    excluded_files = {
        'index.md', 'contact.md', 'cadeau.md', 'connexion.md', 
        'confirmation.md', 'fluance-particuliers.md'
    }
    
    updated_count = 0
    
    # Parcourir tous les fichiers .md dans src/fr (niveau racine uniquement)
    for md_file in sorted(blog_dir.glob('*.md')):
        if md_file.name in excluded_files:
            continue
        
        if process_blog_post(md_file):
            updated_count += 1
            print(f"✓ Liens ajoutés: {md_file.name}")
    
    print(f"\n{'='*60}")
    print(f"Résumé: {updated_count} fichier(s) mis à jour avec des liens internes")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
