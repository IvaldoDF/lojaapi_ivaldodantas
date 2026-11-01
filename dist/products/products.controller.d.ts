type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
};
export declare class ProductsController {
    private products;
    private nextId;
    findAll(q?: string): Product[];
    findOne(id: string): Product;
    create(body: {
        name: string;
        price: number;
        stock: number;
    }): Product;
    update(id: string, body: {
        name: string;
        price: number;
        stock: number;
    }): Product;
    updatePartial(id: string, body: {
        name?: string;
        price?: number;
        stock?: number;
    }): Product;
    remove(id: string): void;
}
export {};
