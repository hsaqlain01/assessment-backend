import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todos.dto';
import { JwtAuthGuard } from 'src/users/auth/guard/jwt/jwt-auth.guard';
import { CommonDtos } from 'src/common/dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createTodoDto: CreateTodoDto) {
    try {
      return this.todoService.create(req.user, createTodoDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('listing')
  @UseGuards(JwtAuthGuard)
  getTodoListing(@Request() req, @Query() query: CommonDtos.PaginationInput) {
    try {
      return this.todoService.getTodoListing(req.user, query);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateTodo(@Param('id') id, @Body() updateTodoDto: UpdateTodoDto) {
    try {
      return this.todoService.updateTodo(+id, updateTodoDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getTodoById(@Param('id') id) {
    try {
      return this.todoService.getTodoById(+id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteTodo(@Param('id') id) {
    try {
      return this.todoService.deleteTodo(+id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
