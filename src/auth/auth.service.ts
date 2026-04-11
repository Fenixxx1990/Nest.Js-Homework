import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { WRONG_PASSWORD_ERROR } from "./auth.constants";
import { UserResponseDto } from "@/user/dto/user.response.dto";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(password: string, passwordHash: string) {
    const isCorrectPassword = await compare(password, passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return true;
  }

  async login({ id, email, role }: UserResponseDto) {
    const payload = { id, email, role };
    return this.jwtService.signAsync(payload);
  }
}
