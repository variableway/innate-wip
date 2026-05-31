# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-enums/
# Original language: typescript
# Normalized: ts
# Block index: 14

[label src/enum-comparison.ts]
// String enums: Best for API contracts
enum ApiStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Failed = 'FAILED'
}

function getJobStatus(): { status: ApiStatus } {
  return { status: ApiStatus.Completed };
}

// Numeric enums: Best for ordered states
enum Priority {
  Low = 0,
  Medium = 1,
  High = 2
}

function canEscalate(priority: Priority): boolean {
  return priority < Priority.High;
}

// Const enums: Best for internal constants
const enum CacheKey {
  UserProfile = 'user_profile',
  Settings = 'settings'
}

function getCacheKey(key: CacheKey): string {
  return `app:${key}`;
}

// Test each approach
console.log('Status:', getJobStatus().status);
console.log('Can escalate?', canEscalate(Priority.Low));
console.log('Cache key:', getCacheKey(CacheKey.UserProfile));