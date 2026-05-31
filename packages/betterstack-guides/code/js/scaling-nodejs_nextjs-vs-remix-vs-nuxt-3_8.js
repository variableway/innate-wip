# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 8

// app/routes/users.jsx
export async function loader({ request }) {
  // Check authentication
  const userId = await requireAuth(request);
  
  // Get data based on URL and request
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  
  return db.users.findMany({
    where: {
      name: { contains: search }
    }
  });
}

export async function action({ request }) {
  // Handle form submissions
  const formData = await request.formData();
  const intent = formData.get('intent');
  
  if (intent === 'create') {
    return db.users.create({
      data: {
        name: formData.get('name'),
        email: formData.get('email')
      }
    });
  }
  
  if (intent === 'delete') {
    return db.users.delete({
      where: { id: formData.get('id') }
    });
  }
}