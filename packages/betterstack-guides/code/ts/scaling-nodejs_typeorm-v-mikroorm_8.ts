# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 8

@Entity()
export class User {
    // Other fields...
    
    @OneToMany(() => Post, post => post.author)
    posts = new Collection<Post>(this);
}

@Entity()
export class Post {
    // Other fields...
    
    @ManyToOne()
    author: User;
}

// Working with collections
const user = await em.findOne(User, { id: 1 });

// Nothing loaded yet
console.log(user.posts.isInitialized()); // false

// Load posts when you need them
await user.posts.init();
console.log(user.posts.length); // Now loaded

// Adding related records
const post = new Post();
post.title = "MikroORM guide";
user.posts.add(post);