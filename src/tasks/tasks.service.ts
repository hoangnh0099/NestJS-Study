import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid/v4';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/getTasksFilter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: number): Task {
    const found = this.tasks.find(task => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} is not found`);
    }

    return found;
  }

  deleteTaskById(id: number): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter(item => item.id !== found.id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: this.tasks.length + 1,
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: number, status: TaskStatus) {
    const task = this.getTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} is not found`);
    }

    task.status = status;
    return task;
  }
}
