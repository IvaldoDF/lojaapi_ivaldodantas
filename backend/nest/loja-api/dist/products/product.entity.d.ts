import { Category } from '../categories/category.entity';
export declare class Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: Category;
    category_id: number;
    imageFilenames: string | null;
}
