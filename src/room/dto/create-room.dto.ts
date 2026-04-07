import { IsString, IsBoolean } from "class-validator";

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsString()
  type: string;

  @IsBoolean()
  hasSeaView: boolean;
}
