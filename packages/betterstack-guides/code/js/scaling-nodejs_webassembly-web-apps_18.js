# Source: https://betterstack.com/community/guides/scaling-nodejs/webassembly-web-apps/
# Original language: javascript
# Normalized: js
# Block index: 18

[label index.js]
[highlight]
let wasmModule;

async function loadWasmModule() {
    const script = document.createElement('script');
    script.src = './math_operations.js';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
        script.onload = () => {
            Module.onRuntimeInitialized = () => {
                wasmModule = {
                    fibonacci: Module.cwrap('fibonacci_iterative', 'number', ['number']),
                    primeCount: Module.cwrap('prime_count', 'number', ['number'])
                };
                resolve();
            };
        };
    });
}

// JavaScript equivalents for comparison
const jsImplementations = {
    fibonacci: (n) => {
        if (n <= 1) return n;
        let prev = 0, curr = 1;
        for (let i = 2; i <= n; i++) {
            const next = prev + curr;
            prev = curr;
            curr = next;
        }
        return curr;
    },
    
    primeCount: (limit) => {
        if (limit < 2) return 0;
        let count = 0;
        for (let num = 2; num <= limit; num++) {
            let isPrime = true;
            for (let i = 2; i * i <= num; i++) {
                if (num % i === 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) count++;
        }
        return count;
    }
};

// Performance comparison function
async function comparePerformance() {
    await loadWasmModule();
    
    const testCases = [
        { name: 'Fibonacci(35)', js: () => jsImplementations.fibonacci(35), wasm: () => wasmModule.fibonacci(35) },
        { name: 'Prime Count(5000)', js: () => jsImplementations.primeCount(5000), wasm: () => wasmModule.primeCount(5000) }
    ];
    
    testCases.forEach(test => {
        const jsTime = performanceTest.measureTime(`${test.name} (JS)`, test.js);
        const wasmTime = performanceTest.measureTime(`${test.name} (WASM)`, test.wasm);
        const improvement = (jsTime / wasmTime).toFixed(2);
        
        console.log(`${test.name}: ${improvement}x improvement with WebAssembly`);
        performanceTest.displayResults(jsTime, wasmTime, improvement);
    });
}

// Run comparison when page loads
document.addEventListener('DOMContentLoaded', comparePerformance);
[/highlight]

const performanceTest = {
    measureTime: (name, fn) => {
        ...
    },
    
    displayResults: (jsTime, wasmTime, improvement) => {
        ...
    }
};