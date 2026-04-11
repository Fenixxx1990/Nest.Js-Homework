import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { RolesGuard } from "@/user/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "@/user/decorators/roles.decorator";
import { UserRole } from "@/user/user.model";

@Controller("rooms")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(ValidationPipe)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.roomService.findOne(id);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN)
  @UsePipes(ValidationPipe)
  update(@Param("id") id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  remove(@Param("id") id: string) {
    return this.roomService.remove(id);
  }
}
