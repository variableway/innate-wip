# Source: https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 28

[label settings.json]
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.run": "onType", // or "onSave"
  "eslint.lintTask.enable": true,
  "eslint.lintTask.options": "src/"
}