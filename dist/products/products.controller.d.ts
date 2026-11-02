import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): import("./products.service").Product[];
    findOne(id: number): import("./products.service").Product;
    create(dto: CreateProductDto): import("./products.service").Product;
    update(id: number, dto: UpdateProductDto): import("./products.service").Product;
    remove(id: number): void;
}
