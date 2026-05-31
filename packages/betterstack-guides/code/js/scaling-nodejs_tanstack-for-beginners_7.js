# Source: https://betterstack.com/community/guides/scaling-nodejs/tanstack-for-beginners/
# Original language: javascript
# Normalized: js
# Block index: 7

[label App.js]
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queryClient';
import UserList from './UserList';
[highlight]
import AddUser from './AddUser';
[/highlight]

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App" style={{ padding: '20px' }}>
        <h1>TanStack Query Demo</h1>
[highlight]
        <AddUser />
[/highlight]
        <UserList />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;