# Source: https://betterstack.com/community/guides/logging/sensitive-data/
# Original language: javascript
# Normalized: js
# Block index: 12

const logger = pino({
  serializers: {
    logData: (data) => {
      const tokenizedData = { ...data };
      const fieldsToTokenize = ["credit_card"]; // Specify what fields to tokenize
      for (const field of fieldsToTokenize) {
        if (data[field]) {
          tokenizedData[field] = generateToken(); // Replace field value with a token
          saveToken(token, data[field]); // Save the token/data pair in a data vault
        }
      }
      return tokenizedData;
    },
  },
});

function generateToken() {
  . . .
}

function saveToken(token, data) {
  . . .
}