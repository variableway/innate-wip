# Source: https://betterstack.com/community/guides/database-platforms/index/
# Original language: javascript
# Normalized: js
# Block index: 14

[label auth.js]
import PocketBase from "pocketbase";

const pb = new PocketBase("http://YOUR_SERVER_IP:8090");

async function registerAndLogin() {
  try {
[highlight]
    // 1. Create a new user
    const newUser = await pb.collection("users").create({
      email: "test@example.com",
      emailVisibility: true,
      password: "aSecurePassword123",
      passwordConfirm: "aSecurePassword123",
      name: "Test User",
    });
[/highlight]
    console.log("User created successfully:", newUser.email);

[highlight]
    // 2. Authenticate (log in) with the new user's credentials
    const authData = await pb
      .collection("users")
      .authWithPassword("test@example.com", "aSecurePassword123");
[/highlight]
    console.log("Authentication successful!");

    // 3. Verify the authentication state
    console.log("Is the user authenticated?", pb.authStore.isValid);
    console.log("Auth token:", pb.authStore.token);

    // 4. Log the user out
    pb.authStore.clear();
    console.log("User logged out. Is authenticated?", pb.authStore.isValid);
  } catch (error) {
    console.error("Authentication process failed:", error);
  }
}

registerAndLogin();