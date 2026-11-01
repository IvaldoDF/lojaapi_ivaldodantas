import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  HttpCode,
  Query,
  Patch,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PatchProductDto } from './dto/patch-product.dto';
import { ListProductsQueryDto } from './dto/list-products-query.dto';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

@Controller('products')
export class ProductsController {
  private products: Product[] = [];
  private nextId = 1;

  //@Get()
  //findAll(): Product[] {
  //  return this.products;
  //}

  @Get()
findAll(@Query() query: ListProductsQueryDto): Product[] {
  let result = this.products;

  // Filtro por nome (q)
  if (query.q) {
    const searchTerm = query.q.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(searchTerm));
  }

  // Filtro por preço mínimo (minPrice)
  if (query.minPrice !== undefined) {
    result = result.filter((p) => p.price >= query.minPrice!);
  }

  // Filtro por preço máximo (maxPrice)
  if (query.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= query.maxPrice!);
  }

  return result;
}

  @Get(':id')
  findOne(@Param('id') id: string): Product {
    const product = this.products.find((p) => p.id === Number(id));
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    return product;
  }

  @Post()
  create(@Body() dto: CreateProductDto): Product {
    const product: Product = {
      id: this.nextId++,
      name: dto.name,
      price: dto.price,
      stock: dto.stock,
    };
    this.products.push(product);
    return product;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Product {
    const product = this.findOne(id);
    product.name = dto.name;
    product.price = dto.price;
    product.stock = dto.stock;
    return product;
  }

  @Patch(':id')
  updatePartial(
    @Param('id') id: string,
    @Body() dto: PatchProductDto,
  ): Product {
    const product = this.findOne(id);

    if (dto.name !== undefined) {
      product.name = dto.name;
    }
    if (dto.price !== undefined) {
      product.price = dto.price;
    }
    if (dto.stock !== undefined) {
      product.stock = dto.stock;
    }

    return product;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    const index = this.products.findIndex((p) => p.id === Number(id));
    if (index < 0) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    this.products.splice(index, 1);
  }
}