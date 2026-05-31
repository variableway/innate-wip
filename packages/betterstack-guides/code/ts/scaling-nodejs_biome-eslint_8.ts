# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 8

// Component with TypeScript and JSX
interface UserProps {
  name: string;
  email: string;
  onUpdate: (user: User) => void;
}

export function UserCard({ name, email, onUpdate }: UserProps) {
  const [editing, setEditing] = useState(false);
  
  // Biome catches unused variables
  const unusedVar = 'test';
  
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <button onClick={() => setEditing(true)}>Edit</button>
    </div>
  );
}