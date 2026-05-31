# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 17

// api/users.ts
import { formatDate } from '../utils';

// utils/index.ts
import { api } from '../api';

// This creates a cycle: api → utils → api