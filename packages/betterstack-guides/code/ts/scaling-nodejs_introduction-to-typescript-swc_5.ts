# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-typescript-swc/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label src/index.ts]
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

class UserService {
  private users: User[] = [];

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date(),
      ...userData
    };
    
    this.users.push(newUser);
    console.log(`Created user: ${newUser.name} (${newUser.email})`);
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }
}

// Example usage
const userService = new UserService();

async function main() {
  try {
    const user = await userService.createUser({
      name: 'Alice Johnson',
      email: 'alice@example.com'
    });

    console.log('User created successfully:', user);

    const allUsers = await userService.getAllUsers();
    console.log('All users:', allUsers);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

main();