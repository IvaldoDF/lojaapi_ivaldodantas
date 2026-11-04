import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar produto (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Criado' })
  @ApiResponse({ status: 401, description: 'Sem token' })
  @ApiResponse({ status: 403, description: 'Papel insuficiente' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto (ADMIN / MANAGER)' })
  @ApiResponse({ status: 200, description: 'Atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Sem token' })
  @ApiResponse({ status: 403, description: 'Papel insuficiente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover produto (ADMIN)' })
  @ApiResponse({ status: 204, description: 'Removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Sem token' })
  @ApiResponse({ status: 403, description: 'Papel insuficiente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}