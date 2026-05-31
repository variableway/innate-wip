# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 13

// app/users/create/page.js
export default function CreateUserPage() {
  async function createUser(formData) {
    'use server';
    
    const name = formData.get('name');
    const email = formData.get('email');
    
    await db.users.create({ data: { name, email } });
    redirect('/users');
  }
  
  return (
    <form action={createUser}>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required />
      <button type="submit">Create User</button>
    </form>
  );
}