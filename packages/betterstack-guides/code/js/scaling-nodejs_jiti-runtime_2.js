# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: javascript
# Normalized: js
# Block index: 2

[label loader.js]
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);

export default jiti;