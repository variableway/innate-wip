# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 7

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  
  const errors = {};
  if (!email || !email.includes("@")) {
    errors.email = "Please provide a valid email";
  }
  
  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Invalid form submission", errors);
  }
  
  // Continue with valid form data
  return json({ success: true });
}