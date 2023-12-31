import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    required: true,
  })
  imageUrl: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
