# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 7

@Entity()
export class User {
    // Other fields...
    
    @OneToMany(() => Post, post => post.author, {
        cascade: true,  // Saves related posts when user is saved
        eager: false    // Don't load automatically
    })
    posts: Post[];
}

@Entity()
export class Post {
    // Other fields...
    
    @ManyToOne(() => User, user => user.posts)
    author: User;
}

// Different ways to load relationships
const user = await userRepository.findOneBy({ id: 1 });
const posts = await user.posts; // Makes a separate query

// Eager loading - gets everything at once
const userWithPosts = await userRepository.findOne({
    where: { id: 1 },
    relations: ["posts"]
});