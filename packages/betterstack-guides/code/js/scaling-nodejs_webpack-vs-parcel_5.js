# Source: https://betterstack.com/community/guides/scaling-nodejs/webpack-vs-parcel/
# Original language: javascript
# Normalized: js
# Block index: 5

[label src/App.jsx]
import './styles.scss';
import logo from './logo.png';
import { ReactComponent as Icon } from './icon.svg';

function App() {
  return (
    <div className="app">
      <img src={logo} alt="Logo" />
      <Icon />
    </div>
  );
}