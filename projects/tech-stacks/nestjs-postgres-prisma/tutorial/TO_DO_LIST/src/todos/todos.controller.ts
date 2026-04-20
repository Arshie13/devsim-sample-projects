import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  async findAll() {
    const data = await this.todosService.findAll();
    return { success: true, data };
  }

  @Post()
  async create(@Body() dto: CreateTodoDto) {
    const data = await this.todosService.create(dto);
    return { success: true, data, message: 'Todo created.' };
  }

  @Patch(':id/toggle')
  async toggle(@Param('id', ParseIntPipe) id: number) {
    const data = await this.todosService.toggle(id);
    return { success: true, data, message: 'Todo updated.' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.todosService.remove(id);
    return { success: true, message: 'Todo deleted.' };
  }
}
