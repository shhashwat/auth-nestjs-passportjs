import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;
if (!publicKeyPath) {
  throw new NotFoundException('JWT_PUBLIC_KEY_PATH must be set in the environment variables.');
}
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: publicKey,
            algorithms: ['ES256']
        })
    };

    async validate(payload: { sub: string; username: string }): Promise<{ userId: string; username: string }> {
        return { userId: payload.sub, username: payload.username };
    }
}
