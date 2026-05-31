# Source: https://betterstack.com/community/guides/scaling-nodejs/sveltekit-vs-nextjs/
# Original language: jsx
# Normalized: js
# Block index: 0

// You need to understand React first
export default function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <UserList users={users} />;
}