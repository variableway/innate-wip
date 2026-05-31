# Source: https://betterstack.com/community/guides/scaling-nodejs/webassembly-web-apps/
# Original language: javascript
# Normalized: js
# Block index: 5

[label index.js]
const performanceTest = {
    measureTime: (name, fn) => {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name}: ${end - start}ms`);
        return result;
    },
    
    displayResults: (jsTime, wasmTime, improvement) => {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <h3>Performance Results</h3>
            <p>JavaScript: ${jsTime}ms</p>
            <p>WebAssembly: ${wasmTime}ms</p>
            <p>Improvement: ${improvement}x faster</p>
        `;
    }
};

console.log('WebAssembly performance testing environment ready');