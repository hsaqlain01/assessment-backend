import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsOptional()
  description: string;
}

export class UpdateTodoDto extends CreateTodoDto {
  completed: string;
}
