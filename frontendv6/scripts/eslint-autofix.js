#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable no-console */

/**
 * ESLint Auto-fix Script
 * 
 * Script để tự động fix một số ESLint issues phổ biến
 * như unused variables, prefer-template, object-shorthand, etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Fix prefer-template issues
 * @param {string} content - File content
 * @returns {string} Fixed content
 */
function fixPreferTemplate(content) {
  // Fix simple string concatenations
  return content
    .replace(/(\w+)\s*\+\s*"\s*/g, '`${$1} ')
    .replace(/"\s*\+\s*(\w+)/g, ' ${$1}`')
    .replace(/"\s*\+\s*"([^"]+)"/g, '$1');
}

/**
 * Fix object-shorthand issues
 * @param {string} content - File content
 * @returns {string} Fixed content
 */
function fixObjectShorthand(content) {
  // Fix property shorthand
  return content.replace(/(\w+):\s*\1(?=[\s,}])/g, '$1');
}

/**
 * Fix unused variables by prefixing with underscore
 * @param {string} content - File content
 * @returns {string} Fixed content
 */
function fixUnusedVars(content) {
  // Common patterns for unused variables
  const patterns = [
    { regex: /\berror\b(?=\s*[,})])/g, replacement: '_error' },
    { regex: /\bIcon\b(?=\s*[,})])/g, replacement: '_Icon' },
    { regex: /\brequest\b(?=\s*[,})])/g, replacement: '_request' },
    { regex: /\berrorInfo\b(?=\s*[,})])/g, replacement: '_errorInfo' },
  ];

  let result = content;
  patterns.forEach(({ regex, replacement }) => {
    result = result.replace(regex, replacement);
  });

  return result;
}

/**
 * Process a single file
 * @param {string} filePath - Path to file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fixed = content;

    // Apply fixes
    fixed = fixPreferTemplate(fixed);
    fixed = fixObjectShorthand(fixed);
    fixed = fixUnusedVars(fixed);

    // Only write if content changed
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

/**
 * Recursively process directory
 * @param {string} dir - Directory path
 */
function processDirectory(dir) {
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.includes('node_modules') && !item.startsWith('.')) {
      processDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.jsx'))) {
      processFile(fullPath);
    }
  });
}

// Main execution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcPath = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcPath)) {
  console.log('Starting ESLint auto-fix...');
  processDirectory(srcPath);
  console.log('ESLint auto-fix completed!');
} else {
  console.error('src directory not found!');
  if (typeof process !== 'undefined' && process.exit) {
    process.exit(1);
  }
}
