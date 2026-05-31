# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 2

// Bun TypeScript execution approach
enum ProjectStatus {
  Active = 'active',
  Inactive = 'inactive'
}

class TaskManager {
  private tasks: Task[] = [];
  
  addTask(task: Task): void {
    this.tasks.push(task);  // Transpiled and executed immediately
  }
}

// Bun strips types and runs, trusting your IDE for type safety