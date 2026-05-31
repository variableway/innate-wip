# Source: https://betterstack.com/community/guides/scaling-nodejs/vite-vs-webpack/
# Original language: javascript
# Normalized: js
# Block index: 6

// Importing assets in Vite
import logo from './assets/logo.png'
import styles from './styles.css'

// Usage
const App = () => (
  <div className={styles.app}>
    <img src={logo} alt="Logo" />
  </div>
)