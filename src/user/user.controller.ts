import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
  HttpCode,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user.response.dto";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import type { RequestWithUser } from "./interface/authUser.interface";
import { USER_VALIDATION_MESSAGES } from "./user.constants";

@Controller("users")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser
  ): Promise<UserResponseDto> {
    const currentUserId = req.user._id;
    const isAdmin = req.user.role === "admin";

    if (currentUserId !== id && !isAdmin) {
      throw new UnauthorizedException(USER_VALIDATION_MESSAGES.NOT_ACCESS_PROFILE_ERROR);
    }

    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  @HttpCode(204)
  @Roles("admin")
  async delete(@Param("id") id: string): Promise<void> {
    await this.userService.delete(id);
  }

  @Delete("/test/:id")
  @HttpCode(204)
  async deleteForTest(@Param("id") id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
