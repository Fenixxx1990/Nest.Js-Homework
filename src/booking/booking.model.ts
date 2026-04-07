import { Room } from "@/room/room.model";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BookingDocument = Document<Booking> & Booking;

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
  })
  date: Date;

  @Prop({ default: null })
  deletedAt: Date | null;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Составной уникальный индекс: одна бронь на комнату в один день
BookingSchema.index(
  { roomId: 1, date: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
    name: "unique_room_date_active",
  }
);
