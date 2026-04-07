import { Room } from "@/room/room.model";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Room.name,
  })
  roomId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    index: {
      unique: true,
      partialFilterExpression: { deletedAt: null },
    },
  })
  date: Date;

  @Prop({ default: null })
  deletedAt: Date | null;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
