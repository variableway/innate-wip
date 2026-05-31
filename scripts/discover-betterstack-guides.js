const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://betterstack.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'packages', 'betterstack-guides');
const MARKDOWN_DIR = path.join(OUTPUT_DIR, 'guides');
const CODE_DIR = path.join(OUTPUT_DIR, 'code');

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function curlFetch(url, acceptHeader = 'text/html') {
  try {
    const result = execSync(
      `curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36" -H "Accept: ${acceptHeader}" "${url}"`,
      { encoding: 'utf-8', timeout: 30000 }
    );
    return result;
  } catch (e) {
    throw new Error(`curl failed: ${e.message}`);
  }
}

async function discoverGuides() {
  console.log('Fetching main guides page...');
  const html = curlFetch(`${BASE_URL}/community/guides`);
  console.log(`  HTML length: ${html.length}`);

  const $ = cheerio.load(html);
  const allGuides = [];
  const seen = new Set();
  const categories = [];

  $('a[href]').each((_, el) => {
    try {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (!href || !text) return;
      if (!href.startsWith('/community/guides/')) return;
      if (href.includes('?utm_')) return;
      if (seen.has(href)) return;
      seen.add(href);

      const parts = href.split('/').filter(Boolean);
      if (parts.length < 3 || parts[0] !== 'community' || parts[1] !== 'guides') return;

      const isCategory = parts.length === 3;
      if (isCategory) {
        categories.push({ href, text });
      } else {
        allGuides.push({ href, text, category: parts[2] || 'general' });
      }
    } catch (e) {
      // ignore
    }
  });

  console.log(`  Categories: ${categories.length}`);
  console.log(`  Guides on main page: ${allGuides.length}`);

  // Step 2: Explore each category page
  for (let ci = 0; ci < categories.length; ci++) {
    const cat = categories[ci];
    try {
      console.log(`\n[${ci + 1}/${categories.length}] Exploring: ${cat.text} (${cat.href})`);
      const catHtml = curlFetch(`${BASE_URL}${cat.href}`);
      const $$ = cheerio.load(catHtml);

      let newCount = 0;
      $$('a[href]').each((_, el) => {
        try {
          const href = $$(el).attr('href');
          const text = $$(el).text().trim();
          if (!href || !text || seen.has(href)) return;
          if (!href.startsWith('/community/guides/')) return;
          if (href.includes('?utm_')) return;
          seen.add(href);

          const parts = href.split('/').filter(Boolean);
          if (parts.length < 4 || parts[0] !== 'community' || parts[1] !== 'guides') return;

          allGuides.push({ href, text, category: parts[2] || 'general' });
          newCount++;
        } catch (e) {
          // ignore
        }
      });

      console.log(`  Found ${newCount} new guides (total: ${allGuides.length})`);
      await delay(500);
    } catch (e) {
      console.error(`  Error fetching ${cat.href}: ${e.message}`);
    }
  }

  return { guides: allGuides, categories };
}

async function downloadMarkdown(guides) {
  fs.mkdirSync(MARKDOWN_DIR, { recursive: true });

  const results = [];
  for (let i = 0; i < guides.length; i++) {
    const guide = guides[i];
    const mdUrl = `${BASE_URL}${guide.href}.md`;

    try {
      const content = curlFetch(mdUrl, 'text/markdown');
      if (content.length < 300) {
        console.log(`  [${i + 1}/${guides.length}] SKIP ${guide.href}: too short (${content.length})`);
        continue;
      }

      const parts = guide.href.split('/').filter(Boolean);
      const slug = parts[parts.length - 1] || 'index';
      const categorySlug = parts[2] || 'general';
      const categoryDir = path.join(MARKDOWN_DIR, categorySlug);
      fs.mkdirSync(categoryDir, { recursive: true });

      const filePath = path.join(categoryDir, `${slug}.md`);
      fs.writeFileSync(filePath, content, 'utf-8');

      results.push({ ...guide, filePath, size: content.length });
      console.log(`  [${i + 1}/${guides.length}] OK ${guide.href} (${content.length} chars)`);

      await delay(300);
    } catch (e) {
      console.error(`  [${i + 1}/${guides.length}] ERROR ${guide.href}: ${e.message}`);
    }
  }

  return results;
}

