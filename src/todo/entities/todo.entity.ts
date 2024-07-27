import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '../../base/entityBase';
import { User } from 'src/users/entities/users.entity';

@Entity({ name: 'todos' })
export class Todo extends EntityBase {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'description', type: 'varchar' })
  description: string;

  @Column({ name: 'completed', type: 'tinyint', default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
