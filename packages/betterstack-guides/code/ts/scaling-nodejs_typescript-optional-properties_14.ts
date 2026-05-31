# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-optional-properties/
# Original language: typescript
# Normalized: ts
# Block index: 14

[label src/absence.ts]
interface UserProfile {
  username: string;
  bio?: string;              // Optional: might be undefined
  avatar: string | null;     // Explicit null: intentionally empty
}

const profile1: UserProfile = {
  username: "alice",
  avatar: null  // Explicitly no avatar
};

const profile2: UserProfile = {
  username: "bob",
  bio: "Developer",
  avatar: "avatar.jpg"
};

console.log("Profile 1 bio:", profile1.bio);        // undefined
console.log("Profile 1 avatar:", profile1.avatar);  // null
console.log("Profile 2 bio:", profile2.bio);        // "Developer"

console.log("\nJSON representation:");
console.log(JSON.stringify(profile1));
console.log(JSON.stringify(profile2));