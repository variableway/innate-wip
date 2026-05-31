# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-readonly/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label src/arrays.ts]
interface DatabaseConfig {
  readonly host: string;
  readonly allowedIPs: readonly string[];
}

const dbConfig: DatabaseConfig = {
  host: "localhost",
  allowedIPs: ["192.168.1.1", "192.168.1.2"]
};

// These fail at compile time:
// dbConfig.host = "newhost.com";
// dbConfig.allowedIPs.push("192.168.1.3");
// dbConfig.allowedIPs[0] = "10.0.0.1";

// Reading works fine:
console.log("Host:", dbConfig.host);
console.log("First IP:", dbConfig.allowedIPs[0]);