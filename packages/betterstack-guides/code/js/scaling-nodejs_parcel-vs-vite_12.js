# Source: https://betterstack.com/community/guides/scaling-nodejs/parcel-vs-vite/
# Original language: js
# Normalized: js
# Block index: 12

// Example of code Parcel will automatically optimize
import { someFunction } from './utils'
import unusedModule from './unused'

// Tree-shaking will remove unusedModule
export function main() {
  return someFunction()
}