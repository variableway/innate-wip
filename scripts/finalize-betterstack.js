const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'packages', 'betterstack-guides');
const MARKDOWN_DIR = path.join(OUTPUT_DIR, 'guides');
const CODE_DIR = path.join(OUTPUT_DIR, 'code');

// Language normalization map
const LANG_NORMALIZE = {
  'bash': 'sh', 'shell': 'sh', 'zsh': 'sh',
  'javascript': 'js',
  'typescript': 'ts',
  'yml': 'yaml',
  'comamnd': 'sh',
  'command': 'sh',
  'common': 'sh',
  'output': 'txt',
  'text': 'txt',
  'zero': 'txt',
  'log': 'txt',
  'jsonc': 'json',
  'gemfile': 'ruby',
  'prisma': 'js',
  'promql': 'js',
  'properties': 'ini',
  'proto': 'protobuf',
  'pug': 'html',
  'scss': 'css',
  'svelte': 'html',
  'vue': 'html',
  'xml': 'html',
  'jsx': 'js',
  'tsx': 'ts',
  'graphql': 'js',
  'hcl': 'terraform',
  'dart': 'js',
  'csharp': 'cs',
  'nginx': 'conf',
  'apache': 'conf',
};

const EXT_MAP = {
  'sh': 'sh', 'js': 'js', 'ts': 'ts', 'py': 'py', 'go': 'go',
  'rb': 'rb', 'rs': 'rs', 'java': 'java', 'dockerfile': 'dockerfile',
  'yaml': 'yaml', 'json': 'json', 'sql': 'sql', 'html': 'html',
  'css': 'css', 'conf': 'conf', 'ini': 'ini', 'toml': 'toml',
  'ps1': 'ps1', 'ex': 'ex', 'erl': 'erl', 'c': 'c', 'cpp': 'cpp',
  'cs': 'cs', 'php': 'php', 'terraform': 'tf', 'protobuf': 'proto',
  'txt': 'txt', 'python': 'py', 'ruby': 'rb',
};

function normalizeLang(lang) {
  return LANG_NORMALIZE[lang] || lang;
}

function getExt(lang) {
  return EXT_MAP[lang] || lang;
}

// Step 1: Scan all guides
console.log('Scanning guides...');
const guides = [];
const categories = new Map();

for (const cat of fs.readdirSync(MARKDOWN_DIR)) {
  const catPath = path.join(MARKDOWN_DIR, cat);
  if (!fs.statSync(catPath).isDirectory()) continue;

  categories.set(cat, cat);

  for (const file of fs.readdirSync(catPath)) {
    if (!file.endsWith('.md')) continue;
    const filePath = path.join(catPath, file);
    const stat = fs.statSync(filePath);
    const slug = file.replace('.md', '');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract title from markdown
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : slug;

    guides.push({
      href: `/community/guides/${cat}/${slug}/`,
      title,
      category: cat,
      file: `${cat}/${file}`,
      size: stat.size,
    });
  }
}

console.log(`  Found ${guides.length} guides in ${categories.size} categories`);

// Step 2: Extract and normalize code blocks
console.log('\nExtracting code blocks...');

// Clear old code dir
if (fs.existsSync(CODE_DIR)) {
  fs.rmSync(CODE_DIR, { recursive: true });
}
fs.mkdirSync(CODE_DIR, { recursive: true });

const codeBlocks = [];

for (const guide of guides) {
  const filePath = path.join(MARKDOWN_DIR, guide.file);
  const content = fs.readFileSync(filePath, 'utf-8');

  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  let idx = 0;

  while ((match = regex.exec(content)) !== null) {
    const rawLang = (match[1] || 'txt').toLowerCase();
    const lang = normalizeLang(rawLang);
    const code = match[2].trim();
    if (code.length < 20) continue;

    codeBlocks.push({
      guide: guide.href,
      rawLanguage: rawLang,
      language: lang,
      code,
      index: idx++,
      category: guide.category,
      slug: guide.file.replace('.md', '').split('/').pop(),
    });
  }
}

// Group by normalized language
const byLang = {};
for (const block of codeBlocks) {
  if (!byLang[block.language]) byLang[block.language] = [];
  byLang[block.language].push(block);
}

// Write organized code files
const manifest = [];
for (const [lang, blocks] of Object.entries(byLang)) {
  const langDir = path.join(CODE_DIR, lang);
  fs.mkdirSync(langDir, { recursive: true });

  for (const block of blocks) {
    const ext = getExt(block.language);
    const fileName = `${block.category}_${block.slug}_${block.index}.${ext}`;
    const filePath = path.join(langDir, fileName);

    const header = `# Source: https://betterstack.com${block.guide}\n# Original language: ${block.rawLanguage}\n# Normalized: ${block.language}\n# Block index: ${block.index}\n\n`;
    fs.writeFileSync(filePath, header + block.code, 'utf-8');

    manifest.push({
      guide: block.guide,
      originalLanguage: block.rawLanguage,
      language: block.language,
      file: path.join(lang, fileName),
      size: block.code.length,
    });
  }
}

fs.writeFileSync(
  path.join(CODE_DIR, 'manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf-8'
);

console.log(`  Extracted ${codeBlocks.length} code blocks across ${Object.keys(byLang).length} languages`);
for (const [lang, blocks] of Object.entries(byLang).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`    ${lang}: ${blocks.length}`);
}

// Step 3: Write index.json
const index = {
  scrapedAt: new Date().toISOString(),
  source: 'https://betterstack.com/community/guides',
  totalGuides: guides.length,
  downloadedGuides: guides.length,
  categories: Array.from(categories.keys()).map(c => ({ name: c, slug: c })),
  codeBlocks: codeBlocks.length,
  languages: Object.keys(byLang).sort(),
  guides: guides.map(g => ({
    href: g.href,
    title: g.title,
    category: g.category,
    file: g.file,
    size: g.size,
  })),
};
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf-8');

// Step 4: Write README
const readme = `# Better Stack Community Guides

Scraped from https://betterstack.com/community/guides

## Categories

${Array.from(categories.keys()).sort().map(c => `- **${c}**`).join('\n')}

## Structure

- \`guides/\` - Markdown content organized by category (${guides.length} guides)
- \`code/\` - Extracted code blocks organized by language (${codeBlocks.length} blocks)
- \`index.json\` - Index of all guides

## Languages

${Object.entries(byLang).sort((a, b) => b[1].length - a[1].length).map(([lang, blocks]) => `- ${lang}: ${blocks.length} blocks`).join('\n')}

## Stats

- **Guides**: ${guides.length}
- **Categories**: ${categories.size}
- **Code blocks**: ${codeBlocks.length}
- **Languages**: ${Object.keys(byLang).length}
- **Scraped**: ${new Date().toISOString()}
`;
fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), readme, 'utf-8');

// Step 5: Write package.json
const pkg = {
  name: '@innate/betterstack-guides',
  version: '0.1.0',
  private: true,
  description: 'Better Stack Community Guides - scraped and organized',
  scripts: {
    sync: 'bash ../../scripts/scrape-betterstack.sh',
    finalize: 'node ../../scripts/finalize-betterstack.js',
  },
};
fs.writeFileSync(path.join(OUTPUT_DIR, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8');

console.log('\n=== Done ===');
console.log(`Output: ${OUTPUT_DIR}`);
console.log(`  Guides: ${guides.length}`);
console.log(`  Code blocks: ${codeBlocks.length}`);
console.log(`  Languages: ${Object.keys(byLang).length}`);
