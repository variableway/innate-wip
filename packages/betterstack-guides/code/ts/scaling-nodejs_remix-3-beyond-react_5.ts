# Source: https://betterstack.com/community/guides/scaling-nodejs/remix-3-beyond-react/
# Original language: typescript
# Normalized: ts
# Block index: 5

{books.map((book) => (
  <Frame
    key={book.slug}
    fallback={<div>Loading...</div>}
    src={routes.fragments.bookCard.href({ slug: book.slug })}
  />
))}