# Source: https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 34

module.exports = {
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors"
  ],
  "rules": {
    "react/prop-types": "off",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always"
    }]
  }
}