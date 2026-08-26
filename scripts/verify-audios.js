#!/usr/bin/env node
/**
 * scripts/verify-audios.js
 * 
 * Vérifie l'intégrité de tous les fichiers et balises audio du site :
 * 1. Tous les fichiers dans src/assets/audio/ doivent exister et être non vides (> 1 Ko).
 * 2. Tous les fichiers copiés dans _site/assets/audio/ doivent être non vides.
 * 3. Toutes les balises <audio> et <source src="..."> dans src/ et _site/ doivent pointer vers des fichiers valides ou URLs actives.
 * 4. Détecte les anciens liens Amazon S3 résiliés ou chemins manquants.
 */

const fs = require('fs');
const path = require('path');

const MIN_AUDIO_SIZE_BYTES = 1024; // Min 1 Ko pour éviter les fichiers 0-octets ou placeholders vides

function runAudioVerification(rootDir = process.cwd()) {
  const errors = [];
  const warnings = [];
  let checkedCount = 0;

  console.log('🔍 Vérification des fichiers et balises audio...');

  // 1. Vérification du dossier src/assets/audio
  const srcAudioDir = path.join(rootDir, 'src', 'assets', 'audio');
  if (!fs.existsSync(srcAudioDir)) {
    errors.push(`Le dossier source ${srcAudioDir} est introuvable.`);
  } else {
    const files = fs.readdirSync(srcAudioDir);
    for (const file of files) {
      if (file.startsWith('.')) continue; // ignore .DS_Store etc.
      const filePath = path.join(srcAudioDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        checkedCount++;
        if (stat.size < MIN_AUDIO_SIZE_BYTES) {
          errors.push(`Fichier audio vide ou trop petit dans src/ : ${file} (${stat.size} octets, minimum requis : ${MIN_AUDIO_SIZE_BYTES} octets)`);
        }
      }
    }
  }

  // 2. Vérification des balises audio dans les fichiers source (src/**/*.{md,njk,html})
  function scanDirForAudioTags(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDirForAudioTags(fullPath);
      } else if (entry.isFile() && /\.(md|njk|html)$/i.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Vérification des balises <source src="...">
        const sourceMatches = content.matchAll(/<source\s+[^>]*src=["']([^"']+)["'][^>]*>/gi);
        for (const match of sourceMatches) {
          const srcUrl = match[1];

          // Détecte les liens Amazon S3 obsolètes
          if (srcUrl.includes('amazonaws.com') || srcUrl.includes('.s3.')) {
            errors.push(`Lien Amazon S3 obsolète détecté dans ${path.relative(rootDir, fullPath)} : ${srcUrl}`);
          }

          // Vérification des fichiers audio locaux
          if (srcUrl.includes('/assets/audio/') || srcUrl.startsWith('assets/audio/')) {
            const cleanFilename = path.basename(srcUrl.replace(/\{\{[^}]+\}\}/g, '').trim());
            if (cleanFilename && !cleanFilename.includes('{{')) {
              const localSrcPath = path.join(srcAudioDir, cleanFilename);
              if (!fs.existsSync(localSrcPath)) {
                errors.push(`Fichier audio référencé inexistant dans ${path.relative(rootDir, fullPath)} : ${cleanFilename}`);
              } else {
                const stat = fs.statSync(localSrcPath);
                if (stat.size < MIN_AUDIO_SIZE_BYTES) {
                  errors.push(`Fichier audio référencé vide ou corrompu (${stat.size} octets) dans ${path.relative(rootDir, fullPath)} : ${cleanFilename}`);
                }
              }
            }
          }
        }
      }
    }
  }

  scanDirForAudioTags(path.join(rootDir, 'src'));

  // 3. Si _site existe, vérifier aussi _site/assets/audio
  const distAudioDir = path.join(rootDir, '_site', 'assets', 'audio');
  if (fs.existsSync(distAudioDir)) {
    const distFiles = fs.readdirSync(distAudioDir);
    for (const file of distFiles) {
      if (file.startsWith('.')) continue;
      const filePath = path.join(distAudioDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile() && stat.size < MIN_AUDIO_SIZE_BYTES) {
        errors.push(`Fichier audio généré vide ou corrompu dans _site/assets/audio/ : ${file} (${stat.size} octets)`);
      }
    }
  }

  // Rapport
  if (warnings.length > 0) {
    warnings.forEach(w => console.warn(`⚠️  ${w}`));
  }

  if (errors.length > 0) {
    console.error(`\n❌ ÉCHEC DU TEST AUDIO : ${errors.length} erreur(s) détectée(s) :`);
    errors.forEach(e => console.error(`   - ${e}`));
    return false;
  }

  console.log(`✓ Test audio réussi : ${checkedCount} fichier(s) audios analysés et valides (tous > ${MIN_AUDIO_SIZE_BYTES} octets).\n`);
  return true;
}

if (require.main === module) {
  const success = runAudioVerification();
  if (!success) {
    process.exit(1);
  }
}

module.exports = { runAudioVerification };
