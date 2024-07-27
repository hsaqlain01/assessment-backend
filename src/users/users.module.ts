import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { BcryptService } from '../services/bcrypt';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constant';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6h' },
    }),
    PassportModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, BcryptService, AuthService],
})
export class UsersModule {}
