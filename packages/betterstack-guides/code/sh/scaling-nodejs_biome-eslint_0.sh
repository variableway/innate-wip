# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: bash
# Normalized: sh
# Block index: 0

# Install Biome
npm install --save-dev @biomejs/biome

# Initialize configuration
npx @biome/biome init

# This creates biome.json with defaults:
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": []
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}