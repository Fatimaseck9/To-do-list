import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { UpdateTaskDto } from './update-task.dto';
import { CreateTaskDto } from './Create-task-dto';

@Injectable()
export class TasksService {
  create(createTaskDto: any, userId: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['user'] });
  }

  async findTasksByUser(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  //async createTask(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    //const task = this.tasksRepository.create({
     // ...createTaskDto,
     // user: { id: userId },
   // });
   //// return this.tasksRepository.save(task);
 // }
 async createTask(createTaskDto: CreateTaskDto, creatorId: number, targetUserId?: number): Promise<Task> {
  // Créer la tâche en fonction de l'utilisateur qui l'a créée
  const task = this.tasksRepository.create({
      ...createTaskDto,
      user: { id: targetUserId || creatorId }, // Utiliser targetUserId si fourni (admin), sinon utiliser creatorId (utilisateur standard)
  });
  
  return this.tasksRepository.save(task);
}


  async updateTask(taskId: number, updateTaskDto: UpdateTaskDto, user: any): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (user.role !== 'admin' && task.user.id !== user.userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cette tâche');
    }

    Object.assign(task, updateTaskDto);

    return this.tasksRepository.save(task);
  }

  async deleteTask(taskId: number, user: any): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (user.role !== 'admin' && task.user.id !== user.userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer cette tâche');
    }

    await this.tasksRepository.delete(taskId);
  }
}
