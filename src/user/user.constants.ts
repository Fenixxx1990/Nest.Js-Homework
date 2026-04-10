export const USER_VALIDATION_MESSAGES = {
  NOT_FOUND_EMAIL_ERROR: "Пользователь с таким email не найден",
  NOT_FOUND_ID_ERROR: "Пользователь с таким ID не найден",
  EXISTED_EMAIL_ERROR: "Пользователь с таким email уже существует",
  NAME_MUST_BE_STRING: "Имя должно быть строкой",
  NAME_MIN_LENGTH: "Имя должно содержать не менее 2 символов",
  INVALID_EMAIL_FORMAT: "Некорректный формат email",
  PASSWORD_STRONG_REQUIREMENTS:
    "Пароль должен содержать не менее 6 символов, включать хотя бы одну цифру, одну букву и одну заглавную букву",
  ROLE_INVALID: 'Роль должна быть либо "admin", либо "user"',
  PHONE_NUMBER_MUST_BE_STRING: "Номер телефона должен быть строкой",
  NOT_ACCESS_PROFILE_ERROR:
    "Доступ запрещён: вы можете редактировать только собственный профиль либо должны обладать правами администратора",
} as const;
