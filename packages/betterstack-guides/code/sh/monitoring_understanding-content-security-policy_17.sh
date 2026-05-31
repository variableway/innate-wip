# Source: https://betterstack.com/community/guides/monitoring/understanding-content-security-policy/
# Original language: command
# Normalized: sh
# Block index: 17

echo -n "console.log('This inline script is allowed');" | openssl dgst -sha256 -binary | openssl base64