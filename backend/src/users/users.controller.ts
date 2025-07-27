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
import { writeFile } from 'fs/promises';
import { join } from 'path';

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
            this.logger.log("Request for user creation")
            await this.userService.create(dto);
            this.logger.log("User creation successfull")
            return { status: 'ok', message: "User created successfully" }
        } catch (error) {
            this.logger.error("Request failed", error.message)
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
            this.logger.log("Requestfor user login")
            const user = await this.authService.validateUser(
                body.username,
                body.password,
            );
            if (!user) {
                this.logger.error('User not found')
                throw new BadRequestException('Invalid username or password');
            }
            this.logger.log('User fund')
            const result = await this.authService.login(user);

            const accessToken = result?.access_token;

            if (accessToken) {
                this.logger.log("Login Successfull")
                const filePath = join(__dirname, '../../access_token.txt');
                await writeFile(filePath, accessToken, { encoding: 'utf8' });
                this.logger.log(`Access token written to ${filePath}`);
            }
            return result
        } catch (error) {
            this.logger.error('Login Failed')
            if (error instanceof HttpException) {
                throw error;
            }
            console.log(error)
            throw new InternalServerErrorException('Login failed. Please try again.');
        }
    }
}
