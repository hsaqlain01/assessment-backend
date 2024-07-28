import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../users.repository';
import { BcryptService } from 'src/services/bcrypt';
import { User } from '../entities/users.entity';
import { responseMessage } from 'src/helpers/responseMessage';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private bcryptService: BcryptService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user: User = await this.userRepository
      .getUserByUsername(username)
      .getOne();
    if (!user) {
      throw new BadRequestException(responseMessage.INVALID_USER_CREDENTIALS);
    }

    const doesPasswordCompanre = await this.bcryptService.compareHashPassword(
      pass,
      user.password
    );

    if (!doesPasswordCompanre) {
      throw new BadRequestException(responseMessage.INVALID_USER_CREDENTIALS);
    }

    const { password, ...userDetails } = user;
    return userDetails;
  }

  async getToken(user: User) {
    try {
      const payload = {
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        id: user.id,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
