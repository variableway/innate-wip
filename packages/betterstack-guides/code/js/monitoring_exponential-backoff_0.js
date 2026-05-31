# Source: https://betterstack.com/community/guides/monitoring/exponential-backoff/
# Original language: javascript
# Normalized: js
# Block index: 0

async function retryOperation(operation, maxRetries) {
 let retries = 0;

 while (retries <= maxRetries) {
   try {
     return await operation();
   } catch (error) {
     if (retries >= maxRetries) {
       throw error; // Rethrow if we've exhausted retries
     }

     console.log(`Operation failed, retrying (${retries + 1}/${maxRetries})...`);
     retries++;

     // We'll add a delay strategy here later
   }
 }
}