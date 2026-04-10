import type { UserRole } from "../user.model";

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash?: string;
}
