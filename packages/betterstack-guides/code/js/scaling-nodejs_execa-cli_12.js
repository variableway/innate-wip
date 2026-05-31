# Source: https://betterstack.com/community/guides/scaling-nodejs/execa-cli/
# Original language: javascript
# Normalized: js
# Block index: 12

[label index.js]
import { execa } from 'execa';

async function main() {
[highlight]
    console.log('DEMO: Processing output chunks');
    
    // Start command but don't wait for it yet
    const findProcess = execa('find', ['.', '-name', '*.js']);
    
    // Handle output as it arrives
    findProcess.stdout.on('data', (data) => {
        // Process each chunk of output
        const filename = data.toString().trim();
        console.log(`Found JavaScript file: ${filename}`);
    });
[/highlight]
    try {
[highlight]
        // Wait for command to complete
        await findProcess;
        console.log('Find command completed');
[/highlight]
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();