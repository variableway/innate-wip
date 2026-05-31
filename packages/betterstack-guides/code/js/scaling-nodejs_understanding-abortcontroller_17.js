# Source: https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/
# Original language: javascript
# Normalized: js
# Block index: 17

const fetchDataMethod = async () => {;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000),
    });
    ...
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log(`your error message here`);
    } else {
      console.error("Error:", error);
    }
  }
}