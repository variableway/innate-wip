# Source: https://betterstack.com/community/guides/scaling-nodejs/tanstack-for-beginners/
# Original language: javascript
# Normalized: js
# Block index: 8

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