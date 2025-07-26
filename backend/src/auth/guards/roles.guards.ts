import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;

        const { user } = req;

        if (!roles || !user) {
            return false;
        }

        return roles.includes(user.role);
    }
}
