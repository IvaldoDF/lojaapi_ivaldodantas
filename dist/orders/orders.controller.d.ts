import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<import("./orders.entity").Order>;
    findAll(): Promise<import("./orders.entity").Order[]>;
    findOne(id: number): Promise<import("./orders.entity").Order>;
    cancel(id: number): Promise<import("./orders.entity").Order>;
    pay(id: number): Promise<import("./orders.entity").Order>;
}
