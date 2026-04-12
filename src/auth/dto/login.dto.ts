import { USER_VALIDATION_MESSAGES } from "@/user/user.constants";
import { IsMyValidatePassword } from "@/user/validators/password-validator.decorator";
import { IsEmail } from "class-validator";

export class LoginUserDto {
  @IsEmail({}, { message: USER_VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT })
  email: string;

  @IsMyValidatePassword({
    message: USER_VALIDATION_MESSAGES.PASSWORD_STRONG_REQUIREMENTS,
  })
  password: string;
}
