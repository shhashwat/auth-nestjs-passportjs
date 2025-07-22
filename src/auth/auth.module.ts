import { Module, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategies';
import { JwtStrategy } from './strategies/jwt.strategies';
dotenv.config();

const privateKey = process.env.JWT_PRIVATE_KEY_PATH;
const publicKey = process.env.JWT_PUBLIC_KEY_PATH;

if (!privateKey || !publicKey) {
  throw new NotFoundException('JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH must be set in the environment variables.');
}

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      privateKey: fs.readFileSync(privateKey),
      publicKey: fs.readFileSync(publicKey),
      signOptions: { algorithm: 'ES256', expiresIn: '1d' },
    }),
    PassportModule
  ],
})

export class AuthModule {}
