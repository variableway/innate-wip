# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 23

// Biome 2.0 flags this with noFloatingPromises
export async function handleUserRequest(req: Request, res: Response) {
  const userId = req.params.id;
  getUserById(userId); // Warning: floating promise
  res.json({ status: 'ok' });
}