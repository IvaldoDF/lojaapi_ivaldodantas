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
export declare class ProductsController {
    private products;
    private nextId;
    findAll(query: ListProductsQueryDto): Product[];
    findOne(id: string): Product;
    create(dto: CreateProductDto): Product;
    update(id: string, dto: UpdateProductDto): Product;
    updatePartial(id: string, dto: PatchProductDto): Product;
    remove(id: string): void;
}
export {};
