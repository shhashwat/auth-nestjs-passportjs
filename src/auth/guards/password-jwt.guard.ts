import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class PasswordJwtGuard extends AuthGuard('jwt') {}