# Source: https://betterstack.com/community/guides/scaling-nodejs/sveltekit-vs-nextjs/
# Original language: jsx
# Normalized: js
# Block index: 12

// Using the API in components
export default function Users() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return <div>{/* Render users */}</div>;
}