import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateTodoDto) {
    const title = String(dto.title ?? '').trim();

    if (!title) {
      throw new BadRequestException('Title is required.');
    }

    if (title.length > 200) {
      throw new BadRequestException('Title must be 200 characters or less.');
    }

    return this.prisma.todo.create({
      data: { title },
    });
  }

  async toggle(id: number) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }

    return this.prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
    });
  }

  async remove(id: number) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }

    await this.prisma.todo.delete({ where: { id } });
  }
}
