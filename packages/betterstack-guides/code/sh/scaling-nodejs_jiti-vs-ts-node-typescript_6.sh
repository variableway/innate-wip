# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 6

# Jest integration (built-in preset)
npm install --save-dev ts-jest
# jest.config.js: preset: 'ts-jest'

# Mocha integration (established pattern)
mocha -r ts-node/register 'test/**/*.ts'

# AVA integration (official support)
# ava.config.js: extensions: ['ts'], require: ['ts-node/register']