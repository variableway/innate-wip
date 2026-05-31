# Source: https://betterstack.com/community/guides/monitoring/exponential-backoff/
# Original language: javascript
# Normalized: js
# Block index: 9

class CircuitBreaker {
 constructor(options = {}) {
   this.failureThreshold = options.failureThreshold || 5;
   this.resetTimeout = options.resetTimeout || 30000;
   this.state = 'CLOSED';       // CLOSED = allow requests, OPEN = block requests
   this.failureCount = 0;
   this.lastFailureTime = null;
 }

 // Additional methods omitted for brevity

 async execute(operation) {
   if (this.isOpen()) {
     throw new Error('Circuit breaker is open, request rejected');
   }

   try {
     const result = await operation();
     this.recordSuccess();
     return result;
   } catch (error) {
     this.recordFailure();
     throw error;
   }
 }
}