async function extractCode(guides) {
  fs.mkdirSync(CODE_DIR, { recursive: true });
  const codeBlocks = [];

  for (const guide of guides) {
    if (!guide.filePath || !fs.existsSync(guide.filePath)) continue;

    const content = fs.readFileSync(guide.filePath, 'utf-8');
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let blockIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      const lang = (match[1] || 'txt').toLowerCase();
      const code = match[2].trim();
      if (code.length < 20) continue;

      codeBlocks.push({
        guide: guide.href,
        language: lang,
        code,
        index: blockIndex++
      });
    }
  }

  const byLang = {};
  for (const block of codeBlocks) {
    if (!byLang[block.language]) byLang[block.language] = [];
    byLang[block.language].push(block);
  }

  const manifest = [];
  for (const [lang, blocks] of Object.entries(byLang)) {
    const langDir = path.join(CODE_DIR, lang);
    fs.mkdirSync(langDir, { recursive: true });

    for (const block of blocks) {
      const parts = block.guide.split('/').filter(Boolean);
      const guideSlug = parts[parts.length - 1];
      const categorySlug = parts[2] || 'general';
      const ext = {
        'bash': 'sh', 'shell': 'sh', 'sh': 'sh', 'zsh': 'sh',
        'javascript': 'js', 'js': 'js', 'typescript': 'ts', 'ts': 'ts',
        'python': 'py', 'py': 'py',
        'go': 'go', 'golang': 'go',
        'ruby': 'rb', 'rb': 'rb',
        'rust': 'rs', 'rs': 'rs',
        'java': 'java',
        'dockerfile': 'dockerfile', 'docker': 'dockerfile',
        'yaml': 'yml', 'yml': 'yml',
        'json': 'json',
        'sql': 'sql',
        'html': 'html',
        'css': 'css',
        'nginx': 'conf', 'apache': 'conf',
        'ini': 'ini', 'toml': 'toml',
        'powershell': 'ps1', 'ps': 'ps1',
        'elixir': 'ex', 'ex': 'ex',
        'erlang': 'erl', 'erl': 'erl',
        'c': 'c', 'cpp': 'cpp', 'c++': 'cpp',
      }[lang] || lang;

      const fileName = `${categorySlug}_${guideSlug}_${block.index}.${ext}`;
      const filePath = path.join(langDir, fileName);

      const header = `# Source: https://betterstack.com${block.guide}\n# Language: ${block.language}\n# Block index: ${block.index}\n\n`;
      fs.writeFileSync(filePath, header + block.code, 'utf-8');

      manifest.push({
        guide: block.guide,
        language: block.language,
        file: filePath.replace(CODE_DIR + '/', ''),
        size: block.code.length
      });
    }
  }

  fs.writeFileSync(
    path.join(CODE_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );

  console.log(`\nExtracted ${codeBlocks.length} code blocks across ${Object.keys(byLang).length} languages`);
  for (const [lang, blocks] of Object.entries(byLang)) {
    console.log(`  ${lang}: ${blocks.length} blocks`);
  }
  return codeBlocks.length;
}

async function main() {
  console.log('=== Better Stack Guides Scraper ===\n');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('Step 1: Discovering guides...');
  const { guides, categories } = await discoverGuides();
  console.log(`\nTotal guides found: ${guides.length} across ${categories.length} categories\n`);

  if (guides.length === 0) {
    console.log('No guides found. Exiting.');
    process.exit(1);
  }

  console.log('Step 2: Downloading markdown...');
  const downloaded = await downloadMarkdown(guides);
  console.log(`\nDownloaded: ${downloaded.length}/${guides.length}\n`);

  console.log('Step 3: Extracting code blocks...');
  const codeCount = await extractCode(downloaded);

  const index = {
    scrapedAt: new Date().toISOString(),
    source: 'https://betterstack.com/community/guides',
    totalGuides: guides.length,
    downloadedGuides: downloaded.length,
    categories: categories.map(c => ({ href: c.href, name: c.text })),
    codeBlocks: codeCount,
    guides: downloaded.map(g => ({
      href: g.href,
      title: g.text,
      category: g.category,
      file: g.filePath.replace(MARKDOWN_DIR + '/', '')
    }))
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf-8');

  const pkg = {
    name: '@innate/betterstack-guides',
    version: '0.1.0',
    private: true,
    description: 'Better Stack Community Guides - scraped and organized',
    scripts: {
      sync: 'node ../../scripts/discover-betterstack-guides.js'
    }
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8');

  const readme = `# Better Stack Community Guides

Scraped from https://betterstack.com/community/guides

## Categories

${categories.map(c => `- [${c.text}](${c.href})`).join('\n')}

## Structure

- \`guides/\` - Markdown content organized by category
- \`code/\` - Extracted code blocks organized by language
- \`index.json\` - Index of all guides

## Stats

- Guides: ${downloaded.length}
- Categories: ${categories.length}
- Code blocks: ${codeCount}
- Scraped: ${new Date().toISOString()}
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), readme, 'utf-8');

  console.log(`\n=== Done ===`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
