import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PasswordJwtGuard } from './guards/password-jwt.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UseGuards(PassportLocalGuard)
    login(@Request() request): Record<string, any> {
      return this.authService.signIn(request.user);
    }

    @Get('me')
    @UseGuards(PasswordJwtGuard)
    getUserInfo(@Request() request: any): Record<string, any> {
      return request.user;
    }
}
