import { ProductsService } from '../products/products.service';
export declare class CatalogService {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getSummary(): {
        totalProducts: number;
        totalStockUnits: number;
    };
}
