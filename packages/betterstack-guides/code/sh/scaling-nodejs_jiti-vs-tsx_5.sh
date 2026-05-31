# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 5

# Jiti needs external test runners
jest --transform jiti/transformer
# Or manual configuration with other frameworks