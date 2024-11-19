import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ValidRoles } from './interfaces/valid-roles';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // USER++
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  // USER++
  @Get('login')
  login(@Query() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  // USER++
  @Get('getUserData')
  @Auth()
  getUserData(@GetUser() user: User) {
    return this.authService.getUserData(user);
  }
  // USER
  @Get('checkAuthStatus')
  @Auth(ValidRoles.admin,ValidRoles.user)
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
