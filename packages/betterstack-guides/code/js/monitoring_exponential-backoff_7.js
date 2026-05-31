# Source: https://betterstack.com/community/guides/monitoring/exponential-backoff/
# Original language: javascript
# Normalized: js
# Block index: 7

class ExponentialBackoff {
 constructor({
   initialDelay = 1000,
   maxDelay = 30000,
   factor = 2,
   jitter = true,
   maxRetries = 5,
   retryableErrors = [
     'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EPIPE',
     429, 503, 504 // Status codes
   ]
 } = {}) {
   this.initialDelay = initialDelay;
   this.maxDelay = maxDelay;
   this.factor = factor;
   this.jitter = jitter;
   this.maxRetries = maxRetries;
   this.retryableErrors = retryableErrors;
 }

 isRetryable(error) {
   if (error.status && this.retryableErrors.includes(error.status)) {
     return true;
   }

   if (error.code && this.retryableErrors.includes(error.code)) {
     return true;
   }

   return false;
 }

 calculateDelay(retry) {
   // Calculate basic exponential delay
   const exponentialDelay = this.initialDelay * Math.pow(this.factor, retry);

   // Apply cap
   const cappedDelay = Math.min(exponentialDelay, this.maxDelay);

   // Apply jitter if enabled
   if (this.jitter) {
     return Math.random() * cappedDelay;
   }

   return cappedDelay;
 }

 async execute(operation) {
   let retries = 0;

   while (true) {
     try {
       return await operation();
     } catch (error) {
       if (
         retries >= this.maxRetries ||
         !this.isRetryable(error)
       ) {
         throw error;
       }

       const delay = this.calculateDelay(retries);
       console.log(
         `Operation failed with error ${error.message || error}. ` +
         `Retrying in ${Math.round(delay)}ms (${retries + 1}/${this.maxRetries})...`
       );

       await new Promise(resolve => setTimeout(resolve, delay));
       retries++;
     }
   }
 }
}