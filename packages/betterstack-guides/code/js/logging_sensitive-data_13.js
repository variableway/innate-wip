# Source: https://betterstack.com/community/guides/logging/sensitive-data/
# Original language: javascript
# Normalized: js
# Block index: 13

const logData = {
  message: "A payment has been made.",
  credit_card: "1234-5678-9876-5432",
};

logger.info({ logData });