#!/usr/bin/env node
/**
 * Collections Sync Script
 *
 * Reads collection items from a simple config file (collections-sources.json)
 * or accepts them via CLI, then writes to data/collections.json.
 *
 * Usage:
 *   node scripts/fetch-collections.js
 *
 * Or add items to data/collections-sources.json:
 * [
 *   {
 *     "id": "guanzhan-zhi",
 *     "title": "观展志 — 上海美术展会信息平台",
 *     "description": "上海美术展会信息聚合平台，提供展会日程、场馆信息和观展指南。",
 *     "url": "https://i5cncju7yscwm.ok.kimi.link",
 *     "source": "kimi",
 *     "category": "工具",
 *     "tags": ["art", "shanghai", "exhibition"],
 *     "featured": true
 *   }
 * ]
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const SOURCES_FILE = path.join(DATA_DIR, 'collections-sources.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'collections.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load existing collections
function loadExisting() {
  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      const data = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
      return data.collections || [];
    }
  } catch (e) {}
  return [];
}

// Load sources config
function loadSources() {
  try {
    if (fs.existsSync(SOURCES_FILE)) {
      return JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('❌ Failed to parse collections-sources.json:', e.message);
    process.exit(1);
  }
  return [];
}

function main() {
  const sources = loadSources();

  if (sources.length === 0) {
    console.log('⚠️  No sources found in data/collections-sources.json');
    console.log('');
    console.log('Create data/collections-sources.json with items:');
    console.log(JSON.stringify([
      {
        id: 'my-project',
        title: 'My Project Title',
        description: 'Project description',
        url: 'https://example.com',
        source: 'kimi',
        category: '工具',
        tags: ['tag1', 'tag2'],
        featured: false,
      },
    ], null, 2));
    process.exit(0);
  }

  const existing = loadExisting();
  const existingMap = new Map(existing.map((c) => [c.id, c]));

  let added = 0;
  let updated = 0;

  const collections = sources.map((src) => {
    const item = {
      id: src.id,
      title: src.title || '',
      description: src.description || '',
      url: src.url || '',
      source: src.source || 'other',
      category: src.category || 'Uncategorized',
      tags: Array.isArray(src.tags) ? src.tags : [],
      date: src.date || new Date().toISOString().slice(0, 10),
      thumbnail: src.thumbnail || undefined,
      featured: typeof src.featured === 'boolean' ? src.featured : false,
    };

    const prev = existingMap.get(item.id);
    if (prev) {
      updated++;
    } else {
      added++;
    }

    return item;
  });

  const output = {
    collections,
    lastUpdated: new Date().toISOString(),
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n');

  console.log(`✅ Collections synced: ${added} new, ${updated} updated, ${collections.length} total`);
  console.log(`📁 Saved to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

main();
