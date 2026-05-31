# TanStack for Beginners

[TanStack](https://tanstack.com/) is a powerful collection of headless utilities for building modern web applications that has transformed how developers handle data fetching, state management, and UI interactions in React.

TanStack includes all the essential features you'd expect in modern state management solutions: smart caching, background refetching, optimistic updates, and smooth error handling. You can use it with different frameworks, but it works especially well with React where it cuts down on boilerplate code and makes your apps feel faster.

This guide will show you how to build a complete data management solution for your React app using TanStack Query. You'll learn how to use its features and configure it for the best performance in your specific situation.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/eHbO5OWBBpg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Prerequisites

Before you begin this guide, ensure that you have a recent version of [Node.js](https://nodejs.org/en/download/) and `npm` installed on your computer. This tutorial assumes you know the basics of React, including hooks, component lifecycle, and basic state management.

## Getting started with TanStack Query

To get the most out of this tutorial, you'll create a fresh React project to try out everything covered in this guide. Start by setting up a new React application using Vite:

```command
npm create vite@latest tanstack-demo -- --template react
```

```command
cd tanstack-demo
```

```command
npm install
```

```command
npm run dev
```

Your browser should automatically open to `http://localhost:5173` and show the default Vite React welcome page:

![Screenshot of the browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a7dc480d-51a0-4d2f-5f58-9480f289dd00/lg1x =3248x1996)

Keep this development server running throughout the tutorial because you'll be making changes frequently and watching the results in real-time.


Next, install the core TanStack Query package and its development tools:

```command
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Create a new `queryClient.js` file in your `src` directory and add this configuration:

```javascript
[label src/queryClient.js]
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});
```

This setup creates a query client with good default settings for data freshness and cache duration. You'll explore different ways to customize the query client throughout this tutorial, but these defaults work well for most apps.

Now update your main `App.js` file to use the query client:

```javascript
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
```

Create a simple component to see TanStack Query in action. Make a `UserList.jsx` file:

```javascript
[label UserList.jsx]
import React from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

