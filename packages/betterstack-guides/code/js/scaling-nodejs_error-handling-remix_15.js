# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 15

function ClickCounter() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    try {
      // Some operation that might fail
      if (someRiskyCondition) {
        throw new Error("Something went wrong in the effect");
      }
    } catch (e) {
      setError(e);
    }
    
    const handleError = (event) => {
      // Log client-side errors
      console.error("Client error:", event.error);
    };
    
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);
  
  // Re-throw the error if it happened
  if (error) {
    throw error; // This will be caught by the nearest ErrorBoundary
  }
  
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}