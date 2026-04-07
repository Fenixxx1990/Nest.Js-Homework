import { IsDate, IsMongoId } from "class-validator";

export class CreateBookingDto {
  @IsMongoId()
  roomId: string;

  @IsDate()
  date: Date;
}
