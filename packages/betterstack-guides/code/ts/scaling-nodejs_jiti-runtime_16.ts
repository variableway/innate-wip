# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: typescript
# Normalized: ts
# Block index: 16

[label app.ts]
interface Task {
  id: number;
  name: string;
  completed: boolean;
}

const tasks: Task[] = [
  { id: 1, name: 'Setup project', completed: true },
  { id: 2, name: 'Write documentation', completed: false },
  { id: 3, name: 'Deploy to production', completed: false }
];

function getIncompleteTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => !task.completed);
}

const incomplete = getIncompleteTasks(tasks);
console.log(`You have ${incomplete.length} incomplete tasks:`);
incomplete.forEach(task => console.log(`- ${task.name}`));