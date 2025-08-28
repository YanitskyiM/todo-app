import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TodoChange } from './todo-change.entity';
import { TodoAttachment } from './todo-attachment.entity';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TodoChange, todoChange => todoChange.todo)
  changes: TodoChange[];

  @OneToMany(() => TodoAttachment, attachment => attachment.todo)
  attachments: TodoAttachment[];
}
