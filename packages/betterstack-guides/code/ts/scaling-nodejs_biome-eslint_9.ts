# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 9

export default [
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error'
    }
  }
];