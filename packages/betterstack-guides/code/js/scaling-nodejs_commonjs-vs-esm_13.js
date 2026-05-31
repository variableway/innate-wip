# Source: https://betterstack.com/community/guides/scaling-nodejs/commonjs-vs-esm/
# Original language: javascript
# Normalized: js
# Block index: 13

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const somePackage = require("some-package");