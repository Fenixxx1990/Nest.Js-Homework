import { IsString, MinLength, IsEmail, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "../user.model";
import { IsMyValidatePassword } from "../validators/password-validator.decorator";
import { USER_VALIDATION_MESSAGES } from "../user.constants";

export class CreateUserDto {
  @IsString({ message: USER_VALIDATION_MESSAGES.NAME_MUST_BE_STRING })
  @MinLength(2, { message: USER_VALIDATION_MESSAGES.NAME_MIN_LENGTH })
  name: string;

  @IsEmail({}, { message: USER_VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT })
  email: string;

  @IsMyValidatePassword({
    message: USER_VALIDATION_MESSAGES.PASSWORD_STRONG_REQUIREMENTS,
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: USER_VALIDATION_MESSAGES.ROLE_INVALID })
  role?: UserRole;
}
