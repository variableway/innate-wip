# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-ts-node/
# Original language: bash
# Normalized: sh
# Block index: 9

# ts-node established testing patterns
jest --preset ts-jest                    # Built-in Jest integration
mocha -r ts-node/register 'test/**/*.ts' # Native Mocha support
ava --require ts-node/register           # Official AVA integration