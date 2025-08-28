import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Todo } from './todo.entity';

export enum ChangeType {
  CREATED = 'created',
  TITLE_UPDATED = 'title_updated',
  STATUS_UPDATED = 'status_updated',
  DELETED = 'deleted',
  ATTACHMENT_ADDED = 'attachment_added',
  ATTACHMENT_DELETED = 'attachment_deleted'
}

@Entity('todo_changes')
export class TodoChange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  todoId: string;

  @ManyToOne(() => Todo, todo => todo.changes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todoId' })
  todo: Todo;

  @Column({
    type: 'varchar', // Changed from 'enum' to 'varchar' for SQLite compatibility
    length: 50,
  })
  changeType: ChangeType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  previousValue: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  newValue: string;

  @CreateDateColumn()
  createdAt: Date;
}
