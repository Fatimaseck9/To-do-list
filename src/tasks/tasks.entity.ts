import {Entity,Column,PrimaryGeneratedColumn,ManyToOne, } from 'typeorm';
  import { User } from '../users/users.entity';
  
  @Entity()
  export class Task {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column({ default: false })
    completed: boolean;
  
    @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
    user: User;
  }
  