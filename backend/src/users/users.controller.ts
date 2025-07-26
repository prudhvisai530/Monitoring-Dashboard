import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    try {
      const user = await this.userService.create(dto);
      return this.authService.login(user);
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'Signup failed. Please try again.',
      );
    }
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        body.username,
        body.password,
      );
      if (!user) {
        throw new BadRequestException('Invalid username or password');
      }
      return this.authService.login(user);
    } catch (error) {
      throw new InternalServerErrorException('Login failed. Please try again.');
    }
  }
}
