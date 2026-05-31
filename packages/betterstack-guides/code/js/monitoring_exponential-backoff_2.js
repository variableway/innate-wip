# Source: https://betterstack.com/community/guides/monitoring/exponential-backoff/
# Original language: javascript
# Normalized: js
# Block index: 2

function calculateExponentialBackoff(retry, initialDelay, factor) {
 return initialDelay * Math.pow(factor, retry);
}

async function retryWithExponentialBackoff(operation, maxRetries, initialDelay = 1000, factor = 2) {
 let retries = 0;

 while (retries <= maxRetries) {
   try {
     return await operation();
   } catch (error) {
     if (retries >= maxRetries) {
       throw error; // Rethrow if we've exhausted retries
     }

     const delay = calculateExponentialBackoff(retries, initialDelay, factor);
     console.log(`Operation failed, retrying in ${delay}ms...`);

     await new Promise(resolve => setTimeout(resolve, delay));
     retries++;
   }
 }
}