import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      findByUsername: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user data if password matches', async () => {
      const mockUser = {
        username: 'john',
        password: await bcrypt.hash('password123', 10),
        _id: '1',
        role: 'admin',
      };

      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.validateUser('john', 'password123');
      expect(result).toEqual({
        _id: '1',
        username: 'john',
        role: 'admin',
      });
    });

    it('should return null if user not found', async () => {
      (usersService.findByUsername as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser('unknown', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const mockUser = {
        username: 'john',
        password: await bcrypt.hash('password123', 10),
        _id: '1',
        role: 'admin',
      };

      (usersService.findByUsername as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.validateUser('john', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access_token', async () => {
      const user = {
        username: 'john',
        _id: '1',
        role: 'admin',
      };

      (jwtService.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await authService.login(user);
      expect(result).toEqual({ access_token: 'mockToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'john',
        sub: '1',
        role: 'admin',
      });
    });
  });
});
