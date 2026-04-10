import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { IAuthUser, RequestWithUser } from "../interface/authUser.interface";
import { USER_VALIDATION_MESSAGES } from "../user.constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если роли не указаны, доступ разрешён
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user: IAuthUser | undefined = request.user;

    // Проверяем существование пользователя и его роли
    if (!user || !user.role) {
      throw new ForbiddenException(USER_VALIDATION_MESSAGES.NOT_ACCESS_PROFILE_ERROR);
    }

    // Регистронезависимое сравнение ролей
    const hasRole = requiredRoles.some(
      (role: string) => String(user.role).toLowerCase() === role.toLowerCase()
    );

    if (!hasRole) {
      throw new ForbiddenException(USER_VALIDATION_MESSAGES.NOT_ACCESS_PROFILE_ERROR);
    }

    return true;
  }
}
