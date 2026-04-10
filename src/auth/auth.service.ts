import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { WRONG_PASSWORD_ERROR } from "./auth.constants";

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

  async login(email: string) {
    const payload = { email };
    return this.jwtService.signAsync(payload);
  }
}
