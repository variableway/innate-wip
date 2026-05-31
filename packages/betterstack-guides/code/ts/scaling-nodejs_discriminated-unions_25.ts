# Source: https://betterstack.com/community/guides/scaling-nodejs/discriminated-unions/
# Original language: typescript
# Normalized: ts
# Block index: 25

[label src/exhaustive.ts]
...

interface PageViewEvent {
  type: "page_view";
  url: string;
  referrer: string;
}

[highlight]
interface ErrorEvent {
  type: "error";
  message: string;
  stack?: string;
}

type AnalyticsEvent = UserLoginEvent | UserLogoutEvent | PageViewEvent | ErrorEvent;
[/highlight]

function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

function processEvent(event: AnalyticsEvent): string {
  ...
}

...