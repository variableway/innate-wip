# Source: https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 35

// In a custom plugin file
module.exports = {
  rules: {
    "my-custom-rule": {
      create: function(context) {
        return {
          Identifier: function(node) {
            if (node.name === "badIdentifier") {
              context.report({
                node,
                message: "Avoid using 'badIdentifier' as a variable name"
              });
            }
          }
        };
      }
    }
  }
};