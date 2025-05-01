import { Body, Controller, Delete, Get,  Param,  Post,  Put,  Req,  UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { TasksService } from './tasks.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';
import { UserRole } from '../users/users.entity';
import { CreateTaskDto } from './Create-task-dto'; // à créer
import { UpdateTaskDto } from './update-task.dto';
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findTasks(@Req() request: Request) {
    const user = request.user as any; // récupère l'utilisateur du token

    if (user.role === UserRole.ADMIN) {
      // Admin => retourne toutes les tâches
      return this.tasksService.findAll();
    } else {
      // User standard => retourne uniquement SES tâches
      return this.tasksService.findTasksByUser(user.userId);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createTask(@Req() request: Request, @Body() createTaskDto: CreateTaskDto) {
    const user = request.user as any;

    if (user.role === UserRole.ADMIN) {
      return this.tasksService.createTask(createTaskDto, createTaskDto.userId);
    }
    else {
      // Un utilisateur standard peut créer une tâche pour lui-même
      createTaskDto.userId = user.userId; // Assignation de l'utilisateur actuel à la tâche
      return this.tasksService.createTask(createTaskDto, user.userId);
    }
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    const user = request.user as any;
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteTask(
    @Param('id') id: number,
    @Req() request: Request
  ) {
    const user = request.user as any;
    return this.tasksService.deleteTask(id, user);
  }

}