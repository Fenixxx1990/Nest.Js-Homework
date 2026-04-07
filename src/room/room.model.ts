import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room extends Document {
  @Prop({ required: true, unique: true })
  roomNumber: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: false })
  hasSeaView: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
