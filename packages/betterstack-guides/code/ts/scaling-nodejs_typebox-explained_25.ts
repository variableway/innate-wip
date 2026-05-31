# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-explained/
# Original language: typescript
# Normalized: ts
# Block index: 25

[label error-formatting.ts]
...
if (!isValid) {
  // Get raw errors
  const errors = [...validator.Errors(invalidData)];
  
[highlight]
  // Format errors for users
  function formatErrors(errors: any[]) {
    const formatted: Record<string, string> = {};
    
    for (const error of errors) {
      // Get the field name from the path (remove leading slash)
      const field = error.path.slice(1);
      
      // Create a user-friendly message based on the error
      let message = '';
      
      if (error.message.includes('minLength')) {
        message = 'This field is too short';
      } else if (error.message.includes('maxLength')) {
        message = 'This field is too long';
      } else if (error.message.includes('minimum')) {
        message = 'This value is too small';
      } else if (error.message.includes('format')) {
        message = 'This format is invalid';
      } else if (error.message.includes('required')) {
        message = 'This field is required';
      } else {
        message = 'This field is invalid';
      }
      
      formatted[field] = message;
    }
    
    return formatted;
  }
  
  // Display user-friendly errors
  const userErrors = formatErrors(errors);
  console.log('User-friendly errors:', userErrors);
[/highlight]
}