import { Controller, Post, Get, Body, UseGuards, Request, UsePipes } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { loginSchema, LoginDto } from './dto/login.dto';
import { registerSchema, RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
        name: { type: 'string', example: 'John Doe' },
      },
      required: ['email', 'password', 'name'],
    },
  })
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the current authenticated user profile' })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
