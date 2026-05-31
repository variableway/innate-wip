# Source: https://betterstack.com/community/guides/scaling-nodejs/execa-cli/
# Original language: javascript
# Normalized: js
# Block index: 8

[label index.js]
import { execa } from 'execa';
[highlight]
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
[/highlight]

async function main() {
    try {
[highlight]
        const result = await execa('npm', ['list', '--depth=0'], {
            cwd: join(__dirname, '..'),
            env: {
                ...process.env,
                NODE_ENV: 'production',
                LOG_LEVEL: 'info'
            },
            timeout: 10000,
            shell: true
        });

        console.log('Command output:', result.stdout);
[/highlight]
    } catch (error) {
        console.error('Error:', error.message);
        // remove the other code
    }
}

main();