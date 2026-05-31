# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 32

// Warning: missing key prop
{items.map(item => (
  <div>{item.name}</div>
))}

// Warning: invalid hook call
if (condition) {
  useEffect(() => {});
}