# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-file-uploads/
# Original language: javascript
# Normalized: js
# Block index: 20

[label server.js]
fastify.post("/upload/single", async (request, reply) => {
 ...
});
// Add this endpoint after your existing single upload endpoint

[highlight]
fastify.post('/upload/multiple', async (request, reply) => {
  const parts = request.parts();
  const results = [];
  const maxFiles = 10;
  let fileCount = 0;
  
  for await (const part of parts) {
    if (part.file) {
      fileCount++;
      
      // Check file limit
      if (fileCount > maxFiles) {
        return reply.code(400).send({
          error: `Too many files. Maximum ${maxFiles} files allowed.`
        });
      }
      
      // Validate each file
      const validation = validator.validateFile(part.filename);
      
      if (!validation.valid) {
        results.push({
          filename: part.filename,
          success: false,
          errors: validation.errors
        });
        continue;
      }
      
      // Save valid files
      const ext = part.filename.substring(part.filename.lastIndexOf('.'));
      const uniqueFilename = `${randomUUID()}${ext}`;
      const filepath = path.join(uploadsDir, uniqueFilename);
      
      try {
        await pipeline(part.file, createWriteStream(filepath));
        
        results.push({
          originalFilename: part.filename,
          storedFilename: uniqueFilename,
          success: true,
          path: filepath
        });
      } catch (error) {
        fastify.log.error(error);
        results.push({
          filename: part.filename,
          success: false,
          errors: ['Failed to save file']
        });
      }
    }
  }
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  return {
    totalFiles: results.length,
    successful: successful.length,
    failed: failed.length,
    uploadTime: new Date().toISOString(),
    results: results
  };
});
[/highlight]
const start = async () => {
  ...
};