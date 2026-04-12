import { UserService } from "@/user/user.service";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login.dto";
import { CreateUserDto } from "@/user/dto/create-user.dto";
import { AUTH_UNSUCCESS_ERROR } from "./auth.constants";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @UsePipes(new ValidationPipe())
  @Post("register")
  async register(@Body() dto: CreateUserDto) {
    const newUser = await this.userService.create(dto);
    const token = await this.authService.login(newUser);
    return { ...newUser, token };
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async login(@Body() { email, password }: LoginUserDto) {
    const user = await this.userService.findByEmailForLogin(email);
    if (!user.passwordHash) {
      throw new BadRequestException(AUTH_UNSUCCESS_ERROR);
    }
    const validate = await this.authService.validateUser(password, user.passwordHash);
    if (validate) {
      return this.authService.login(user);
    }
    throw new BadRequestException(AUTH_UNSUCCESS_ERROR);
  }
}
