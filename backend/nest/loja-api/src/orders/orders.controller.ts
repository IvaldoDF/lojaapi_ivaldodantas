import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado (sem token ou token inválido)' })
  create(
    @Req() req: { user: { userId: number } },
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(dto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar pedidos do usuário/ator logado' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(@Req() req: { user: { userId: number; role: string } }) {
    return this.ordersService.findAllForActor(req.user.userId, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buscar detalhes de um pedido por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do pedido retornados' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  findOne(
    @Req() req: { user: { userId: number; role: string } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.findOneForActor(id, req.user.userId, req.user.role);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancelar um pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido cancelado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão para cancelar este pedido' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  cancel(
    @Req() req: { user: { userId: number; role: string } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.cancelForActor(id, req.user.userId, req.user.role);
  }
}