# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-file-uploads/
# Original language: javascript
# Normalized: js
# Block index: 14

[label validators.js]
export class FileValidator {
  constructor() {
    this.allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.txt'];
  }

  validateFile(filename) {
    const result = { valid: true, errors: [] };
    
    // Check filename exists
    if (!filename || filename.trim() === '') {
      result.valid = false;
      result.errors.push('No filename provided');
      return result;
    }
    
    // Check file extension
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    if (!this.allowedExtensions.includes(ext)) {
      result.valid = false;
      result.errors.push(`File extension '${ext}' not allowed. Allowed: ${this.allowedExtensions.join(', ')}`);
    }
    
    return result;
  }
}