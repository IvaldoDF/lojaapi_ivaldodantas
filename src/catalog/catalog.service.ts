import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CatalogService {
  constructor(private readonly productsService: ProductsService) {}

  getSummary() {
    const products = this.productsService.findAll();

    const totalProducts = products.length;
    const totalStockUnits = products.reduce((acc, product) => acc + product.stock, 0);

    return {
      totalProducts,
      totalStockUnits,
    };
  }
}