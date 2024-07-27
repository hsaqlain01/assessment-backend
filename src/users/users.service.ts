import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './users.repository';
import { BaseService } from '../base/base.service';
import { User } from './entities/users.entity';
import { TransactionScope } from '../base/transactionScope';
import { ApiResponse, handleData } from 'src/helpers/handleResponse';
import { BcryptService } from 'src/services/bcrypt';
import { AuthService } from './auth/auth.service';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    private usersRepository: UserRepository,
    private bcryptService: BcryptService,
    private authService: AuthService,
  ) {
    super();
  }
  async commitTransaction(ts: TransactionScope) {
    await ts.commit();
  }
  async create(createUserDto: UserDto): Promise<ApiResponse<User>> {
    const existingUser = await this.usersRepository
      .getUserByEmail(createUserDto.email)
      .getOne();

    if (existingUser) {
      throw new BadRequestException('Email already exist');
    }

    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDto.password,
    );

    const payloadForCreate = {
      ...createUserDto,
      password: hashedPassword,
    };
    const user = new User(payloadForCreate as User);
    const transactionScope = this.getTransactionScope();
    transactionScope.add(user);

    await this.commitTransaction(transactionScope);

    const { password, ...userRecord } = user;
    return handleData(userRecord);
  }

  async login(user: User): Promise<ApiResponse<User>> {
    console.log('xx- user', user);

    const { access_token } = await this.authService.getToken(user);

    return handleData(user, 200, 'Login Successfully', access_token);
  }
}
