import { IsDateString, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class CreateBookingDto {
  @IsMongoId()
  roomId: Types.ObjectId;

  @IsDateString()
  date: Date;
}
