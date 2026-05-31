# Source: https://betterstack.com/community/guides/scaling-nodejs/sveltekit-vs-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 6

// stores.js - Reactive stores included
import { writable, derived } from 'svelte/store';

export const user = writable(null);
export const isLoggedIn = derived(user, $user => !!$user);

// Use anywhere in your app
import { user, isLoggedIn } from './stores.js';

// Automatic reactivity
$: if ($isLoggedIn) {
  loadUserData();
}