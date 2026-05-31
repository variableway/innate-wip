# Source: https://betterstack.com/community/guides/scaling-nodejs/tanstack-for-beginners/
# Original language: javascript
# Normalized: js
# Block index: 5

[label UserList.jsx]
import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchUsers = async () => {
[highlight]
  console.log('Fetching users from API...');
[/highlight]
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

const UserList = () => {
  const { 
    data: users, 
    isLoading, 
    error, 
[highlight]
    isStale,
    isFetching,
    dataUpdatedAt
[/highlight]
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
[highlight]
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
[/highlight]
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
[highlight]
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
        <p>Data is {isStale ? 'stale' : 'fresh'}</p>
        <p>Currently fetching: {isFetching ? 'Yes' : 'No'}</p>
        <p>Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}</p>
      </div>
[/highlight]
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;