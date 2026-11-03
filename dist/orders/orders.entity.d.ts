import { OrderItem } from './orders-item.entity';
export type OrderStatus = 'OPEN' | 'PAID' | 'CANCELLED';
export declare class Order {
    id: number;
    userId: number | null;
    status: OrderStatus;
    createdAt: Date;
    items: OrderItem[];
}
