# Source: https://betterstack.com/community/guides/scaling-nodejs/rest-parameters-spread/
# Original language: typescript
# Normalized: ts
# Block index: 17

[label src/spread-objects.ts]
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
}

interface FullProfile extends User, UserPreferences {
  lastLogin: Date;
}

const baseUser: User = {
  id: "U123",
  name: "Alice",
  email: "alice@example.com"
};

const preferences: UserPreferences = {
  theme: "dark",
  notifications: true
};

// Combine objects with spread
const profile: FullProfile = {
  ...baseUser,
  ...preferences,
  lastLogin: new Date()
};

console.log("Profile:", profile);

// Immutable update pattern
const updatedProfile = {
  ...profile,
  theme: "light" as const,
  lastLogin: new Date()
};

console.log("Updated theme:", updatedProfile.theme);

// Partial updates
function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}

const updated = updateUser(baseUser, { name: "Alice Smith" });
console.log("Updated user:", updated);