import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Post('admin/create-admin')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createUser(dto.email, dto.password, 'admin');
  }

  @Throttle({ default: { limit: 20, ttl: 60 } })
  @Post('admin/create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto.email, dto.password, 'user');
  }

  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
