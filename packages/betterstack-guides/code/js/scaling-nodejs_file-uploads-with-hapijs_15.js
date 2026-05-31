# Source: https://betterstack.com/community/guides/scaling-nodejs/file-uploads-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 15

[label server.js]
// ... existing imports and setup

[highlight]
server.route({
    method: 'POST',
    path: '/upload/multiple',
    options: {
        payload: {
            output: 'stream',
            parse: true,
            multipart: true,
            maxBytes: 100 * 1024 * 1024  // 100MB for multiple files
        }
    },
    handler: async (request, h) => {
        const { files } = request.payload;
        
        if (!files) {
            throw Boom.badRequest('No files provided');
        }
        
        // Handle both single file and array
        const fileArray = Array.isArray(files) ? files : [files];
        
        if (fileArray.length > 10) {
            throw Boom.badRequest('Too many files. Maximum 10 files allowed');
        }
        
        const results = [];
        
        for (const file of fileArray) {
            // Validate each file
            const validation = fileValidator.validateFile(file, file.hapi.filename);
            
            if (!validation.valid) {
                results.push({
                    filename: file.hapi.filename,
                    success: false,
                    errors: validation.errors
                });
                continue;
            }
            
            // Save valid files
            const fileExt = path.extname(file.hapi.filename);
            const uniqueFilename = `${uuidv4()}${fileExt}`;
            const filePath = path.join(UPLOAD_DIR, uniqueFilename);
            
            try {
                await new Promise((resolve, reject) => {
                    const fileStream = fsSync.createWriteStream(filePath);
                    
                    file.on('error', (err) => reject(err));
                    fileStream.on('error', (err) => reject(err));
                    fileStream.on('finish', () => resolve());
                    
                    file.pipe(fileStream);
                });
                
                results.push({
                    filename: file.hapi.filename,
                    storedFilename: uniqueFilename,
                    success: true,
                    location: filePath
                });
            } catch (error) {
                results.push({
                    filename: file.hapi.filename,
                    success: false,
                    errors: [`Failed to save: ${error.message}`]
                });
            }
        }
        
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        return {
            totalFiles: fileArray.length,
            successful: successful.length,
            failed: failed.length,
            uploadTime: new Date().toISOString(),
            results: results
        };
    }
});
[/highlight]

// ... rest of existing routes
server.route({
  method: "GET",
  path: "/",
...
})
...