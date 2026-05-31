# Source: https://betterstack.com/community/guides/scaling-nodejs/file-uploads-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 10

[label validators.js]
import path from 'path';

export class FileValidator {
    constructor(maxSize = 15 * 1024 * 1024) {  // 15MB default
        this.maxSize = maxSize;
        this.allowedExtensions = ['.pdf', '.txt', '.json'];
    }
    
    validateFile(file, filename) {
        const errors = [];
        
        // Check if file exists
        if (!filename || filename.trim() === '') {
            errors.push('No file selected');
            return { valid: false, errors };
        }
        
        // Check file extension
        const fileExt = path.extname(filename).toLowerCase();
        if (!this.allowedExtensions.includes(fileExt)) {
            errors.push(
                `File extension '${fileExt}' not allowed. Use: .pdf, .txt, or .json`
            );
        }
        
        // Check file size
        const fileSize = parseInt(file.hapi.headers['content-length']) || 0;
        if (fileSize > this.maxSize) {
            errors.push(
                `File too large (${fileSize} bytes). Maximum: ${this.maxSize} bytes`
            );
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}