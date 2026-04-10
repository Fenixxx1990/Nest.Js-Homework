import { IsOptional, IsString, MinLength, IsEmail } from "class-validator";
import { USER_VALIDATION_MESSAGES } from "../user.constants";
import { IsMyValidatePassword } from "../validators/password-validator.decorator";

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: USER_VALIDATION_MESSAGES.NAME_MUST_BE_STRING })
  @MinLength(2, { message: USER_VALIDATION_MESSAGES.NAME_MIN_LENGTH })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: USER_VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT })
  email?: string;

  @IsOptional()
  @IsString({ message: USER_VALIDATION_MESSAGES.PHONE_NUMBER_MUST_BE_STRING })
  phoneNumber?: string;

  @IsOptional()
  @IsMyValidatePassword({
    message: USER_VALIDATION_MESSAGES.PASSWORD_STRONG_REQUIREMENTS,
  })
  password?: string;
}
