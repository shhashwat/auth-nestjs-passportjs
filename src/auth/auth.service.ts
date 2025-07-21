import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

export type AuthInput = { username: string; password: string };
export type SignInData = { userId: number; username: string };
export type AuthResult = { accessToken: string; userId: number; username: string };

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async authenticate(input: AuthInput): Promise<AuthResult>{
        const user = await this.validateUser(input);
        if (!user) throw new UnauthorizedException();

        return await this.signIn(user);
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.usersService.findUserByName(input.username);
        if (user && user.password === input.password) {
            return { userId: user.userId, username: user.username };
        }
        return null;
    }

    async signIn(user: SignInData): Promise<AuthResult> {
        const tokenPayload = {
            sub: user.userId,
            username: user.username
        };

        const accessToken = this.jwtService.signAsync(tokenPayload);

        return {
            accessToken: await accessToken,
            userId: user.userId,
            username: user.username
        };
    }
}
