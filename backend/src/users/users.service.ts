import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/users.schema';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const { username, password, role } = createUserDto;

            const existingUser = await this.userModel.findOne({ username });
            if (existingUser) {
                this.logger.error("User alredy exists!!")
                throw new BadRequestException('Username already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new this.userModel({
                username,
                password: hashedPassword,
                role,
            });
            this.logger.log('user created back to the controller')
            return await user.save();
        } catch (error) {
            this.logger.error('Something went wrong!!!')
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async findByUsername(username: string): Promise<User> {
        try {
            this.logger.log('Feching user in DB')
            const user = await this.userModel.findOne({ username });
            if (!user) {
                this.logger.error('User not available in db')
                throw new NotFoundException('User not found');
            }
            this.logger.log('User found back to controller')
            return user;
        } catch (error) {
            this.logger.error('Something went wrong')
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch user');
        }
    }

    async findAll(): Promise<User[]> {
        try {
            this.logger.log("fetching from DB")
            return await this.userModel.find();
        } catch (error) {
            this.logger.error('Something went wong')
            throw new InternalServerErrorException('Failed to fetch users');
        }
    }
}
