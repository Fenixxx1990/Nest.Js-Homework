import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Schema({ timestamps: true })
export class UserModel {
  @Prop({
    required: true,
    minlength: 2,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop()
  phoneNumber?: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserModel>;
export const UserSchema = SchemaFactory.createForClass(UserModel);
