# Source: https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 12

module.exports = {
  "rules": {
    // Disable requiring semicolons
    "semi": ["error", "never"],
    
    // Require single quotes with some exceptions
    "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
    
    // Customize indentation
    "indent": ["error", 2, { 
      "SwitchCase": 1,
      "VariableDeclarator": 1,
      "outerIIFEBody": 1
    }],
    
    // Disallow unused variables but allow unused arguments prefixed with _
    "no-unused-vars": ["error", { 
      "vars": "all", 
      "args": "after-used",
      "argsIgnorePattern": "^_" 
    }],
    
    // Custom rule for React Hook dependencies
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useAnotherCustomHook)"
    }]
  }
}