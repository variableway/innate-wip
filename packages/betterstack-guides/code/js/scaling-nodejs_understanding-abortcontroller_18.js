# Source: https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/
# Original language: javascript
# Normalized: js
# Block index: 18

const fetchDataMethod = async () => {
  try {
    const response = await fetch(url, { signal });
    ...
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("your error messsage here");
    } else {
      console.error("Error:", error);
    }
  }
};