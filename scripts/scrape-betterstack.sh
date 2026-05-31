#!/bin/bash
set -e

BASE_URL="https://betterstack.com"
OUTPUT_DIR="$(dirname "$0")/../packages/betterstack-guides"
MARKDOWN_DIR="$OUTPUT_DIR/guides"
CODE_DIR="$OUTPUT_DIR/code"

mkdir -p "$MARKDOWN_DIR" "$CODE_DIR"

echo "=== Better Stack Guides Scraper ==="
echo ""

# Step 1: Discover guides
echo "Step 1: Discovering guides..."
HTML=$(curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" "$BASE_URL/community/guides")

# Extract categories
CATEGORIES=$(echo "$HTML" | grep -oE "href='/community/guides/[^/]+/'" | sed "s/href='//g; s/'$//g" | sort -u)
CAT_COUNT=$(echo "$CATEGORIES" | wc -l | tr -d ' ')
echo "  Found $CAT_COUNT categories"

# Save all discovered guide URLs
GUIDES_FILE="/tmp/betterstack_guides.txt"
> "$GUIDES_FILE"

# Get guides from main page
echo "$HTML" | grep -oE "href='/community/guides/[^']+'" | sed "s/href='//g; s/'$//g" | grep -v '?utm_' | while read -r href; do
  parts=$(echo "$href" | tr '/' ' ' | wc -w)
  if [ "$parts" -gt 3 ]; then
    echo "$href" >> "$GUIDES_FILE"
  fi
done

# Get guides from each category page
for cat in $CATEGORIES; do
  echo "  Exploring $cat..."
  CAT_HTML=$(curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" "$BASE_URL$cat")
  echo "$CAT_HTML" | grep -oE "href='/community/guides/[^']+'" | sed "s/href='//g; s/'$//g" | grep -v '?utm_' | while read -r href; do
    parts=$(echo "$href" | tr '/' ' ' | wc -w)
    if [ "$parts" -gt 3 ]; then
      echo "$href" >> "$GUIDES_FILE"
    fi
  done
  sleep 0.5
done

# Deduplicate
UNIQUE_GUIDES=$(sort -u "$GUIDES_FILE")
GUIDE_COUNT=$(echo "$UNIQUE_GUIDES" | wc -l | tr -d ' ')
echo ""
echo "Total unique guides: $GUIDE_COUNT"
echo ""

# Step 2: Download markdown
echo "Step 2: Downloading markdown..."
DOWNLOADED=0
for href in $UNIQUE_GUIDES; do
  slug=$(echo "$href" | awk -F'/' '{print $NF}')
  [ -z "$slug" ] && slug="index"
  category=$(echo "$href" | awk -F'/' '{print $4}')
  [ -z "$category" ] && category="general"

  mkdir -p "$MARKDOWN_DIR/$category"
  outfile="$MARKDOWN_DIR/$category/$slug.md"

  if [ -f "$outfile" ] && [ "$(wc -c < "$outfile" | tr -d ' ')" -gt 300 ]; then
    DOWNLOADED=$((DOWNLOADED + 1))
    echo "  [$DOWNLOADED/$GUIDE_COUNT] SKIP $href (already exists)"
  else
    if curl -sL -A "Mozilla/5.0" "$BASE_URL$href.md" > "$outfile" 2>/dev/null; then
      size=$(wc -c < "$outfile" | tr -d ' ')
      if [ "$size" -gt 300 ]; then
        DOWNLOADED=$((DOWNLOADED + 1))
        echo "  [$DOWNLOADED/$GUIDE_COUNT] OK $href ($size chars)"
      else
        rm "$outfile"
        echo "  SKIP $href: too short ($size)"
      fi
    else
      echo "  ERROR $href"
    fi
  fi
  sleep 0.2
done

echo ""
echo "Downloaded: $DOWNLOADED/$GUIDE_COUNT"
echo ""

# Step 3: Extract code blocks
echo "Step 3: Extracting code blocks..."

# Create a Node.js script for code extraction
cat > /tmp/extract-code.js << 'EOF'
const fs = require('fs');
const path = require('path');

const CODE_DIR = process.argv[2];
const MARKDOWN_DIR = process.argv[3];

const extMap = {
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
};

const codeBlocks = [];
const guidesDir = fs.readdirSync(MARKDOWN_DIR);

for (const cat of guidesDir) {
  const catPath = path.join(MARKDOWN_DIR, cat);
  if (!fs.statSync(catPath).isDirectory()) continue;

  const files = fs.readdirSync(catPath);
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = fs.readFileSync(path.join(catPath, file), 'utf-8');
    const guideSlug = file.replace('.md', '');
    const guideHref = `/community/guides/${cat}/${guideSlug}/`;

    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let idx = 0;
    while ((match = regex.exec(content)) !== null) {
      const lang = (match[1] || 'txt').toLowerCase();
      const code = match[2].trim();
      if (code.length < 20) continue;
      codeBlocks.push({ guide: guideHref, language: lang, code, index: idx++, category: cat, slug: guideSlug });
    }
  }
}

// Group by language
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
    const ext = extMap[block.language] || block.language;
    const fileName = `${block.category}_${block.slug}_${block.index}.${ext}`;
    const filePath = path.join(langDir, fileName);
    const header = `# Source: https://betterstack.com${block.guide}\n# Language: ${block.language}\n# Block index: ${block.index}\n\n`;
    fs.writeFileSync(filePath, header + block.code, 'utf-8');
    manifest.push({ guide: block.guide, language: block.language, file: path.join(lang, fileName), size: block.code.length });
  }
}

fs.writeFileSync(path.join(CODE_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`Extracted ${codeBlocks.length} code blocks across ${Object.keys(byLang).length} languages`);
for (const [lang, blocks] of Object.entries(byLang)) {
  console.log(`  ${lang}: ${blocks.length} blocks`);
}
EOF

node /tmp/extract-code.js "$CODE_DIR" "$MARKDOWN_DIR"

echo ""
echo "=== Done ==="
echo "Output: $OUTPUT_DIR"
echo "  Guides: $MARKDOWN_DIR"
echo "  Code: $CODE_DIR"
