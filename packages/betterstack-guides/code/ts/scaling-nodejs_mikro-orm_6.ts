# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label src/entities/Book.ts]
import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';

@Entity({ tableName: 'books' })
export class Book {
  @PrimaryKey({ type: types.integer, autoincrement: true })
  id!: number;

  @Property({ type: types.string, length: 200 })
  title!: string;

  @Property({ type: types.string, length: 100 })
  author!: string;

  @Property({ type: types.decimal, columnType: 'decimal(10,2)', nullable: true })
  price?: number;

  @Property({ type: types.datetime })
  createdAt: Date = new Date();

  @Property({ type: types.datetime, onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Method to get book details
  getDetails(): string {
    return `${this.title} by ${this.author} - $${this.price}`;
  }
}