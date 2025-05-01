import {Entity,Column, PrimaryGeneratedColumn,OneToMany,} from 'typeorm';
  import { Task } from '../tasks/tasks.entity';
  
  export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
  }
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;
  
    @OneToMany(() => Task, task => task.user)
    tasks: Task[];

    @Column({ nullable: true })
    refreshToken: string; 
  }
  