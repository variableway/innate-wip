# Source: https://betterstack.com/community/guides/scaling-nodejs/tanstack-for-beginners/
# Original language: javascript
# Normalized: js
# Block index: 6

[label src/AddUser.jsx]
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const createUser = async (userData) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
};

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['users'] });      
      // Reset form
      setName('');
      setEmail('');
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, email });
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', marginBottom: '20px' }}>
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
            required
          />
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </form>
      {mutation.error && (
        <div style={{ color: 'red' }}>
          Error: {mutation.error.message}
        </div>
      )}
    </div>
  );
};

export default AddUser;