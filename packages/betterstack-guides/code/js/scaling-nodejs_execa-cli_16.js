# Source: https://betterstack.com/community/guides/scaling-nodejs/execa-cli/
# Original language: javascript
# Normalized: js
# Block index: 16

[label setup.js]
import { execaSync } from 'execa';
import fs from 'fs';

// Project initialization script
console.log('Setting up project...');

function setupProject() {
    try {
        // Check if git is clean
        const gitStatus = execaSync('git', ['status', '--porcelain']);
        
        if (gitStatus.stdout) {
            console.error('Git working directory not clean.');
            return false;
        }
        
        console.log('Git working directory clean');
        
        // Install dependencies
        console.log('Installing dependencies...');
        execaSync('npm', ['install'], { stdio: 'inherit' });
        
        // Create folders
        const directories = ['src', 'tests', 'config'];
        directories.forEach(dir => {
            if (!fs.existsSync(dir)) {
                console.log(`Creating ${dir} directory...`);
                fs.mkdirSync(dir);
            }
        });
        
        console.log('✨ Project setup complete!');
        return true;
    } catch (error) {
        console.error('Setup failed:', error.message);
        return false;
    }
}

// Run the setup
const setupSucceeded = setupProject();
process.exit(setupSucceeded ? 0 : 1);