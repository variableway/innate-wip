# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 14

export async function loader({ request }) {
  try {
    const data = await fetchSensitiveData();
    return json(data);
  } catch (error) {
    console.error("Database error:", error);
    
    // Don't expose internal error details to the client
    throw new Response("Internal Server Error", { status: 500 });
  }
}