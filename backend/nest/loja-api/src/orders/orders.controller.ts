import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: { user: { userId: number } },
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(dto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: { user: { userId: number; role: string } }) {
    return this.ordersService.findAllForActor(req.user.userId, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Req() req: { user: { userId: number; role: string } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.findOneForActor(id, req.user.userId, req.user.role);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(
    @Req() req: { user: { userId: number; role: string } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.cancelForActor(id, req.user.userId, req.user.role);
  }
}