# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label app.module.ts]
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'enterprise_db',
      entities: [Product],
      synchronize: false,
    }),
    ProductsModule,
  ],
})
export class AppModule {}