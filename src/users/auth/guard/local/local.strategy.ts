import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../users.repository';
import { AuthService } from '../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any | Error> {
    const isValidUser = await this.authService.validateUser(username, password);

    if (!isValidUser) {
      throw new UnauthorizedException();
    }

    return isValidUser;
  }
}
