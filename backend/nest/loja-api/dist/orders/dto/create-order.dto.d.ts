declare class OrderItemInput {
    productId: number;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemInput[];
}
export {};
