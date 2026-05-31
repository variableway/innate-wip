# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 31

[label src/views/index.ejs]
<h1>Blog Posts</h1>
<% if (posts.length > 0) { %>
<ul class="posts">
  <% posts.forEach(post => { %>
  <li>
    <a href="/post/<%= post.slug %>" class="posts-title"><%= post.title %></a>
    <div class="post-actions">
      <a href="/post/<%= post.slug %>/edit" class="btn">Edit</a>
      <form
        action="/post/<%= post.slug %>/delete"
        method="post"
        class="posts-form"
      >
        <button type="submit" class="btn">Delete</button>
      </form>
    </div>
  </li>
  <% }) %>
</ul>
<% } else { %>
<p>There are no blog posts yet. Why not <a href="/post/new">create one</a>?</p>
<% } %>