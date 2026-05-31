# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-target-compiler/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/api-client.ts]
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchUser(id: number): Promise<{name: string; email: string} | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch user: ${error}`);
      return null;
    }
  }

  async batchFetch(ids: number[]): Promise<Array<{name: string; email: string}>> {
    const results = await Promise.all(
      ids.map(id => this.fetchUser(id))
    );
    return results.filter((user): user is {name: string; email: string} => user !== null);
  }
}

export { ApiClient };