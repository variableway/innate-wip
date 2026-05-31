# Source: https://betterstack.com/community/guides/monitoring/exponential-backoff/
# Original language: javascript
# Normalized: js
# Block index: 6

function calculateBackoffWithJitter(retry, initialDelay, factor, cap) {
 // Calculate basic exponential backoff
 const exponentialDelay = initialDelay * Math.pow(factor, retry);

 // Apply cap if provided
 const cappedDelay = cap ? Math.min(exponentialDelay, cap) : exponentialDelay;

 // Apply full jitter: random delay between 0 and the calculated delay
 return Math.random() * cappedDelay;
}

async function retryWithBackoffAndJitter(
 operation,
 maxRetries,
 initialDelay = 1000,
 factor = 2,
 maxDelay = 30000
) {
 let retries = 0;

 while (retries <= maxRetries) {
   try {
     return await operation();
   } catch (error) {
     if (retries >= maxRetries) {
       throw error; // Rethrow if we've exhausted retries
     }

     const delay = calculateBackoffWithJitter(retries, initialDelay, factor, maxDelay);
     console.log(`Operation failed, retrying in ${Math.round(delay)}ms...`);

     await new Promise(resolve => setTimeout(resolve, delay));
     retries++;
   }
 }
}