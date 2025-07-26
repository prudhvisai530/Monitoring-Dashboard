import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Role } from '../../auth/enum/role.enum';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Transform(({ value }) => value?.toLowerCase())
  @IsEnum(['user', 'admin'], {
    message: 'Role must be either "user" or "admin"',
  })
  role: Role;
}
