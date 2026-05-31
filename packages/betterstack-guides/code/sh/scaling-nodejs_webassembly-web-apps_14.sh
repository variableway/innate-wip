# Source: https://betterstack.com/community/guides/scaling-nodejs/webassembly-web-apps/
# Original language: command
# Normalized: sh
# Block index: 14

emcc math_operations.cpp -o math_operations.js -s WASM=1 -s EXPORTED_FUNCTIONS="['_fibonacci_iterative','_prime_count']" -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']"