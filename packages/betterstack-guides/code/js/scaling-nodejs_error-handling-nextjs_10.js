# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 10

[label components/ErrorableProductList.js] 

export default function ErrorableProductList({ products, error }) {
  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}> 
          Retry 
        </button>
      </div>
    );
  }
  
  return <div>{/* Product rendering */}</div>;
}