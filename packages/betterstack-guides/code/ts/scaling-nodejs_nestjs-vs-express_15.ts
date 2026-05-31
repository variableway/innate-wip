# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: typescript
# Normalized: ts
# Block index: 15

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);