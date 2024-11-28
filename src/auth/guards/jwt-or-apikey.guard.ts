import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOrApiKeyAuthGuard extends AuthGuard(['jwt', 'api-key']) {}
