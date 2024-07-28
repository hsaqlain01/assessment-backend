import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../entities/users.entity';

export class LoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class UserDto extends LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export interface AuthResponse {
  user: User;

  access_token: string;
}
