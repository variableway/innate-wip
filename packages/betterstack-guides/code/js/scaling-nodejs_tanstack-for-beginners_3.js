# Source: https://betterstack.com/community/guides/scaling-nodejs/tanstack-for-beginners/
# Original language: javascript
# Normalized: js
# Block index: 3

[label App.js]
[highlight]
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queryClient';
import UserList from './UserList';
[/highlight]

function App() {
[highlight]
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>TanStack Query Demo</h1>
        <UserList />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
[/highlight]
}

export default App;