# Source: https://betterstack.com/community/guides/scaling-nodejs/remix-3-beyond-react/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label routes.ts]
export const routes = {
  home: route('/'),
  about: route('/about'),
  blog: {
    index: route('/blog'),
    post: route('/blog/:slug'),
  },
  fragments: {
    bookCard: route('/fragments/book/:slug'),
  },
};