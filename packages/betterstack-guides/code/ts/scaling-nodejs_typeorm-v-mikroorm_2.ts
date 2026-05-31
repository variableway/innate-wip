# Source: https://betterstack.com/community/guides/scaling-nodejs/typeorm-v-mikroorm/
# Original language: typescript
# Normalized: ts
# Block index: 2

@Entity()
export class User {
    @PrimaryKey()
    id: number;
    
    @Property({ length: 50 })
    @Unique()
    username: string;
    
    // Just change the data - no saving yet
    setUsername(name: string) {
        this.username = name;
        // MikroORM tracks this change automatically
    }
}

// Working with an EntityManager
const em = orm.em.fork(); // Creates a separate workspace

const user = new User();
user.username = "john";
em.persist(user); // Mark for saving later

// Save all changes at once
await em.flush();