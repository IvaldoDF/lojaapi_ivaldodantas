import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './orders.entity';
export declare class OrdersService {
    private readonly ordersRepository;
    private readonly dataSource;
    constructor(ordersRepository: Repository<Order>, dataSource: DataSource);
    findAll(): Promise<Order[]>;
    findAllForUser(userId: number): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    create(dto: CreateOrderDto, userId?: number | null): Promise<Order>;
    cancel(id: number): Promise<Order>;
    pay(id: number): Promise<Order>;
    findOneForUser(id: number, userId: number): Promise<Order>;
    cancelForUser(id: number, userId: number): Promise<Order>;
    findAllForActor(userId: number, role: string): Promise<Order[]>;
    findOneForActor(id: number, userId: number, role: string): Promise<Order>;
    cancelForActor(id: number, userId: number, role: string): Promise<Order>;
}
