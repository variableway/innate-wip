# Source: https://betterstack.com/community/guides/scaling-nodejs/parcel-vs-vite/
# Original language: js
# Normalized: js
# Block index: 8

[label index.js]
import { createApp } from './app'

const app = createApp()
document.getElementById('app').appendChild(app)

// HMR interface
if (module.hot) {
  module.hot.accept('./app', function() {
    console.log('App updated')
    document.getElementById('app').removeChild(app)
    const newApp = createApp()
    document.getElementById('app').appendChild(newApp)
  })
}