import { Order } from './orders.entity';
export declare class OrderItem {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    order: Order;
}
