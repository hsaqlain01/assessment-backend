import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosRepository extends Repository<Todo> {
  constructor(private dataSource: DataSource) {
    super(Todo, dataSource.createEntityManager());
  }
  public getTodoListing(
    page: number = 1,
    limit: number = 10,
    userId: number
  ): Promise<[Todo[], number]> {
    const skip = (page - 1) * limit;
    let query = this.createQueryBuilder('todos')
      .select([
        'todos.id',
        'todos.title',
        'todos.description',
        'todos.completed',
        'todos.createdAt',
        'user.id',
        'user.username',
      ])
      .innerJoin('todos.user', 'user')
      .orderBy('todos.id', 'DESC')
      .where(`todos.userId = :userId`, {
        userId,
      })
      .skip(skip)
      .take(limit);

    return query.getManyAndCount();
  }

  public getTodoById(id: number) {
    return this.createQueryBuilder('todos').where(`todos.id = :id`, {
      id,
    });
  }
}
