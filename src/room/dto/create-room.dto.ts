import { IsString, IsBoolean, IsUrl, IsArray } from "class-validator";

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsString()
  type: string;

  @IsBoolean()
  hasSeaView: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  images: string[];
}
