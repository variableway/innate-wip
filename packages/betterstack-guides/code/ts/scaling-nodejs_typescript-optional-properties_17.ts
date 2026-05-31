# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-optional-properties/
# Original language: typescript
# Normalized: ts
# Block index: 17

[label src/utilities.ts]
interface Address {
  street?: string;
  city?: string;
  country?: string;
}

interface Company {
  name: string;
  address?: Address;
}

interface Employee {
  name: string;
  company?: Company;
}

function getEmployeeCity(employee: Employee): string {
  return employee.company?.address?.city ?? 'Unknown';
}

function formatAddress(employee: Employee): string {
  const addr = employee.company?.address;
  if (!addr) return 'No address available';
  
  return [addr.street, addr.city, addr.country]
    .filter(Boolean)
    .join(', ');
}

const emp1: Employee = {
  name: "Alice",
  company: {
    name: "TechCorp",
    address: { city: "New York", country: "USA" }
  }
};

const emp2: Employee = { name: "Bob" };

console.log(getEmployeeCity(emp1));  // New York
console.log(getEmployeeCity(emp2));  // Unknown
console.log(formatAddress(emp1));    // New York, USA
console.log(formatAddress(emp2));    // No address available