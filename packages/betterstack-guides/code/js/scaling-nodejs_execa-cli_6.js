# Source: https://betterstack.com/community/guides/scaling-nodejs/execa-cli/
# Original language: javascript
# Normalized: js
# Block index: 6

[label index.js]
import { execa } from 'execa';

async function main() {
    try {
[highlight]
        // Try to run a command that doesn't exist
        await execa('nonexistentcommand');
[/highlight]
    } catch (error) {
        console.error('Error message:', error.message);
[highlight]
        console.error('Command:', error.command);
        console.error('Exit code:', error.exitCode);
        console.error('Error output:', error.stderr);
[/highlight]
    }
}

main();