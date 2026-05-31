# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: typescript
# Normalized: ts
# Block index: 7

const StandardOrder = Type.Object({
  type: Type.Literal('standard'),
  items: Type.Array(Type.Object({}), { minItems: 1 }),
  insurance: Type.Optional(Type.Boolean())
});

const ExpressOrder = Type.Object({
  type: Type.Literal('express'),
  items: Type.Array(Type.Object({}), { minItems: 1 }),
  insurance: Type.Boolean()
});

const Order = Type.Union([StandardOrder, ExpressOrder]);