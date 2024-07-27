import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTodoDto, UpdateTodoDto } from "./dto/todos.dto";
import { User } from "../users/entities/users.entity";
import { BaseService } from "../base/base.service";
import { TransactionScope } from "../base/transactionScope";
import { handleData, paginatedResponse } from "../helpers/handleResponse";
import { Todo } from "./entities/todo.entity";
import { TodosRepository } from "./todo.repository";
import { CommonDtos } from "../common/dto";

@Injectable()
export class TodoService extends BaseService {
  constructor(private todosRepository: TodosRepository) {
    super();
  }

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

    // Commit transaction if needed, ensure your getTransactionScope() handles transactions properly
    await this.commitTransaction(transactionScope);

    return handleData(todoRecord);
  }

  async getTodoListing(query: CommonDtos.PaginationInput) {
    const [data, totalRecords] = await this.todosRepository.getTodoListing(
      query.page,
      query.limit
    );

    const response = {
      ...paginatedResponse(totalRecords, query, data),
      data,
    };
    return handleData(response);
  }

  async updateTodo(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todosRepository.geTodoById(id).getOne();
    console.log("xx- todo", todo);

    if (!todo) {
      throw new BadRequestException("Todo not found");
    }

    // Update category properties
    Object.assign(todo, updateTodoDto);

    const transactionScope = this.getTransactionScope();
    transactionScope.update(todo);

    await this.commitTransaction(transactionScope);
    return handleData(todo);
  }

  async deleteTodo(id: number) {
    const todo = await this.todosRepository.geTodoById(id).getOne();
    if (!todo) {
      throw new BadRequestException("Todo not found");
    }

    const transactionScope = this.getTransactionScope();

    transactionScope.hardDelete(todo);
    await this.commitTransaction(transactionScope);
    return handleData(todo);
  }
}
