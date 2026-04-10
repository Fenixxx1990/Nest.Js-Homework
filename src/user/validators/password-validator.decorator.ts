import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { USER_VALIDATION_MESSAGES } from "../user.constants";

export function IsMyValidatePassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isMyValidatePassword",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          // Проверяем, что значение существует и является строкой
          if (!value || typeof value !== "string") {
            return false;
          }

          // Минимум 6 символов
          if (value.length < 6) return false;
          // Хотя бы одна цифра
          if (!/[0-9]/.test(value)) return false;
          // Хотя бы одна буква (любого регистра)
          if (!/[a-zA-Z]/.test(value)) return false;
          // Хотя бы одна заглавная буква
          if (!/[A-Z]/.test(value)) return false;

          return true;
        },
        defaultMessage(): string {
          return USER_VALIDATION_MESSAGES.PASSWORD_STRONG_REQUIREMENTS;
        },
      },
    });
  };
}
