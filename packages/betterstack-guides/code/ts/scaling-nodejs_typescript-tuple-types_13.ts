# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-tuple-types/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/rest.ts]
// Tuple with rest elements
type LogEntry = [timestamp: number, level: string, ...messages: string[]];

function createLog(level: string, ...messages: string[]): LogEntry {
  return [Date.now(), level, ...messages];
}

function formatLog(entry: LogEntry): string {
  const [timestamp, level, ...messages] = entry;
  const date = new Date(timestamp).toISOString();
  return `[${date}] ${level.toUpperCase()}: ${messages.join(" ")}`;
}

const log1 = createLog("info", "Server started");
const log2 = createLog("error", "Connection failed", "Retrying", "Attempt 3");

console.log(formatLog(log1));
console.log(formatLog(log2));

// Function signature with tuple rest parameters
function makeRequest(
  method: string,
  url: string,
  ...options: [headers?: Record<string, string>, body?: unknown]
): void {
  const [headers, body] = options;
  console.log(`${method} ${url}`);
  if (headers) console.log("Headers:", headers);
  if (body) console.log("Body:", body);
}

makeRequest("GET", "/api/users");
makeRequest("POST", "/api/users", { "Content-Type": "application/json" }, { name: "Alice" });