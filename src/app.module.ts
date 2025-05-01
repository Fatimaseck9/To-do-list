/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Task } from './tasks/tasks.entity';



@Module({
  imports: [
  
    TypeOrmModule.forRoot({
    
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'todolist',
      entities: [User,Task],
      autoLoadEntities: true, // détecte automatiquement les entités déclarées dans les autres modules
      synchronize: true, // crée les tables automatiquement
    }),
    AuthModule,
    UsersModule,
    TasksModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
