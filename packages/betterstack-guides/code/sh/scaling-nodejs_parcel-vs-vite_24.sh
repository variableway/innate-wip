# Source: https://betterstack.com/community/guides/scaling-nodejs/parcel-vs-vite/
# Original language: bash
# Normalized: sh
# Block index: 24

# Simple Parcel workflow
mkdir new-project && cd new-project
npm init -y
npm install --save-dev parcel
npm install react react-dom

# Create basic files
echo '<div id="app"></div><script src="./index.js"></script>' > index.html

# Create React entry point
cat > index.js << EOF
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => <h1>Hello Parcel</h1>;
const root = createRoot(document.getElementById('app'));
root.render(<App />);
EOF

# Add script to package.json
# "scripts": { "start": "parcel index.html" }

# Start development
npm start