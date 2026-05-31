# Source: https://betterstack.com/community/guides/scaling-nodejs/parcel-vs-vite/
# Original language: js
# Normalized: js
# Block index: 18

// Explicit imports in Vite
import styles from './style.css' // CSS modules
import sassStyles from './style.scss' // requires sass plugin
import logoUrl from './logo.svg' // returns a URL
import logoComponent from './logo.svg?component' // as Vue component
import workers from './worker?worker' // Web Worker