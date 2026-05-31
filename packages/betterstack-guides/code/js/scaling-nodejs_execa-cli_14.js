# Source: https://betterstack.com/community/guides/scaling-nodejs/execa-cli/
# Original language: javascript
# Normalized: js
# Block index: 14

[label index.js]
import { execa } from 'execa';

async function main() {
    // remove the other code
    try {
[highlight]
        // Find all files in current directory
        const { stdout: allFiles } = await execa('find', ['.', '-type', 'f']);
        
        // Use JavaScript to filter for JS files
        const jsFiles = allFiles
            .split('\n')
            .filter(file => file.endsWith('.js'))
            .join('\n');
        
        // Count lines in those JS files
        const { stdout: lineCount } = await execa('wc', ['-l'], {
            input: jsFiles  // Pass filtered list as input to next command
        });
        
        console.log(`Found ${jsFiles.split('\n').length} JavaScript files`);
        console.log(`Total lines of code: ${lineCount.trim()}`);
[/highlight]
    } catch (error) {
        console.error('Pipeline error:', error.message);
    }
}

main();