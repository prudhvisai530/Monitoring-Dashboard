import {
    Controller,
    Post,
    Body,
    BadRequestException,
    InternalServerErrorException,
    HttpException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';

@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) { }

    @Post('signup')
    async signup(@Body() dto: CreateUserDto) {
        try {
            await this.userService.create(dto);
            return { status: 'ok', message: "User created successfully" }
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
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('Login failed. Please try again.');
        }
    }
}
