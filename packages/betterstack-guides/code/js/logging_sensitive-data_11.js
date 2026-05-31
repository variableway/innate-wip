# Source: https://betterstack.com/community/guides/logging/sensitive-data/
# Original language: javascript
# Normalized: js
# Block index: 11

function generateToken() {
  const tokenLength = 10;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}