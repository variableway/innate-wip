# Source: https://betterstack.com/community/guides/scaling-nodejs/execa-cli/
# Original language: javascript
# Normalized: js
# Block index: 4

[label index.js]
import { execa } from 'execa';

async function main() {
    try {
[highlight]
        const result = await execa('ls', ['-la']);
        
        // Examine the comprehensive result object
        console.log('Command:', result.command);
        console.log('Exit code:', result.exitCode);
        console.log('Output:', result.stdout);
        console.log('Error output:', result.stderr);
[/highlight]
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();