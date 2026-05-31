# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 3

// ts-node comprehensive TypeScript handling
interface Task {
  id: string;
  status: ProjectStatus;
}

class TaskManager {
  private tasks: Task[] = [];
  
  addTask(task: Task): void {
    this.tasks.push(task);  // Fully type-checked before execution
  }
  
  // ts-node stops execution here with detailed error
  addInvalidTask(task: string): void {  
    this.tasks.push(task); // Error: Argument of type 'string' not assignable
  }
}