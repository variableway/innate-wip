# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 14

// app/routes/users.new.jsx
import { Form, useActionData, useTransition } from '@remix-run/react';

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  
  const errors = {};
  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  if (Object.keys(errors).length) {
    return { errors };
  }
  
  await db.users.create({ data: { name, email } });
  return redirect('/users');
}

export default function NewUser() {
  const actionData = useActionData();
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';
  
  return (
    <Form method="post">
      <div>
        <label>
          Name: <input name="name" />
        </label>
        {actionData?.errors?.name && (
          <p className="error">{actionData.errors.name}</p>
        )}
      </div>
      
      <div>
        <label>
          Email: <input name="email" type="email" />
        </label>
        {actionData?.errors?.email && (
          <p className="error">{actionData.errors.email}</p>
        )}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </Form>
  );
}