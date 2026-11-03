import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: {
        user: {
            userId: number;
        };
    }, dto: CreateOrderDto): Promise<import("./orders.entity").Order>;
    findAll(req: {
        user: {
            userId: number;
            role: string;
        };
    }): Promise<import("./orders.entity").Order[]>;
    findOne(req: {
        user: {
            userId: number;
            role: string;
        };
    }, id: number): Promise<import("./orders.entity").Order>;
    cancel(req: {
        user: {
            userId: number;
            role: string;
        };
    }, id: number): Promise<import("./orders.entity").Order>;
}
