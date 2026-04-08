import { IsMongoId, IsDate } from "class-validator";

export class CreateBookingDto {
  // @IsMongoId()
  roomId: string;

  // @IsDate()
  date: Date;
}
