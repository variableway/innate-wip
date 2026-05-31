# Source: https://betterstack.com/community/guides/scaling-nodejs/ory-kratos/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label ory.config.ts]
import type { OryClientConfiguration } from "@ory/elements-react";

const config: OryClientConfiguration = {
  project: {
    name: "Ory Authentication Example",
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    registration_ui_url: "/register",
    verification_ui_url: "/verification",
    recovery_ui_url: "/recovery",
    login_ui_url: "/login",
    settings_ui_url: "/settings",
  },
};

export default config;