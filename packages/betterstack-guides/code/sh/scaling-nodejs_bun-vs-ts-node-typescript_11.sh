# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 11

# ts-node TypeScript setup
npm install --save-dev typescript ts-node @types/node

# Thoughtful tsconfig.json configuration:
{
  "ts-node": {
    "transpileOnly": true,    # Skip type checking for speed
    "files": true,           # Include all project files
    "compilerOptions": {
      "target": "es2020",    # Control output target
      "module": "commonjs",  # Module system selection
      "esModuleInterop": true # Import compatibility
    }
  }
}