# Source: https://betterstack.com/community/guides/scaling-nodejs/execa-cli/
# Original language: javascript
# Normalized: js
# Block index: 10

[label index.js]
import { execa } from 'execa';
// remove the other imports

async function main() {
[highlight]
    // Method 1: Direct terminal piping
    console.log('DEMO: Direct terminal output:');
[/highlight]
    
    try {
[highlight]
        // Connect child process directly to your terminal
        await execa('npm', ['list'], {
            stdio: 'inherit'  // Connect directly to terminal
        });
        
        console.log('Command completed');
[/highlight]
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();