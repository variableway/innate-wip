# Source: https://betterstack.com/community/guides/monitoring/exponential-backoff/
# Original language: javascript
# Normalized: js
# Block index: 8

// Create the backoff instance with custom parameters
const backoff = new ExponentialBackoff({
 initialDelay: 500,    // Start with 500ms delay
 maxDelay: 60000,      // Maximum delay of 1 minute
 factor: 3,            // Triple the delay each time
 maxRetries: 8,        // Try up to 8 times
 jitter: true          // Apply randomization
});

// Define the operation that might fail
async function fetchData() {
 const response = await fetch('https://api.example.com/data');

 if (!response.ok) {
   const error = new Error('Request failed');
   error.status = response.status;
   throw error;
 }

 return response.json();
}

// Execute with backoff
backoff.execute(fetchData)
 .then(data => console.log('Data retrieved successfully:', data))
 .catch(error => console.error('All retries failed:', error));