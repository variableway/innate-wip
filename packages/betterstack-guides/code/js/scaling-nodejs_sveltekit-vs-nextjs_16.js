# Source: https://betterstack.com/community/guides/scaling-nodejs/sveltekit-vs-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 16

// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
// or '@sveltejs/adapter-netlify'
// or '@sveltejs/adapter-node'
// or '@sveltejs/adapter-static'

export default {
  kit: {
    adapter: adapter()
  }
};