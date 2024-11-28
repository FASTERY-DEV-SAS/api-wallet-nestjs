import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { JwtOrApiKeyAuthGuard } from '../guards/jwt-or-apikey.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    // UseGuards(AuthGuard(), UserRoleGuard),
    UseGuards(JwtOrApiKeyAuthGuard, UserRoleGuard),
  );
}
