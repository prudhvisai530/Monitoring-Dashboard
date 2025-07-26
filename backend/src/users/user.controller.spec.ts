import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/enum/role.enum';

describe('UserController', () => {
  let controller: UserController;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      create: jest.fn(),
    };

    authService = {
      login: jest.fn(),
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should signup user and return access token', async () => {
    const mockDto = { username: 'test', password: 'pass123', role: Role.Admin };
    const mockUser = { id: 1, username: 'test' };
    const mockToken = { accessToken: 'token123' };

    userService.create!.mockResolvedValue(mockUser);
    authService.login!.mockResolvedValue(mockToken);

    const result = await controller.signup(mockDto);
    expect(userService.create).toHaveBeenCalledWith(mockDto);
    expect(authService.login).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockToken);
  });

  it('should throw BadRequestException for validation error during signup', async () => {
    const mockDto = { username: 'test', password: 'pass123', role: Role.Admin };
    const validationError = new Error('Validation failed');
    (validationError as any).name = 'ValidationError';

    userService.create!.mockRejectedValue(validationError);

    await expect(controller.signup(mockDto)).rejects.toThrow(
      'Validation failed',
    );
  });

  it('should throw InternalServerErrorException for unknown error during signup', async () => {
    const mockDto = { username: 'test', password: 'pass123', role: Role.Admin };
    const genericError = new Error('Some DB error');

    userService.create!.mockRejectedValue(genericError);

    await expect(controller.signup(mockDto)).rejects.toThrow(
      'Signup failed. Please try again.',
    );
  });
});
