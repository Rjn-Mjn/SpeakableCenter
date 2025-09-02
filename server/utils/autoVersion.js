#!/usr/bin/env node
/**
 * Auto-versioning utility for CSS and JS files
 * Run this script to automatically add version query strings to your HTML files
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const HTML_DIR = path.join(__dirname, '../../client/src/pages');
const ASSET_BASE_DIR = path.join(__dirname, '../../client/src');

// Function to generate hash from file content
function generateHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return Date.now().toString().substring(0, 8);
  }
}

// Function to update version in HTML files
function updateVersionsInHTML(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  let updated = false;
  
  // Pattern to match CSS and JS file references
  const patterns = [
    // CSS files
    {
      regex: /<link[^>]+href="([^"]+\.css)(\?v=[^"]*)?"/g,
      type: 'css'
    },
    // JS files
    {
      regex: /<script[^>]+src="([^"]+\.js)(\?v=[^"]*)?"/g,
      type: 'js'
    }
  ];
  
  patterns.forEach(({ regex, type }) => {
    html = html.replace(regex, (match, filePath, existingVersion) => {
      // Skip external URLs
      if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('//')) {
        return match;
      }
      
      // Resolve the actual file path
      let actualPath = filePath;
      if (filePath.startsWith('/')) {
        actualPath = filePath.substring(1);
      }
      actualPath = actualPath.replace(/^\.\.\//, '');
      
      const fullPath = path.join(ASSET_BASE_DIR, actualPath);
      
      // Generate new version hash
      const version = process.env.NODE_ENV === 'production' 
        ? generateHash(fullPath)
        : Date.now().toString();
      
      // Replace with new version
      const newMatch = match.replace(
        new RegExp(`${filePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\?v=[^"]*)?`),
        `${filePath}?v=${version}`
      );
      
      if (newMatch !== match) {
        updated = true;
      }
      
      return newMatch;
    });
  });
  
  if (updated) {
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`✅ Updated versions in ${path.basename(htmlPath)}`);
  }
}

// Function to process all HTML files
function processAllHTMLFiles() {
  console.log('🔄 Auto-versioning static assets...\n');
  
  try {
    const files = fs.readdirSync(HTML_DIR);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
      const filePath = path.join(HTML_DIR, file);
      updateVersionsInHTML(filePath);
    });
    
    console.log(`\n✨ Versioning complete! ${htmlFiles.length} HTML files processed.`);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n📝 Running in development mode - using timestamps for instant cache busting');
      console.log('💡 Tip: Your browser will now always load the latest CSS/JS files!');
    } else {
      console.log('\n📦 Running in production mode - using content hashes for efficient caching');
    }
    
  } catch (error) {
    console.error('❌ Error processing files:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  processAllHTMLFiles();
}

export { generateHash, updateVersionsInHTML, processAllHTMLFiles };
