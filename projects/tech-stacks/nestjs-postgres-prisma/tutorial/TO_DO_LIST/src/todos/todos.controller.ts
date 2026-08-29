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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  async findAll() {
    const data = await this.todosService.findAll();
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBody({ type: CreateTodoDto })
  async create(@Body() dto: CreateTodoDto) {
    const data = await this.todosService.create(dto);
    return { success: true, data, message: 'Todo created.' };
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle todo completion status' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID', example: 1 })
  async toggle(@Param('id', ParseIntPipe) id: number) {
    const data = await this.todosService.toggle(id);
    return { success: true, data, message: 'Todo updated.' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID', example: 1 })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.todosService.remove(id);
    return { success: true, message: 'Todo deleted.' };
  }
}
