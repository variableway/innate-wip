# Source: https://betterstack.com/community/guides/scaling-nodejs/vite-vs-webpack/
# Original language: javascript
# Normalized: js
# Block index: 7

// Importing assets in Webpack
import logo from './assets/logo.png'
import './styles.css'

// Usage
const App = () => (
  <div className="app">
    <img src={logo} alt="Logo" />
  </div>
)