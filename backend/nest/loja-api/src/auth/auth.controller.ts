import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou usuário já existente' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Realizar login na aplicação' })
  @ApiResponse({ status: 200, description: 'Login efetuado com sucesso, retorna o token de acesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Dados do perfil retornados com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado (token ausente ou inválido)' })
  async getProfile(@Req() req: any) {
    // Garante que apanha o ID independentemente de vir em 'id', 'sub' ou 'userId'
    const userId = req.user.id || req.user.sub || req.user.userId;
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('admin-dashboard')
  @ApiOperation({ summary: 'Acessar painel de administração (Apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Acesso permitido ao painel' })
  @ApiResponse({ status: 401, description: 'Não autorizado (sem token)' })
  @ApiResponse({ status: 403, description: 'Permissão insuficiente (requer perfil ADMIN)' })
  getAdminDashboard(@Req() req: any) {
    return {
      message: 'Bem-vindo ao painel de administração!',
      user: req.user,
    };
  }
}