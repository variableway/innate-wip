# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: typescript
# Normalized: ts
# Block index: 1

const Product = Type.Object({
  name: Type.String({ minLength: 2 }),
  price: Type.Number({ minimum: 0, multipleOf: 0.01 }),
  tags: Type.Array(Type.String())
});

const validate = ajv.compile(Product);