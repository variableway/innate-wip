# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-explained/
# Original language: javascript
# Normalized: js
# Block index: 14

[label package.json]
{
  ..
  },
  "devDependencies": {
    ...
  },
[highlight]
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "oxlint"
  }
[/highlight]
}