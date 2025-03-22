import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from "./roles.decorator";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}  
    
    canActivate(context: ExecutionContext): boolean  {
        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
        if(!requiredRoles){
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log("user=>", user)
        if(!user || !user.role || !requiredRoles.includes(user.role)){
            throw new ForbiddenException('You do not have permission to perform this action.');
        }

        return true;
        
    }
}