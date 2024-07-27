import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodosRepository } from './todo.repository';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodosRepository],
})
export class TodoModule {}
