import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { PassportModule } from '@nestjs/passport';
import { User } from '../entities/users.entity';
import { UsersService } from '../users.service';
import { UserRepository } from '../users.repository';
import { LocalStrategy } from './guard/local/local.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guard/jwt/jwt.strategy';
import { BcryptService } from '../../services/bcrypt';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6h' },
    }),
    PassportModule,
    User,
  ],
  providers: [
    UsersService,
    UserRepository,
    LocalStrategy,
    AuthService,
    JwtStrategy,
    BcryptService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
