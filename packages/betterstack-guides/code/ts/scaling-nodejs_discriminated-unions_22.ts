# Source: https://betterstack.com/community/guides/scaling-nodejs/discriminated-unions/
# Original language: typescript
# Normalized: ts
# Block index: 22

[label src/exhaustive.ts]
interface UserLoginEvent {
  type: "user_login";
  userId: number;
  timestamp: Date;
}

interface UserLogoutEvent {
  type: "user_logout";
  userId: number;
  sessionDuration: number;
}

interface PageViewEvent {
  type: "page_view";
  url: string;
  referrer: string;
}

type AnalyticsEvent = UserLoginEvent | UserLogoutEvent | PageViewEvent;

function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

function processEvent(event: AnalyticsEvent): string {
  switch (event.type) {
    case "user_login":
      return `User ${event.userId} logged in at ${event.timestamp.toISOString()}`;

    case "user_logout":
      return `User ${event.userId} logged out after ${event.sessionDuration}s`;

    case "page_view":
      return `Page view: ${event.url} from ${event.referrer}`;

    default:
      return assertNever(event);
  }
}

const events: AnalyticsEvent[] = [
  { type: "user_login", userId: 42, timestamp: new Date() },
  { type: "user_logout", userId: 42, sessionDuration: 3600 },
  { type: "page_view", url: "/dashboard", referrer: "/home" }
];

events.forEach(event => {
  console.log(processEvent(event));
});