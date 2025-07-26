import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Role } from '../auth/enum/role.enum';

describe('UserService', () => {
    let service: UserService;
    let userModel: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        create: jest.fn(),
                        prototype: {
                            save: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userModel = module.get(getModelToken(User.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create()', () => {
        it('should throw BadRequestException if user exists', async () => {
            const dto = { username: 'existing', password: '123456', role: Role.User };
            jest
                .spyOn(userModel, 'findOne')
                .mockResolvedValue({ username: 'existing' });

            await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalServerErrorException on other errors', async () => {
            const dto = { username: 'test', password: '123456', role: Role.User };
            jest.spyOn(userModel, 'findOne').mockRejectedValue(new Error('DB down'));

            await expect(service.create(dto)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('findByUsername()', () => {
        it('should return user if found', async () => {
            const user = { username: 'test' };
            jest.spyOn(userModel, 'findOne').mockResolvedValue(user);

            const result = await service.findByUsername('test');
            expect(result).toEqual(user);
        });

        it('should throw NotFoundException if user not found', async () => {
            jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

            await expect(service.findByUsername('unknown')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw InternalServerErrorException on DB error', async () => {
            jest
                .spyOn(userModel, 'findOne')
                .mockRejectedValue(new Error('Mongo crash'));

            await expect(service.findByUsername('fail')).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('findAll()', () => {
        it('should return list of users', async () => {
            const users = [{ username: 'a' }, { username: 'b' }];
            jest.spyOn(userModel, 'find').mockResolvedValue(users);

            const result = await service.findAll();
            expect(result).toEqual(users);
        });

        it('should throw InternalServerErrorException on DB error', async () => {
            jest.spyOn(userModel, 'find').mockRejectedValue(new Error('error'));

            await expect(service.findAll()).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });
});
