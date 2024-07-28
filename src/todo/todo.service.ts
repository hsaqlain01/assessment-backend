import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { TransactionScope } from '../base/transactionScope';
import { User } from '../users/entities/users.entity';
import { Todo } from './entities/todo.entity';
import { TodosRepository } from './todo.repository';
import { CommonDtos } from '../common/dto';
import { CreateTodoDto, UpdateTodoDto } from './dto/todos.dto';
import { handleData, paginatedResponse } from '../helpers/handleResponse';
import { responseCode } from '../helpers/responseCode';

@Injectable()
export class TodoService extends BaseService {
  constructor(private todosRepository: TodosRepository) {
    super();
  }

  // Commit transaction if needed
  async commitTransaction(ts: TransactionScope) {
    await ts.commit();
  }
  async create(user: User, createTodoDto: CreateTodoDto) {
    const todoRecord = new Todo({
      ...createTodoDto,
      user: user as User,
    } as Todo);

    const transactionScope = this.getTransactionScope();
    transactionScope.add(todoRecord);

    await this.commitTransaction(transactionScope);

    return handleData(todoRecord, responseCode.CREATED);
  }

  async getTodoListing(query: CommonDtos.PaginationInput) {
    const [data, totalRecords] = await this.todosRepository.getTodoListing(
      query.page,
      query.limit
    );

    const response = {
      pagination: paginatedResponse(totalRecords, query, data),
      data,
    };
    return handleData(response);
  }

  async updateTodo(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todosRepository.geTodoById(id).getOne();

    if (!todo) {
      throw new BadRequestException('Todo not found');
    }

    // Update todo properties
    Object.assign(todo, updateTodoDto);

    const transactionScope = this.getTransactionScope();
    transactionScope.update(todo);

    await this.commitTransaction(transactionScope);
    return handleData(todo);
  }

  async deleteTodo(id: number) {
    const todo = await this.todosRepository.geTodoById(id).getOne();
    if (!todo) {
      throw new BadRequestException('Todo not found');
    }

    const transactionScope = this.getTransactionScope();

    transactionScope.hardDelete(todo);
    await this.commitTransaction(transactionScope);
    return handleData(todo);
  }
}
