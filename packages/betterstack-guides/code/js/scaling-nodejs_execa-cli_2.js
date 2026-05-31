# Source: https://betterstack.com/community/guides/scaling-nodejs/execa-cli/
# Original language: javascript
# Normalized: js
# Block index: 2

[label index.js]
import { execa } from 'execa';

async function main() {
    try {
        const { stdout } = await execa('echo', ['Hello, world!']);
        console.log(stdout);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();