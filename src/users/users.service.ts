import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthResponse, UserDto } from './dto/user.dto';
import { UserRepository } from './users.repository';
import { BaseService } from '../base/base.service';
import { User } from './entities/users.entity';
import { TransactionScope } from '../base/transactionScope';
import { BcryptService } from '../services/bcrypt';
import { AuthService } from './auth/auth.service';
import { ApiResponse, handleData } from '../helpers/handleResponse';
import { responseMessage } from '../helpers/responseMessage';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    private usersRepository: UserRepository,
    private bcryptService: BcryptService,
    private authService: AuthService
  ) {
    super();
  }
  async commitTransaction(ts: TransactionScope) {
    await ts.commit();
  }
  async create(createUserDto: UserDto): Promise<ApiResponse<AuthResponse>> {
    const existingUser = await this.usersRepository
      .getUserByEmailOrUsername(createUserDto.email, createUserDto.username)
      .getOne();

    if (existingUser) {
      throw new BadRequestException(
        `Email or username ${responseMessage.ALREADY_EXIST}`
      );
    }

    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDto.password
    );

    const payloadForCreate = {
      ...createUserDto,
      password: hashedPassword,
    };
    const user = new User(payloadForCreate as User);
    const transactionScope = this.getTransactionScope();
    transactionScope.add(user);

    await this.commitTransaction(transactionScope);
    const { access_token } = await this.authService.getToken(user);

    const { password, ...userRecord } = user;
    return handleData(
      { user: userRecord, access_token },
      responseMessage.SUCCESS,
      HttpStatus.CREATED
    );
  }

  async login(user: User): Promise<ApiResponse<AuthResponse>> {
    const { access_token } = await this.authService.getToken(user);

    const response = { user, access_token };
    return handleData(response, responseMessage.SIGNED_IN);
  }
}
