import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Todo } from './todo.entity';

@Entity('todo_attachments')
export class TodoAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  todoId: string;

  @ManyToOne(() => Todo, todo => todo.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todoId' })
  todo: Todo;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  originalFilename: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'integer' })
  size: number;

  @Column({ type: 'varchar', length: 500 })
  path: string;

  @CreateDateColumn()
  createdAt: Date;
}
