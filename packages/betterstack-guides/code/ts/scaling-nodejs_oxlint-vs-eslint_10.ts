# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label src/hooks/useUser.ts]
// src/hooks/useUser.ts
export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  
  // Oxlint catches this - conditional hook call
  if (id) {
    useEffect(() => {
      fetchUser(id).then(setUser);
    }, [id]);
  }
  
  return user;
}