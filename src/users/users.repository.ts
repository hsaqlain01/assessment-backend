import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/users.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  private getUserByField(field: string, value: any) {
    return this.createQueryBuilder('users').where(`users.${field} = :value`, {
      value,
    });
  }

  public getUserByEmailOrUsername(email: string, username: string) {
    return this.createQueryBuilder('users')
      .where(`users.email = :email`, {
        email,
      })
      .orWhere(`users.username = :username`, {
        username,
      });
  }

  public getUserDetailsById(id: number) {
    return this.getUserByField('id', id);
  }

  public getUserByUsername(username: string) {
    return this.getUserByField('username', username);
  }
}
