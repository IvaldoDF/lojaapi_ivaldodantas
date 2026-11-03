import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CatalogService {
  constructor(private readonly productsService: ProductsService) {}

  async getSummary() {
    const products = await this.productsService.findAll();

    const totalProducts = products.length;
    const totalStockUnits = products.reduce((acc: number, product: any) => acc + product.stock, 0);

    return {
      totalProducts,
      totalStockUnits,
    };
  }
}