const UserList = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
```

Save your files and go back to your browser. You should now see a list of users loaded from the JSONPlaceholder API:

![Screenshot of the list of users loaded](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9abf69f2-2780-4654-b671-4c9ed03e3400/md1x =3248x1996)


Notice the floating React Query DevTools icon in the bottom-right corner of your browser window - click it to open the powerful debugging interface that shows query states, cache contents, and network activity.

![Browser screenshot showing the TanStack Query demo application with a list of users displayed and the React Query DevTools panel open, showing query states and cache information](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/22ec0a38-44c1-495d-5080-2c7f88972900/md2x =3248x1996)

Now that you've set up TanStack Query successfully and seen its basic functionality, let's explore how queries work internally, their different states, and the powerful caching features that make this library so effective.


## Understanding query states and caching

TanStack Query uses several distinct states to control how your data gets fetched and displayed. The main states are `loading`, `error`, `success`, and `idle`. Each one represents a different phase in the data lifecycle.

When a query first runs, it enters the `loading` state while the network request happens. When it finishes successfully, the query moves to `success` state, and the returned data becomes available to your component. If an error occurs during fetching, the query moves to the `error` state and gives you detailed error information.

The caching system is where TanStack Query really shines. Once you fetch data, it gets stored in a smart cache that can serve future requests instantly. The `staleTime` setting determines how long cached data stays "fresh" before becoming stale, while `cacheTime` controls how long unused data stays in memory.

Let's improve our example to show these concepts. Update your `UserList.jsx` file:

```javascript
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
```

Save your changes and refresh your browser. You should see the enhanced user list with query state information:

![Screenshot showing the enhanced UserList component with query state indicators](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/83414fe6-96f3-4121-467b-860c089d3900/public =3248x1996)


Watch how the console message "Fetching users from API..." appears only once initially. Switch to another browser tab for more than 30 seconds, then come back - you'll see the data becomes stale and a background refetch happens. Open your browser's Developer Tools (F12) to see these console messages and network requests in action.

![Browser screenshot showing the enhanced UserList component with query state indicators and browser DevTools open, displaying console logs and network activity](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/876544db-1d6c-46c4-0126-ca98f4547900/md2x =3248x1996)

The query state indicators help you understand when data is considered stale and when background refetching occurs. You can also see this information in the React Query DevTools panel.

Understanding these query states and caching behaviors is crucial for building efficient apps. With this foundation ready, let's explore how to handle data changes through mutations and implement optimistic updates for an even better user experience.

## Mutations and optimistic updates

While queries handle data fetching, mutations manage data changes like creating, updating, or deleting records. TanStack Query's mutation system gives you powerful features including optimistic updates, automatic retry logic, and smooth error handling.

Let's create a component that shows how to add new users. Create a new `AddUser.jsx` file:

```javascript
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
```
Here's what's happening in the code.

**The `createUser` function** makes a POST request to the JSONPlaceholder API to simulate creating a new user. It sends the user data as JSON and throws an error if the request fails.

**The `AddUser` component** creates a form with two input fields for name and email. It uses React's `useState` to manage the form state and `useQueryClient` to access TanStack Query's cache management.

**The mutation setup** uses `useMutation` to handle the user creation process. When the mutation succeeds (`onSuccess`), it automatically invalidates the users query cache, forcing a refetch of the user list to show the updated data. It also resets the form fields. If an error occurs (`onError`), it logs the error to the console.

**The form handling** prevents the default form submission and calls `mutation.mutate()` with the current name and email values. The submit button shows "Adding..." while the mutation is in progress (`mutation.isPending`) and gets disabled to prevent multiple submissions.

**The UI** renders a simple form with styling, shows any error messages that occur during the mutation, and provides visual feedback about the loading state.

This creates a complete user creation flow that automatically keeps your UI synchronized with the server data through TanStack Query's cache invalidation system.

Update your `App.js` to include the new component:

```javascript
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
```

In your browser, you'll now see a form above the user list. Try adding a new user and watch how the form resets:

![Screenshot showing the AddUser form component above the user list](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/58398fd3-4e60-4ecc-4f63-4cc12f548900/md1x =3248x1996)

Note that with JSONPlaceholder (our demo API), new users won't actually appear in the list because it's a mock API that doesn't save data permanently. However, you can still observe how TanStack Query handles the mutation lifecycle through the DevTools.

Open the React Query DevTools and watch the mutation process. When you fill out the form with a name and email and click "Add User", you'll see a new mutation appear in the Mutations tab with a "pending" status. At the same time, look at the Queries tab where you'll notice the `['users']` query gets "invalidated" and changes from "fresh" to "stale" to "fetching" as it automatically refetches the data.

Here's what the process looks like. **Before submitting the form:**

![Screenshot showing DevTools with no active mutations](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9d20e262-122d-4739-bc1a-312ff9255800/md2x =3248x1996)


**After completion:** The mutation disappears, the users query shows as "fresh" again, and the form gets reset with cleared input fields:


![Screenshot of after completion](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/63f35b54-2a19-4ac1-849e-7de9a9388e00/orig =3248x1996)

The key insight here is watching how TanStack Query automatically coordinates between your mutation and your queries. When you add a user, it knows to refetch the users query to keep everything synchronized without you having to trigger the refresh manually.


### Making your app feel faster with optimistic updates

By default, mutations only update your UI after the server confirms the change. But you can make your interface feel much faster and more responsive with optimistic updates. This technique assumes the mutation will succeed and immediately shows the change in the UI, while quietly syncing with the server in the background. If the server responds with an error, you can roll back to the previous state.

Let's modify the `AddUser` component to include optimistic updates:

```javascript
[label src/AddUser.jsx]
const mutation = useMutation({
  mutationFn: createUser,
[highlight]
  onMutate: async (newUser) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['users'] });

    // Snapshot the previous value
    const previousUsers = queryClient.getQueryData(['users']);

    // Optimistically update to the new value
    queryClient.setQueryData(['users'], (old) => [
      ...old,
      { 
        ...newUser, 
        id: Date.now(), // Temporary ID
        phone: '1-555-000-0000',
        website: 'example.com'
      }
    ]);

    // Return a context object with the snapshotted value
    return { previousUsers };
  },
  onError: (err, newUser, context) => {
    // If the mutation fails, use the context to roll back
    queryClient.setQueryData(['users'], context.previousUsers);
  },
  onSettled: () => {
    // For demo purposes, we skip refetching since JSONPlaceholder doesn't persist data
    // In a real app, you would refetch here:
    // queryClient.invalidateQueries({ queryKey: ['users'] });
  },
  onSuccess: () => {
    // Reset form
    setName('');
    setEmail('');
  },
[/highlight]

});
```

Now when you submit the form, you'll see the new user appear instantly at the bottom of the user list, creating a much more responsive experience:

![Screenshot showing optimistic updates in action with a new user appearing immediately](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8bbd2301-bb4f-4531-9f3e-bebc27468b00/md1x =3248x1996)

The optimistic update process works in three stages:

1. **onMutate** - Runs before the mutation starts and immediately updates the UI
2. **onError** - Rolls back changes if the mutation fails 
3. **onSettled** - Runs after success or failure to ensure data consistency

You can watch this entire process in the React Query DevTools, where each stage is tracked and displayed in real-time.

Understanding mutations and optimistic updates gives you the tools to create highly interactive apps. Next, you'll explore advanced query techniques, including dependent queries that let you chain data fetching based on user interactions.


## Final thoughts
Throughout this guide, you've explored TanStack Query's fundamental concepts and advanced patterns, from basic queries to sophisticated mutations with optimistic updates. You now have the knowledge to implement robust, efficient data fetching solutions in your React applications.

TanStack Query offers much more beyond what you've covered here, including infinite queries, suspense integration, and SSR support. Dive deeper into the [official TanStack documentation](https://tanstack.com/query/latest) to explore these advanced features and discover how they can benefit your specific use cases.

Consider exploring other TanStack utilities like [TanStack Router](https://tanstack.com/router) and [TanStack Virtual](https://tanstack.com/virtual) to create a comprehensive development toolkit. Remember to leverage the React Query DevTools for debugging and optimization as you build more complex applications.