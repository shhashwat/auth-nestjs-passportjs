import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

interface JwtPayload {
  sub: string;
  username: string;
}

declare module 'express' {
  interface Request {
    user?: {
      userId: string;
      username: string;
    };
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authorization: string | undefined = request.headers.authorization; //Bearer <token>
        const token: string | undefined = authorization?.split(' ')[1];

        if (!token) throw new UnauthorizedException();

        try {
            const tokenPayload = await this.jwtService.verifyAsync<JwtPayload>(token);
            request.user = {
                userId: tokenPayload.sub,
                username: tokenPayload.username
            }
            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}