# Source: https://betterstack.com/community/guides/scaling-nodejs/react-server-security-vulnerabilities/
# Original language: typescript
# Normalized: ts
# Block index: 0

"use server";

    // Mock database connection
    const db = {
      createConnection: (secret: string) => {
        console.log(`Connecting with secret: ${secret}`);
        return {
          createUser: async (name: unknown) => {
            console.log(`Creating user: ${name}`);
            return { id: "user_abc_123" };
          },
        };
      },
    };

    export async function submitName(name: unknown) {
      const conn = db.createConnection("SECRET_KEY_12345");
      const user = await conn.createUser(name);

      return {
        id: user.id,
        message: `Hello, ${name}!`, // The vulnerable part
      };
    }