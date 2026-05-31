# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-interfaces/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/extension.ts]
interface Person {
  name: string;
  email: string;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
}

interface Manager extends Employee {
  teamSize: number;
  reports: string[];
}

function sendEmail(person: Person) {
  console.log(`Sending email to ${person.name} at ${person.email}`);
}

function assignTask(employee: Employee) {
  console.log(`Assigning task to ${employee.name} in ${employee.department}`);
}

const manager: Manager = {
  name: "Alice",
  email: "alice@example.com",
  employeeId: "E123",
  department: "Engineering",
  teamSize: 5,
  reports: ["Bob", "Charlie"]
};

sendEmail(manager);      // Manager is also a Person
assignTask(manager);     // Manager is also an Employee
console.log("Team size:", manager.teamSize);