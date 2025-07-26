import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/users.schema';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const { username, password, role } = createUserDto;

            const existingUser = await this.userModel.findOne({ username });
            if (existingUser) {
                throw new BadRequestException('Username already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new this.userModel({
                username,
                password: hashedPassword,
                role,
            });
            return await user.save();
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async findByUsername(username: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ username });
            if (!user) throw new NotFoundException('User not found');
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch user');
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.userModel.find();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch users');
        }
    }
}
