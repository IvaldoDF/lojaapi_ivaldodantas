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
  findAll(@Query('q') q?: string): Product[] {
    if (q) {
      return this.products.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase()),
      );
    }
    return this.products;
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
  create(@Body() body: { name: string; price: number; stock: number }): Product {
    const product: Product = {
      id: this.nextId++,
      name: body.name,
      price: body.price,
      stock: body.stock,
    };
    this.products.push(product);
    return product;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name: string; price: number; stock: number },
  ): Product {
    const product = this.findOne(id);
    product.name = body.name;
    product.price = body.price;
    product.stock = body.stock;
    return product;
  }

  @Patch(':id')
  updatePartial(
    @Param('id') id: string,
    @Body() body: { name?: string; price?: number; stock?: number },
  ): Product {
    const product = this.findOne(id);

    if (body.name !== undefined) {
      product.name = body.name;
    }
    if (body.price !== undefined) {
      product.price = body.price;
    }
    if (body.stock !== undefined) {
      product.stock = body.stock;
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